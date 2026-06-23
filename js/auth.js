import { auth, db, isPlaceholder } from "./firebase-init.js";
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { 
  doc, 
  getDoc, 
  setDoc,
  collection,
  getDocs,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const provider = new GoogleAuthProvider();

/**
 * Handle user sign in
 */
export async function handleSignIn() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Check if user exists in Firestore admins collection
    const adminDocRef = doc(db, "admins", user.email);
    const adminDoc = await getDoc(adminDocRef);
    
    let role = "collaborator";
    let status = "pending";
    
    if (adminDoc.exists()) {
      role = "admin";
      status = "approved";
    } else {
      // Check if this is the first ever login to bootstrap
      try {
        const adminsSnapshot = await getDocs(collection(db, "admins"));
        if (adminsSnapshot.empty) {
          console.warn("ADMINS COLLECTION IS EMPTY! Please manually add a document in Firestore under 'admins' with ID: " + user.email);
          alert("Initial Setup: You must create the first admin manually in the Firebase Console. Add a document to the 'admins' collection with the document ID as your email address.");
        }
      } catch (e) {
        console.error("Could not check admins collection", e);
      }
      
      // If not admin, check if IIST member
      if (user.email.endsWith("@iist.ac.in")) {
        role = "member";
        status = "approved";
      }
    }

    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      // Create user record
      await setDoc(userDocRef, {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: role,
        status: status,
        createdAt: serverTimestamp(),
      });
    }

    return { user, isIIST: user.email.endsWith("@iist.ac.in"), role, status };
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
}

export async function handleSignOut() {
  try {
    await signOut(auth);
    window.location.href = "login.html";
  } catch (error) {
    console.error("Error signing out:", error);
  }
}

/**
 * Get user role and status from Firestore
 */
export async function getUserRecord(uid) {
  const userDocRef = doc(db, "users", uid);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    return userDoc.data();
  }
  return null;
}

/**
 * Submit collaborator request
 */
export async function submitAccessRequest(requestData) {
  try {
    await addDoc(collection(db, "requests"), {
      ...requestData,
      status: "pending",
      createdAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Error submitting request:", error);
    throw error;
  }
}

/**
 * Protect a route. 
 * Use requireAdmin=true for the Admin Dashboard.
 */
export function protectRoute(requireAdmin = false) {
  console.log("Firebase initialized");
  
  // IMMEDIATE FAIL if config is placeholder — do NOT attempt auth
  if (isPlaceholder) {
    console.error("protectRoute: Firebase config contains placeholder values. Cannot authenticate.");
    return Promise.reject(new Error(
      "CONFIG_ERROR: Firebase configuration in js/firebase-init.js contains placeholder values (YOUR_API_KEY, etc.). " +
      "Replace them with your real Firebase project credentials from the Firebase Console → Project Settings."
    ));
  }

  console.log("Auth listener started");
  
  return new Promise((resolve, reject) => {
    // 10 second timeout protection
    const timeoutId = setTimeout(() => {
      console.error("protectRoute: Auth listener did not fire within 10 seconds.");
      reject(new Error("AUTH_TIMEOUT: Authentication took too long. Check your network connection and Firebase project configuration."));
    }, 10000);

    onAuthStateChanged(auth, async (user) => {
      clearTimeout(timeoutId);
      console.log("User detected:", user);
      
      if (!user) {
        console.log("No user signed in. Redirecting to login.");
        window.location.href = "login.html";
        return;
      }
      
      console.log("Checking user role");
      try {
        const userRecord = await getUserRecord(user.uid);
        
        if (!userRecord) {
          console.error("No user record found in Firestore for UID:", user.uid);
          window.location.href = "login.html";
          return;
        }

        console.log("Role found:", userRecord.role);

        if (userRecord.status !== "approved") {
          console.log("User status is not approved:", userRecord.status);
          window.location.href = "login.html?status=pending";
          return;
        }

        if (requireAdmin && userRecord.role !== "admin") {
          console.log("Admin required but user role is:", userRecord.role);
          window.location.href = "members.html";
          return;
        }
        
        console.log("Rendering portal");
        resolve({ user, userRecord });
      } catch (err) {
        console.error("Error verifying permissions:", err);
        reject(err);
      }
    });
  });
}

// Hook to globally initialize auth state listeners
export function initGlobalAuthState() {
  onAuthStateChanged(auth, async (user) => {
    const adminLinkContainer = document.getElementById("adminLinkContainer");
    const loginLinkContainer = document.getElementById("loginLinkContainer");
    
    if (user) {
      const userRecord = await getUserRecord(user.uid);
      if (userRecord && userRecord.role === "admin") {
        if (adminLinkContainer) {
          adminLinkContainer.style.display = "inline-block";
        }
      }
    }
  });
}
