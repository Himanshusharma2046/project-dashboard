# Project Dashboard

A simple project management dashboard built with React and Firebase that allows users to create, view, and delete their projects.

##  Live Demo

[View Live Demo](your-deployed-url-here)

##  Features

- **Authentication**: Email and password-based authentication using Firebase Auth
- **Create Projects**: Add new projects with name and description
- **View Projects**: See all your projects in a clean dashboard
- **Delete Projects**: Remove projects you no longer need
- **Data Security**: Users can only access their own data through Firestore security rules
- **Auto Date**: Projects automatically get a creation timestamp

##  Tech Stack

- **Frontend**: React 18
- **Backend**: Firebase (Authentication + Firestore)
- **Deployment**: Vercel/Netlify
- **Styling**: CSS with custom color palette

##  Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

##  Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd assign
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Email/Password Authentication**:
   - Go to Authentication > Sign-in method
   - Enable Email/Password provider
4. Create a **Firestore Database**:
   - Go to Firestore Database
   - Create database in production mode
   - Deploy the security rules (see below)

### 4. Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```

2. Get your Firebase config from Firebase Console:
   - Go to Project Settings > Your apps
   - Copy the configuration values

3. Update `.env` with your Firebase credentials:
   ```
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

### 5. Deploy Firestore Security Rules

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init firestore
   ```

4. Deploy the security rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

### 6. Run the Application

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

##  Firestore Security Rules

The following security rules ensure users can only access their own data:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /projects/{projectId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      allow delete: if request.auth != null && request.auth.uid == resource.data.userId;
      allow update: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

**Key Security Features**:
- Users must be authenticated to perform any operations
- Users can only read their own projects (userId match)
- Users can only create projects with their own userId
- Users can only delete/update their own projects

##  Project Structure

```
assign/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Auth.js          # Login/Signup component
│   │   ├── Auth.css
│   │   ├── Dashboard.js     # Main dashboard component
│   │   └── Dashboard.css
│   ├── firebase.js          # Firebase configuration
│   ├── App.js               # Main app component
│   ├── index.js             # App entry point
│   └── index.css            # Global styles
├── firestore.rules          # Firestore security rules
├── .env.example             # Example environment variables
├── .gitignore
├── package.json
└── README.md
```

##  Deployment

### Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Add environment variables in Vercel dashboard

### Deploy to Netlify

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `build` folder to Netlify

3. Add environment variables in Netlify dashboard

##  Color Palette

- Primary: `#22223b`
- Secondary: `#4a4e69`
- Tertiary: `#9a8c98`
- Accent: `#c9ada7`
- Background: `#f2e9e4`

##  Features Explained

### Authentication Flow
- Users can sign up with email and password
- Password must be at least 6 characters
- After login, users are redirected to the dashboard
- Logout button available in the dashboard header

### Project Management
- **Create**: Click "Create New Project" button, fill in name and description
- **View**: All projects displayed in a grid layout with creation date
- **Delete**: Each project has a delete button with confirmation dialog
- **Real-time Updates**: Projects update instantly using Firestore listeners

##  Design Decisions

1. **Simple UI**: Clean, minimalist design focusing on functionality
2. **Real-time Updates**: Using Firestore onSnapshot for instant data sync
3. **Security First**: Strict Firestore rules ensuring data isolation
4. **Responsive Design**: Works on desktop and mobile devices
5. **User Experience**: Loading states, error handling, and confirmations

##  Troubleshooting

### Firebase Connection Issues
- Verify all environment variables are set correctly
- Check Firebase project configuration
- Ensure Authentication and Firestore are enabled

### Build Errors
- Delete `node_modules` and run `npm install` again
- Clear cache: `npm cache clean --force`

### Security Rules Not Working
- Deploy rules using Firebase CLI
- Check rules in Firebase Console under Firestore > Rules


