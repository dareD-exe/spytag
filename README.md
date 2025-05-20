# CoC Stats - Clash of Clans Statistics

A modern web application for tracking Clash of Clans player and clan statistics, built with React, Vite, Tailwind CSS, and Firebase.

## Features

- Player statistics tracking
- Clan performance analytics
- War record analysis
- Dark themed UI with smooth animations
- User authentication with Firebase

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- NPM or Yarn
- Firebase account

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd coc-stats
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a Firebase project
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" and follow the setup steps
   - Name your project (e.g., "coc-stats" or "clash-stats")

4. Enable Firebase Authentication
   - In your Firebase project, go to Authentication > Sign-in method
   - Enable Email/Password and Google providers

5. Set up Firestore Database
   - Go to Firestore Database and click "Create database"
   - Start in production mode or test mode (you can adjust rules later)
   - Choose a location closest to your user base

6. Get your Firebase configuration
   - In your Firebase project, go to Project Settings > General
   - Scroll down to "Your apps" section
   - If no app is registered, add a web app (click the </> icon)
   - Register the app with a nickname (e.g., "CoC Stats Web")
   - Copy the firebaseConfig object

7. Create a `.env` file in the project root with your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
   ```

8. Start the development server
   ```
   npm run dev
   ```

## Clash of Clans API (Future Integration)

For future integration with the official Clash of Clans API:

1. Create a developer account at [developer.clashofclans.com](https://developer.clashofclans.com)
2. Create a new API key for your IP address
3. Add the API key to your `.env` file:
   ```
   VITE_COC_API_KEY=your-coc-api-key
   ```

## Deployment

This project can be easily deployed to Vercel, Netlify, or Firebase Hosting. For Firebase Hosting:

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login to Firebase: `firebase login`
3. Initialize Firebase: `firebase init`
4. Deploy: `firebase deploy`

## Development

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
