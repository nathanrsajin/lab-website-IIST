import { ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js";
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { storage, db, auth } from './firebase-init.js';

/**
 * Uploads a file to Firebase Storage and saves metadata to Firestore.
 * @param {File} file - The file object to upload
 * @param {string} category - The category folder (e.g., 'Internal Datasets')
 * @param {function} progressCallback - Callback for upload progress percentage
 * @returns {Promise<string>} Download URL of the uploaded file
 */
export async function uploadFile(file, category, progressCallback) {
  if (!auth.currentUser) throw new Error("Must be authenticated to upload");

  const storageRef = ref(storage, `${category}/${Date.now()}_${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (progressCallback) progressCallback(progress);
      },
      (error) => {
        reject(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        
        // Save metadata to Firestore
        await addDoc(collection(db, "files"), {
          name: file.name,
          category: category,
          url: downloadURL,
          uploadedBy: auth.currentUser.uid,
          uploaderName: auth.currentUser.displayName || auth.currentUser.email,
          createdAt: serverTimestamp(),
          size: file.size,
          type: file.type
        });

        resolve(downloadURL);
      }
    );
  });
}

/**
 * Retrieves a list of files for a specific category from Firestore metadata.
 * @param {string} category - The category folder
 * @returns {Promise<Array>} Array of file metadata objects
 */
export async function listFiles(category) {
  if (!auth.currentUser) throw new Error("Must be authenticated to view files");

  const q = query(
    collection(db, "files"), 
    where("category", "==", category),
    // Note: requires a composite index if we orderBy, so we fetch and sort on client for simplicity unless index exists
  );

  const querySnapshot = await getDocs(q);
  const files = [];
  querySnapshot.forEach((doc) => {
    files.push({ id: doc.id, ...doc.data() });
  });

  // Sort newest first client-side to avoid requiring composite indexes immediately
  files.sort((a, b) => {
    const tA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
    const tB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
    return tB - tA;
  });

  return files;
}
