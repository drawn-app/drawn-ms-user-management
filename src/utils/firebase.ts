import { initializeApp } from 'firebase/app';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  //...
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN, 
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export const uploadImage = async (file: File,path : string) => {
    if (!file) {
        throw new Error("File is required");
    }
    // get file size in MB
    const fileSize = file.size / 1024 / 1024;
    if (fileSize > 20) {
        throw new Error("File size must be less than 20MB");
    }
    const storageRef = ref(storage, `${path}/${(new Date()).getTime()}-${file.name}`);
    const fileURL = await uploadBytes(storageRef, file).then(async (snapshot) => {
        return await getDownloadURL(snapshot.ref);
    });
    return fileURL;
}