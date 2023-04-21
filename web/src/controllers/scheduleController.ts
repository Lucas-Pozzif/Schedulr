import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore"
import { getIds, setIds } from "./configController"
import { db } from "../firebase/firebase"

let scheduleCache = require('../cache/scheduleCache.json')

export type scheduleDayType = {
    takenAt: null | number, //null or timestamp
    service: null | number,
    state: null| number
    client: null | number,
}

type scheduleType = {
    [date: string]: scheduleDayType
}


async function addSchedule() {
    /**
     * Adds a new schedule to the database, using the next available scheduleId from the config collection.
     */
    let ids = await getIds()
    if (ids !== undefined) {
        const docRef = doc(db, 'schedules', ids!.professional.toString())
        await setDoc(docRef, {})
    }
}

async function setSchedule(schedule: scheduleType, scheduleId: string) {
    /**
     * Updates all fields of the schedule with the given scheduleId with the new values passed in.
     */
    const docRef = doc(db, 'schedules', scheduleId)
    await setDoc(docRef, schedule)
}

async function getSchedule(scheduleId: string) {
    /**
     * Adds the most recent schedule with the given scheduleId to the schedule cache, even if the local value is outdated.
     */
    const docRef = doc(db, 'schedules', scheduleId);
    const docSnap = await getDoc(docRef);

    scheduleCache[scheduleId] = docSnap.data();
}

async function getAllSchedules() {
    /**
     * Adds all the schedules to the scheduleCache, even updating the current ones
     */
    const colRef = collection(db, 'schedules');
    const querySnap = await getDocs(colRef)
    querySnap.forEach((doc) => {
        scheduleCache[doc.id] = doc.data()
    })
}

async function deleteSchedule(scheduleId: string) {
    /**
     * Deletes the schedule with the given scheduleId from the database.
     */
    const docRef = doc(db, 'schedules', scheduleId)
    await deleteDoc(docRef)
}



export { addSchedule, setSchedule, getSchedule, getAllSchedules, deleteSchedule }