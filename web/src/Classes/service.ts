import { DocumentSnapshot, deleteDoc, doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../Services/firebase/firebase";

interface ServiceInterface {
    id: string;
    name: string;
    value: string;
    photo: string;
    duration: string;
    inicial: string;
    subServices: Service[];
}

export class Service {
    private _id: string;
    private _name: string;
    private _value: string;
    private _photo: string;
    private _duration: string;
    private _inicial: string;
    private _subServices: Service[];

    constructor(
        id: string = "",
        name: string = "",
        value: string = "",
        photo: string = "",
        duration: string = "",
        inicial: string = "",
        subServices: Service[] = []
    ) {
        this._id = id;
        this._name = name;
        this._value = value;
        this._photo = photo;
        this._duration = duration;
        this._inicial = inicial;
        this._subServices = subServices;
    }

    // Getters and setters

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get value(): string {
        return this._value;
    }

    set value(value: string) {
        this._value = value;
    }

    get photo(): string {
        return this._photo;
    }

    set photo(value: string) {
        this._photo = value;
    }

    get duration(): string {
        return this._duration;
    }

    set duration(value: string) {
        this._duration = value;
    }

    get inicial(): string {
        return this._inicial;
    }

    set inicial(value: string) {
        this._inicial = value;
    }

    get subServices(): Service[] {
        return this._subServices;
    }

    set subServices(value: Service[]) {
        this._subServices = value;
    }

    //Fill user methods

    public fillFromAuth() { }

    private fillFromSnapshot(snap: DocumentSnapshot) {
        const servData = snap.data();

        this._id = snap.id;
        this._name = servData!.name;
        this._value = servData!.value;
        this._photo = servData!.photo;
        this._duration = servData!.duration;
        this._inicial = servData!.inicial;
        this._subServices = servData!.subServices;
    }

    //Firestore methods

    public async setService() {
        if (this._id == "") {
            return console.error("no id was found");
        }

        const docRef = doc(db, "services", this._id);
        await setDoc(docRef, this.getFirestoreFormat());
        await this.updateTimeStamp();
    }

    public async updateService(updates: Partial<ServiceInterface>) {
        if (this._id == "") {
            return console.error("no id was found");
        }

        const docRef = doc(db, "services", this._id);
        const propertiesToUpdate: (keyof ServiceInterface)[] = ["name", "value", "photo", "duration", "inicial", "subServices"];

        propertiesToUpdate.forEach((prop) => {
            if (updates[prop] !== undefined) {
                (this as any)[`_${prop}`] = updates[prop]!;
            }
        });

        await updateDoc(docRef, { updates });
        await this.updateTimeStamp();
    }

    public async getService(id: string) {
        const docRef = doc(db, "services", id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.data()) return

        this.fillFromSnapshot(docSnap);
    }

    public async deleteService() {
        if (this._id == "") {
            return console.error("no id was found");
        }

        const docRef = doc(db, "services", this._id);
        await deleteDoc(docRef);
    }

    private getFirestoreFormat() {
        return {
            name: this._name,
            value: this._value,
            photo: this._photo,
            duration: this._duration,
            inicial: this._inicial,
            subServices: this._subServices,
        };
    }

    private async updateTimeStamp() {
        const userRef = doc(db, "services", this._id);
        await updateDoc(userRef, { timestamp: serverTimestamp() });
    }
}
