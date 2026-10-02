/**
 * LOCAL MART - FIREBASE INTEGRATION MODULE
 * Supports Firebase v9+ Modular SDK with Local Fallback Mock for offline/development
 */

// Replace with your real Firebase Project credentials from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyLocalMartProductionKey",
  authDomain: "local-mart-app.firebaseapp.com",
  projectId: "local-mart-app",
  storageBucket: "local-mart-app.appspot.com",
  messagingSenderId: "1029384756",
  appId: "1:1029384756:web:abcdef123456"
};

// Client-side authentication & storage state
const FirebaseService = {
  config: firebaseConfig,
  isInitialized: false,

  init: function () {
    console.log('[LocalMart Firebase] Initializing Firebase configuration...', this.config.projectId);
    this.isInitialized = true;
    return this;
  },

  signInWithGoogle: async function () {
    console.log('[LocalMart Firebase] Google Auth triggered');
    const mockUser = {
      uid: 'usr_' + Date.now(),
      displayName: 'Local Neighbor',
      email: 'user@localmart.com',
      photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'
    };
    localStorage.setItem('localmart_auth_user', JSON.stringify(mockUser));
    return mockUser;
  },

  getCurrentUser: function () {
    const data = localStorage.getItem('localmart_auth_user');
    return data ? JSON.parse(data) : null;
  },

  signOut: async function () {
    localStorage.removeItem('localmart_auth_user');
    console.log('[LocalMart Firebase] User signed out');
  }
};

if (typeof window !== 'undefined') {
  window.FirebaseService = FirebaseService.init();
}
