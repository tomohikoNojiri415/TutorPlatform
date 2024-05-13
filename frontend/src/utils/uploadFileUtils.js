import { v4 as uuid } from "uuid";
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";
/**
 * convert an image file into its Base64 representation
 * @param {*} img
 * @param {*} callback
 */
export const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

/**
 * upload file to firebase
 * @param {*} info
 */
export const uploadFileUrl = (info, directory, callback) => {
  const path = directory + "/" + info.file.name + uuid();
  console.log("Uploading file to firebase: " + path);

  const fileRef = ref(storage, path);
  callback(path);

  uploadBytes(fileRef, info.file).then(() => {
    info.onSuccess("OK", info.file); // trigger onChange, set status to 'done'
  });
};
