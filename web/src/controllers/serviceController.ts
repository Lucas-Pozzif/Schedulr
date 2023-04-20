import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore"
import { db } from "../firebase/firebase"
import { getIds, idsType, setIds } from "./configController"

let serviceCache = require('../cache/serviceCache.json')

export type serviceType = {
    name: string,
    stateNames: string[],
    stateValues: number[],
    stateDurations: {
        0: boolean[],
        1: boolean[],
        2: boolean[],
        3: boolean[],
    },
    haveStates: boolean,
    photo: string | null,
    inicial: boolean,
    value: number,
    duration: boolean[],
    promotion: {
        currentPromotion: null | string, //promotionId
        promotedUntil: null | string,
    }
}

async function addService(service: serviceType) {
    /**
     * Adds a new service to the database, using the next available serviceId from the config collection.
     */
    let ids = await getIds()
    if (ids !== undefined) {
        const docRef = doc(db, 'services', ids!.service.toString())
        await setDoc(docRef, service)
        ids!.service++
        await setIds(ids)
    }
}

async function setService(service: serviceType, serviceId?: string) {
    /**
     * Updates all fields of the service with the given serviceId with the new values passed in.
     * If no serviceId is passed, this function will behave like addService().
     */
    let docRef
    if (serviceId !== undefined) {
        docRef = doc(db, 'services', serviceId)
    } else {
        let ids = await getIds()
        ids!.service++

        docRef = doc(db, 'services', ids!.service.toString())
        await setIds(ids)
    }
    await setDoc(docRef, service)
}

async function getService(serviceId: string) {
    /**
     * Adds the most recent service with the given serviceId to the service cache, even if the local value is outdated.
     */
    const docRef = doc(db, 'services', serviceId);
    const docSnap = await getDoc(docRef);

    serviceCache[serviceId] = docSnap.data();
}

async function getAllServices() {
    /**
     * Adds all the services to the serviceCache, even updating the current ones
     */
    const colRef = collection(db, 'services');
    const querySnap = await getDocs(colRef)
    querySnap.forEach((doc) => {
        serviceCache[doc.id] = doc.data()
    })
}

async function deleteService(serviceId: string) {
    /**
     * Deletes the service with the given serviceId from the database.
     */
    const docRef = doc(db, 'services', serviceId)
    await deleteDoc(docRef)
}

export { addService, setService, getService, getAllServices, deleteService }