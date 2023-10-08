import { DocumentSnapshot, deleteDoc, doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../Services/firebase/firebase";
interface ServiceInterface {
    id: string;
    name: string;
    value: string;
    photos: string[];
    duration: string;
    inicial: string;
    subServices: SubService[];
}

export class SubService {
    private _name: string;
    private _value: string;
    private _inicial: boolean;
    private _duration: boolean[];

    constructor(
        arg?: string | SubService,
        value: string = "",
        inicial: boolean = false,
        duration: boolean[] = [true],
    ) {
        if (typeof arg === "string") {
            // Case: Name provided, assuming default values for other properties
            this._name = arg;
            this._value = value;
            this._inicial = inicial;
            this._duration = duration;
        } else if (arg instanceof SubService) {
            // Case: Another SubService object provided
            const { _name, _value, _inicial, _duration } = arg;
            this._name = _name;
            this._value = _value;
            this._inicial = _inicial;
            this._duration = _duration;
        } else {
            // Case: No arguments or invalid argument type
            this._name = "";
            this._value = value;
            this._inicial = inicial;
            this._duration = duration;
        }
    }

    // Getters
    getName(): string {
        return this._name;
    }

    getValue(): string {
        return this._value;
    }

    getInicial(): boolean {
        return this._inicial;
    }

    getDuration(): boolean[] {
        return this._duration;
    }

    // Setters
    setName(name: string) {
        this._name = name;
    }

    setValue(value: string) {
        this._value = value;
    }

    setInicial(inicial: boolean) {
        this._inicial = inicial;
    }

    setDuration(duration: boolean[]) {
        this._duration = duration;
    }
    isValid() {
        const hasName = this._name.length > 0;
        const hasValue = this._value.length > 0
        const hasDuration = this._duration.length > 0

        return (hasName && hasValue && hasDuration)
    }

    // Convert firebase data to usualData
    fillFromFirebase(sServiceData: any) {
        this._name = sServiceData!.name;
        this._value = sServiceData!.value;
        this._inicial = sServiceData!.inicial;
        this._duration = sServiceData!.duration;
    }

    // Formatter for firebase
    getFirestoreFormat() {
        return {
            name: this._name,
            value: this._value,
            inicial: this._inicial,
            duration: this._duration,
        }
    }
}

export class Service {
    private _id: string;
    private _name: string;
    private _value: string;
    private _photos: string[];
    private _duration: boolean[];
    private _inicial: boolean;
    private _subServices: SubService[];

    constructor(
        arg?: string | Service,
        name: string = "",
        value: string = "",
        photos: string[] = [],
        duration: boolean[] = [true],
        inicial: boolean = false,
        subServices: SubService[] = []
    ) {
        if (typeof arg === "string") {
            // Case: ID provided
            this._id = arg;
            this._name = name;
            this._value = value;
            this._photos = photos;
            this._duration = duration;
            this._inicial = inicial;
            this._subServices = subServices;
        } else if (arg instanceof Service) {
            // Case: Another Service object provided
            const {
                _id,
                _name,
                _value,
                _photos,
                _duration,
                _inicial,
                _subServices,
            } = arg;
            this._id = _id;
            this._name = _name;
            this._value = _value;
            this._photos = _photos;
            this._duration = _duration;
            this._inicial = _inicial;
            this._subServices = _subServices;
        } else {
            // Case: No arguments or invalid argument type
            this._id = "";
            this._name = name;
            this._value = value;
            this._photos = photos;
            this._duration = duration;
            this._inicial = inicial;
            this._subServices = subServices;
        }
    }

    // Getters
    getId(): string {
        return this._id;
    }

    getName(): string {
        return this._name;
    }

    getValue(): string {
        return this._value;
    }

    getPhotos(): string[] {
        return this._photos;
    }

    getDuration(): boolean[] {
        return this._duration;
    }

    getInicial(): boolean {
        return this._inicial;
    }

    getSubServices(): SubService[] {
        return this._subServices;
    }

    // Setters
    setId(id: string) {
        this._id = id;
    }

    setName(name: string) {
        this._name = name;
    }

    setValue(value: string) {
        this._value = value;
    }

    setPhotos(photos: string[]) {
        this._photos = photos;
    }

    setDuration(duration: boolean[]) {
        this._duration = duration;
    }

    setInicial(inicial: boolean) {
        this._inicial = inicial;
    }

    setSubServices(subServices: SubService[]) {
        this._subServices = subServices;
    }

    //Fill service methods

    public fillFromSnapshot(snap: DocumentSnapshot) {
        const servData = snap.data();

        this._id = snap.id;
        this._name = servData!.name;
        this._value = servData!.value;
        this._photos = servData!.photos;
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
        const propertiesToUpdate: (keyof ServiceInterface)[] = ["name", "value", "photos", "duration", "inicial", "subServices"];

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
            photos: this._photos,
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

    //qol methods

    public isValid() {
        const hasName = this._name.length > 0;
        const hasValue = this._value.length > 0
        const hasDuration = this._duration.length > 0
        const subservicesValid = this._subServices.map((subservice) => subservice.isValid())

        return (hasName && hasValue && hasDuration && !subservicesValid.includes(false))
    } 
}
