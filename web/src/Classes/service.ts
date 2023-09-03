import { DocumentSnapshot, addDoc, collection, deleteDoc, doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../Services/firebase/firebase";
import { config } from "process";

interface ServiceInterface {
    id: string;
    name: string;
    value: string;
    photo: string;
    duration: string;
    inicial: string;
    subServices: Service[];
}
export class SubService {
    private _name: string;
    private _value: string;
    private _photo: string;
    private _duration: boolean[];

    constructor(
        name: string = "",
        value: string = "",
        photo: string = "",
        duration: boolean[] = [true],
    ) {
        this._name = name;
        this._value = value;
        this._photo = photo;
        this._duration = duration;
    }
    // Getter for _name
    getName(): string {
        return this._name;
    }

    // Setter for _name
    setName(name: string): void {
        this._name = name;
    }

    // Getter for _value
    getValue(): string {
        return this._value;
    }

    // Setter for _value
    setValue(value: string): void {
        this._value = value;
    }

    // Getter for _photo
    getPhoto(): string {
        return this._photo;
    }

    // Setter for _photo
    setPhoto(photo: string): void {
        this._photo = photo;
    }

    // Getter for _duration
    getDuration(): boolean[] {
        return this._duration;
    }

    // Setter for _duration
    setDuration(duration: boolean[]): void {
        this._duration = duration;
    }


    // Convert firebase data to usualData
    fillFromFirebase(sServiceData: any) {
        this._name = sServiceData!.name;
        this._value = sServiceData!.value;
        this._photo = sServiceData!.photo;
        this._duration = sServiceData!.duration;
    }

    // Formatter for firebase
    getFirestoreFormat() {
        return {
            name: this._name,
            value: this._value,
            photo: this._photo,
            duration: this._duration,
        }
    }
}

export class Service {
    private _id: string;
    private _name: string;
    private _value: string;
    private _photo: string;
    private _duration: boolean[];
    private _inicial: boolean;
    private _subServices: SubService[];

    constructor(
        id: string = "",
        name: string = "",
        value: string = "",
        photo: string = "",
        duration: boolean[] = [true],
        inicial: boolean = false,
        subServices: SubService[] = []
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

    public getDuration(): boolean[] {
        return this._duration;
    }

    public setDuration(value: boolean[]) {
        this._duration = value;
    }

    public getInicial(): boolean {
        return this._inicial;
    }

    public setInicial(value: boolean) {
        this._inicial = value;
    }

    public getSubServices(): SubService[] {
        return this._subServices;
    }

    public setSubServices(value: SubService[]) {
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
        this._subServices = servData!.subServices.map((sServiceData: any) => {
            const sService = new SubService()
            sService.fillFromFirebase(sServiceData)
            return sService
        });
    }

    //Firestore methods

    public async addService() {
        this._id = await this.updateServiceId()
        await this.setService()
    }

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

        propertiesToUpdate.map((prop) => {
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
        const subServiceFormats = this._subServices.map((sService: SubService) => {
            return sService.getFirestoreFormat()
        })
        return {
            name: this._name,
            value: this._value,
            photo: this._photo,
            duration: this._duration,
            inicial: this._inicial,
            subServices: subServiceFormats
        };
    }

    private async updateTimeStamp() {
        const userRef = doc(db, "services", this._id);
        await updateDoc(userRef, { timestamp: serverTimestamp() });
    }

    private async updateServiceId() {
        const docRef = doc(db, "config", "ids")
        const configSnap = await getDoc(docRef)
        if (!configSnap.data()) return

        var config = configSnap.data()
        config!.service++
        await setDoc(docRef, config)

        return configSnap.data()!.service.toString()
    }

    //Life quality metods

    public addSubService() {
        if (!this._subServices.length) {
            this._subServices.push(new SubService());
            this.convertToSubservice();
        }
        else {
            this._subServices.push(new SubService())
        }
    }

    public removeSubService(index: number) {
        if (index >= this._subServices.length) return
        if (this._subServices.length == 1) {
            this.convertToService(index)
            this._subServices = []
        }
        this._subServices.splice(index, 1)
    }

    public hasEnoughData() {
        const hasName = this._name != "";
        const hasValue = this._value != "";
        const hasDuration = this._duration.length > 1
        const hasSubservices = this._subServices.length > 0

        if (!hasName) return "missing name"
        if (!hasValue && !hasSubservices) return "missing value"
        if (!hasDuration && !hasSubservices) return "missing duration"
        if (hasSubservices) {
            const subServiceComplains = this._subServices.map((sService, index) => {
                const hasSName = sService.getName() != ""
                const hasSValue = sService.getValue() != ""
                const hasSDuration = sService.getDuration().length > 1

                if (!hasSName) return `missing name on the ${index + 1}º subservice`
                if (!hasSValue) return `missing value on the ${sService.getName()} subservice`
                if (!hasSDuration) return `missing duration on the ${sService.getName()} subservice`
                else return true
            })
            const firstNonTrue = subServiceComplains.find(i => i !== true)
            return firstNonTrue !== undefined ? firstNonTrue : true
        }
        else return true
    }

    private convertToSubservice() {
        this._subServices[0].setValue(this._value)
        this._subServices[0].setDuration(this._duration)
        this._value = "";
        this._duration = [true];
    }

    private convertToService(index: number) {
        this._value = this._subServices[index].getValue();
        this._duration = this._subServices[index].getDuration();
    }
}
