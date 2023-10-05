import { DocumentSnapshot, deleteDoc, doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../Services/firebase/firebase";
interface ProfessionalInterface {
    name: string;
    occupations: string[];
    email: string;
    isAdmin: boolean;
    services: string[];
    shift: boolean[][];
    images: string[];
}
export class Professional {
    private _id: string
    private _name: string;
    private _occupations: string[];
    private _email: string;
    private _isAdmin: boolean;
    private _services: string[];
    private _shift: boolean[][];
    private _images: string[]

    constructor(
        id: string = "",
        name: string = "",
        occupations: string[] = [],
        email: string = "",
        isAdmin: boolean = false,
        services: string[] = [],
        shift: boolean[][] = [],
        images: string[] = []
    ) {
        this._id = id;
        this._name = name;
        this._occupations = occupations;
        this._email = email;
        this._isAdmin = isAdmin;
        this._services = services;
        this._shift = shift;
        this._images = images;
    }

    // Getters
    getId(): string {
        return this._id;
    }

    getName(): string {
        return this._name;
    }

    getOccupations(): string[] {
        return this._occupations;
    }

    getEmail(): string {
        return this._email;
    }

    getIsAdmin(): boolean {
        return this._isAdmin;
    }

    getServices(): string[] {
        return this._services;
    }

    getShift(): boolean[][] {
        return this._shift;
    }

    getImages(): string[] {
        return this._images;
    }

    // Setters
    setId(id: string) {
        this._id = id;
    }

    setName(name: string) {
        this._name = name;
    }

    setOccupations(occupations: string[]) {
        this._occupations = occupations;
    }

    setEmail(email: string) {
        this._email = email;
    }

    setIsAdmin(isAdmin: boolean) {
        this._isAdmin = isAdmin;
    }

    setServices(services: string[]) {
        this._services = services;
    }

    setShift(shift: boolean[][]) {
        this._shift = shift;
    }

    setImages(images: string[]) {
        this._images = images;
    }

    //Fill professional methods

    private fillFromSnapshot(snap: DocumentSnapshot) {
        const profData = snap.data();
        this._id = snap.id
        this._name = profData!.name
        this._occupations = profData!.occupations
        this._email = profData!.email
        this._isAdmin = profData!.isAdmin
        this._services = profData!.services
        this._shift = profData!.shift
        this._images = profData!.images
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
        const propertiesToUpdate: (keyof ProfessionalInterface)[] = ["name", "occupations", "email", "isAdmin", "services", "shift", "images"];

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
            name: this._name,
            occupations: this._occupations,
            email: this._email,
            isAdmin: this._isAdmin,
            services: this._services,
            shift: this._shift,
            images: this._images
        };
    }

    private async updateTimeStamp() {
        const userRef = doc(db, "professionals_dev", this._id);
        await updateDoc(userRef, { timestamp: serverTimestamp() });
    }

}