import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore"
import { db } from "../firebase/firebase"
import { getIds, idsType, setIds } from "./configController"
import { addSchedule, deleteSchedule } from "./scheduleController"

let professionalCache = require('../cache/professionalCache.json')

export type professionalType = {
    name: string,
    email: string,
    photo: string,
    occupations: string[],
    services: string[],
    disponibility: {
        0: boolean[],
        1: boolean[],
        2: boolean[],
        3: boolean[],
        4: boolean[],
        5: boolean[],
        6: boolean[],
    },
    lastOnline: string
}

async function addProfessional(professional: professionalType) {
    /**
     * Adds a new professional to the database, using the next available professionalId from the config collection.
     */
    let ids = await getIds()
    if (ids !== undefined) {
        const docRef = doc(db, 'professionals_dev', ids!.professional.toString())
        ids!.professional++
        await setIds(ids)

        await addSchedule()
        await setDoc(docRef, professional)
    }
}

async function setProfessional(professional: professionalType, professionalId?: string) {
    /**
     * Updates all fields of the professional with the given professionalId with the new values passed in.
     * If no professionalId is passed, this function will behave like addProfessional().
     */
    let docRef
    if (professionalId !== undefined) {
        docRef = doc(db, 'professionals_dev', professionalId)
    } else {
        let ids = await getIds()
        ids!.professional++

        docRef = doc(db, 'professionals_dev', ids!.professional.toString())
        await setIds(ids)
        await addSchedule()
    }
    await setDoc(docRef, professional)
}

async function getProfessional(professionalId: string) {
    /**
     * Adds the most recent professional with the given professionalId to the professional cache, even if the local value is outdated.
     */
    const docRef = doc(db, 'professionals_dev', professionalId);
    const docSnap = await getDoc(docRef);

    professionalCache[professionalId] = docSnap.data();
}

async function getAllProfessionals() {
    /**
     * Adds all the professionals to the professionalCache, even updating the current ones
     */
    const colRef = collection(db, 'professionals_dev');
    const querySnap = await getDocs(colRef)
    querySnap.forEach((doc) => {
        professionalCache[doc.id] = doc.data()
    })
}

async function deleteProfessional(professionalId: string) {
    /**
     * Deletes the professional with the given professionalId from the database.
     */
    const docRef = doc(db, 'professionals_dev', professionalId)
    await deleteSchedule(professionalId)
    await deleteDoc(docRef)
}

export { addProfessional, setProfessional, getProfessional, getAllProfessionals, deleteProfessional }