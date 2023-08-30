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

    public getId(): string {
        return this._id;
    }

    public setId(value: string) {
        this._id = value;
    }

    public getName(): string {
        return this._name;
    }

    public setName(value: string) {
        this._name = value;
    }

    public getValue(): string {
        return this._value;
    }

    public setValue(value: string) {
        this._value = value;
    }

    public getPhoto(): string {
        return this._photo;
    }

    public setPhoto(value: string) {
        this._photo = value;
    }

    public getDuration(): string {
        return this._duration;
    }

    public setDuration(value: string) {
        this._duration = value;
    }

    public getInicial(): string {
        return this._inicial;
    }

    public setInicial(value: string) {
        this._inicial = value;
    }

    public getSubServices(): Service[] {
        return this._subServices;
    }

    public setSubServices(value: Service[]) {
        this._subServices = value;
    }

    //Fill service methods

    public fillFromService(service: Service) {
        this._id = service.getId();
        this._name = service.getName();
        this._value = service.getValue();
        this._photo = service.getPhoto();
        this._duration = service.getDuration();
        this._inicial = service.getInicial();
        this._subServices = service.getSubServices();
    }

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
