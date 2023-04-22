import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

let clientCache = require('../cache/clientCache.json')

export type clientType = {
    name: string | null,
    email: string | null,
    number: string | null,
    photo: string | null,
    schedule: {
        [date: string]: {
            [timeIndex: number]: {
                service: number[],
                professional: number[]
            }
        }
    },
    lastOnline: number
}

async function getClient(clientId: string) {
    const docRef = doc(db, 'clients', clientId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        clientCache[clientId] = docSnap.data()
    } else {
        console.error('failed to find user data - there is no data on this clientId')
    }
}

async function setClient(client: clientType, clientId: string) {
    let newClient = client
    newClient.lastOnline = new Date().getTime()
    const docRef = doc(db, 'clients', clientId);
    await setDoc(docRef, client);
}

export { getClient, setClient }