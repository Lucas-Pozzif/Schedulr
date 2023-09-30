import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore"
import { getIds, setIds } from "./configController"
import { db } from "../firebase/firebase"

let occupationCache = require('../cache/occupationCache.json')

export type occupationType = {
    name: string
}

async function addOccupation(occupation: occupationType) {

    let ids = await getIds()
    if (ids !== undefined) {
        const docRef = doc(db, 'occupations', ids!.occupation.toString())
        await setDoc(docRef, occupation)
        ids!.occupation++
        await setIds(ids)
    }
}

async function getOccupation(occupationId: string) {
    const docRef = doc(db, 'occupations', occupationId);
    const docSnap = await getDoc(docRef);

    occupationCache[occupationId] = docSnap.data();
}

async function getAllOccupations() {
    const colRef = collection(db, 'occupations');
    const querySnap = await getDocs(colRef)
    querySnap.forEach((doc) => {
        occupationCache[doc.id] = doc.data()
    })
}

async function deleteOccupation(occupationId: string) {
    const docRef = doc(db, 'occupations', occupationId)
    await deleteDoc(docRef)
}

export { addOccupation, getOccupation, getAllOccupations, deleteOccupation }