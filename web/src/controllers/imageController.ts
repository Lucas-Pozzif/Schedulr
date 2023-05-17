import { getDownloadURL, ref, uploadBytes, uploadString } from "firebase/storage";
import { storage } from "../firebase/firebase";
import { getIds } from "./configController";

async function uploadDataUrl(file: any, path: string, professionalId?: number) {
    const ids = professionalId ? professionalId : (await getIds()).professional
    console.log(ids)
    const storageRef = ref(storage, `${path}/${ids}`);

    await uploadString(storageRef, file, 'data_url')

    const downloadURL = await getDownloadURL(storageRef);
    console.log(downloadURL)
    return downloadURL;
}

export { uploadDataUrl }