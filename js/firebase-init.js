import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js";

// TODO: Replace with actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyA75PEBr3-U1gKqXK_sEo4E5nrnaQYdzIE",
  authDomain: "cvvr-lab.firebaseapp.com",
  projectId: "cvvr-lab",
  storageBucket: "cvvr-lab.firebasestorage.app",
  messagingSenderId: "694573147723",
  appId: "1:694573147723:web:38dee43d7d568570494fce"
};

// Detect placeholder configuration and warn immediately
const isPlaceholder = firebaseConfig.apiKey.startsWith("YOUR_");
if (isPlaceholder) {
  console.error(
    "%c[FIREBASE CONFIG ERROR] firebase-init.js contains placeholder values. " +
    "Replace YOUR_API_KEY, YOUR_AUTH_DOMAIN, etc. with real Firebase project credentials. " +
    "Authentication WILL NOT WORK until this is done.",
    "color: red; font-weight: bold; font-size: 14px;"
  );
}

let app, auth, db, storage;
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  console.log("Firebase SDK initialized", isPlaceholder ? "(WARNING: using placeholder config)" : "(config OK)");
} catch (err) {
  console.error("Firebase initialization FAILED:", err);
  throw err;
}

export { app, auth, db, storage, isPlaceholder };
