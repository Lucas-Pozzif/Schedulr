import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

let clientCache = require('../cache/clientCache.json')

type clientType = {
    name: string,
    email: string,
    number: string,
    photo: string,
    lastOnline: string
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

async function setClient(clientId: string) {
    const docRef = doc(db, 'clients', clientId);
    await setDoc(docRef, clientCache[clientId]);
}

export { getClient }