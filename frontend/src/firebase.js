import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  storageBucket: "gs://vc-tutor-management.appspot.com",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
