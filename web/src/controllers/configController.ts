import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "../firebase/firebase"

type colorsType = {
    primary: string,
    secondary: string,
    terciary: string,
}
export type idsType = {
    service: number,
    occupation:number
}

async function getIds(): Promise<idsType> {
    /**
     * Grab and return the current id values
     */
    const docRef = doc(db, 'config', 'ids');
    const docSnap = await getDoc(docRef);
    return docSnap.data() as idsType
}
async function setIds(ids: idsType) {
    const docRef = doc(db, 'config', 'ids')
    setDoc(docRef, ids)
}

export { getIds, setIds }