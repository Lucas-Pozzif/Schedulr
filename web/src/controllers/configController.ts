import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "../firebase/firebase"

let designCache = require('../cache/designCache.json')

type colorsType = {
    primary: string,
    secondary: string,
    terciary: string,
}
export type idsType = {
    service: number,
    occupation: number,
    professional: number
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

async function getDesigns() {
    const docRef = doc(db, 'config', 'design');
    const docSnap = await getDoc(docRef);

    designCache['0'] = docSnap.data();
}

export { getIds, setIds, getDesigns }