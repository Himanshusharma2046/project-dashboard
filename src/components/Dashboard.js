import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { collection, addDoc, deleteDoc, doc, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';
import './Dashboard.css';

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, 'projects'),
      where('userId', '==', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(projectsData);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'projects'), {
        name: projectName,
        description: projectDescription,
        createdAt: new Date().toISOString(),
        userId: auth.currentUser.uid
      });
      setProjectName('');
      setProjectDescription('');
      setShowForm(false);
    } catch (err) {
      console.error('Error creating project:', err);
      alert('Failed to create project');
    }
    setLoading(false);
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteDoc(doc(db, 'projects', projectId));
      } catch (err) {
        console.error('Error deleting project:', err);
        alert('Failed to delete project');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>My Projects</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>

      <div className="dashboard-content">
        <div className="create-section">
          {!showForm ? (
            <button onClick={() => setShowForm(true)} className="create-btn">
              + Create New Project
            </button>
          ) : (
            <form onSubmit={handleCreateProject} className="project-form">
              <input
                type="text"
                placeholder="Project Name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
              />
              <textarea
                placeholder="Project Description"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                required
                rows="4"
              />
              <div className="form-actions">
                <button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="cancel-btn">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="projects-list">
          {projects.length === 0 ? (
            <p className="empty-state">No projects yet. Create your first project!</p>
          ) : (
            projects.map((project) => (
              <div key={project.id} className="project-card">
                <div className="project-header">
                  <h3>{project.name}</h3>
                  <button 
                    onClick={() => handleDeleteProject(project.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
                <p className="project-description">{project.description}</p>
                <p className="project-date">Created: {formatDate(project.createdAt)}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
