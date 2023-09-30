import { DocumentSnapshot, deleteDoc, doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../Services/firebase/firebase";
interface ProfessionalInterface {
    name: string;
    email: string;
    photo: string;
    occupations: string[];
    services: string[];
    comercialTime: {
        0: boolean[]; // Monday
        1: boolean[]; // Tuesday
        2: boolean[]; // Wednesday
        3: boolean[]; // Thursday
        4: boolean[]; // Friday
        5: boolean[]; // Saturday
        6: boolean[]; // Sunday
    };
}

export class Professional {
    private _id: string //this isn't meant to be the same of the user account
    private _name: string;
    private _email: string;
    private _photo: string;
    private _occupations: string[];
    private _services: string[];
    private _comercialTime: {
        0: boolean[]; // Monday
        1: boolean[]; // Tuesday
        2: boolean[]; // Wednesday
        3: boolean[]; // Thursday
        4: boolean[]; // Friday
        5: boolean[]; // Saturday
        6: boolean[]; // Sunday
    };

    constructor(
        id: string = "",
        name: string = "",
        email: string = "",
        photo: string = "",
        occupations: string[] = []
    ) {
        this._id = id;
        this._name = name;
        this._email = email;
        this._photo = photo;
        this._occupations = occupations;
        this._services = [];
        this._comercialTime = {
            0: Array(24).fill(false), // Monday
            1: Array(24).fill(false), // Tuesday
            2: Array(24).fill(false), // Wednesday
            3: Array(24).fill(false), // Thursday
            4: Array(24).fill(false), // Friday
            5: Array(24).fill(false), // Saturday
            6: Array(24).fill(false), // Sunday
        };
    }

    //Setters and getters

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

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        this._email = value;
    }

    get photo(): string {
        return this._photo;
    }

    set photo(value: string) {
        this._photo = value;
    }

    get occupations(): string[] {
        return this._occupations;
    }

    set occupations(value: string[]) {
        this._occupations = value;
    }

    get services(): string[] {
        return this._services;
    }

    set services(value: string[]) {
        this._services = value;
    }

    get comercialTime(): {
        0: boolean[];
        1: boolean[];
        2: boolean[];
        3: boolean[];
        4: boolean[];
        5: boolean[];
        6: boolean[];
    } {
        return this._comercialTime;
    }

    set comercialTime(value: {
        0: boolean[];
        1: boolean[];
        2: boolean[];
        3: boolean[];
        4: boolean[];
        5: boolean[];
        6: boolean[];
    }) {
        this._comercialTime = value;
    }

    //Fill professional methods

    private fillFromSnapshot(snap: DocumentSnapshot) {
        const profData = snap.data();
        this._id = snap.id
        this._name = profData!.name
        this._email = profData!.email
        this._photo = profData!.photo
        this._occupations = profData!.occupations
        this._services = profData!.services
        this._comercialTime = profData!.comercialTime
    }

    //Firestore methods

    public async setProfessional() {
        if (this._id == "") {
            return console.error("no id was found");
        }

        const docRef = doc(db, "professionals_dev", this._id);
        await setDoc(docRef, this.getFirestoreFormat());
        await this.updateTimeStamp();
    }

    public async updateProfessional(updates: Partial<ProfessionalInterface>) {
        if (this._id == "") {
            return console.error("no id was found");
        }

        const docRef = doc(db, "professionals_dev", this._id);
        const propertiesToUpdate: (keyof ProfessionalInterface)[] = ["name", "email", "photo", "occupations", "services", "comercialTime"];

        propertiesToUpdate.forEach((prop) => {
            if (updates[prop] !== undefined) {
                (this as any)[`_${prop}`] = updates[prop]!;
            }
        });

        await updateDoc(docRef, { updates });
        await this.updateTimeStamp();
    }

    public async getProfessional(id: string) {
        const docRef = doc(db, "professionals_dev", id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.data()) return

        this.fillFromSnapshot(docSnap);
    }

    public async deleteProfessional() {
        if (this._id == "") {
            return console.error("no id was found");
        }

        const docRef = doc(db, "professionals_dev", this._id);
        await deleteDoc(docRef);
    }

    private getFirestoreFormat() {
        return {
            id: this._id,
            name: this._name,
            email: this._email,
            photo: this._photo,
            occupations: this._occupations,
            services: this._services,
            comercialTime: this._comercialTime
        };
    }

    private async updateTimeStamp() {
        const userRef = doc(db, "professionals_dev", this._id);
        await updateDoc(userRef, { timestamp: serverTimestamp() });
    }

}