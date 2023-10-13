import { GoogleAuthProvider, UserCredential, signInWithPopup, signOut } from "firebase/auth";
import { auth, db } from "../Services/firebase/firebase";
import { DocumentSnapshot, collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { Group } from "./group";

interface UserInterface {
    id: string;
    name: string;
    email: string;
    number: string[];
    photo: string;
    schedule: any;
}
const sched = {
    "23.07.2023": {
        "40": true,
        "41": true,
        "42": true,
        "43": true,
        "44": true,
    }
}

export class User {
    private _id: string;
    private _name: string;
    private _email: string;
    private _number: string;
    private _photo: string;
    private _schedule: any;

    constructor(
        arg?: string | User,
        name: string = "",
        email: string = "",
        number: string = "",
        photo: string = "",
        schedule: any = {}
    ) {
        if (typeof arg === "string") {
            // Case: Id provided, assuming default values for other properties
            this._id = arg;
            this._name = name;
            this._email = email;
            this._number = number;
            this._photo = photo;
            this._schedule = schedule;
        } else if (arg instanceof User) {
            // Case: Another User object provided
            const { _id, _name, _email, _number, _photo, _schedule } = arg;
            this._id = _id;
            this._name = _name;
            this._email = _email;
            this._number = _number;
            this._photo = _photo;
            this._schedule = _schedule;
        } else {
            // Case: No arguments or invalid argument type
            this._id = "";
            this._name = name;
            this._email = email;
            this._number = number;
            this._photo = photo;
            this._schedule = schedule;
        }
    }

    // Getters
    getId(): string {
        return this._id;
    }

    getName(): string {
        return this._name;
    }

    getEmail(): string {
        return this._email;
    }

    getNumber(): string {
        return this._number;
    }

    getPhoto(): string {
        return this._photo;
    }

    getSchedule(): any {
        return this._schedule;
    }

    // Setters
    setId(id: string) {
        this._id = id;
    }

    setName(name: string) {
        this._name = name;
    }

    setEmail(email: string) {
        this._email = email;
    }

    setNumber(number: string) {
        this._number = number;
    }

    setPhoto(photo: string) {
        this._photo = photo;
    }

    setSchedule(schedule: any) {
        this._schedule = schedule;
    }

    //Auth methods

    public async loginWithGoogle() {
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider)
        this.fillFromGoogle(userCredential)


    }

    public async logout() {
        signOut(auth)
    }

    private fillFromGoogle(userCredential: UserCredential) {
        const user = userCredential.user
        this._id = user.uid
        this._name = user.displayName || ""
        this._email = user.email || ""
        this._number = user.phoneNumber || ""
        this._photo = user.photoURL || ""
    }

    //Fill service methods

    public fillFromSnapshot(snap: DocumentSnapshot) {
        const servData = snap.data();

        this._id = snap.id;
        this._name = servData!.name;
        this._email = servData!.email;
        this._number = servData!.number;
        this._photo = servData!.photo;
        this._schedule = servData!.schedule;
    }

    //Firestore methods

    public async setUser() {
        if (this._id == "") {
            return console.error("no id was found");
        }

        const docRef = doc(db, "users", this._id);
        await setDoc(docRef, this.getFirestoreFormat());
        await this.updateTimeStamp();
    }

    public async updateUser(updates: Partial<UserInterface>) {
        if (this._id == "") {
            return console.error("no id was found");
        }

        const docRef = doc(db, "users", this._id);
        const propertiesToUpdate: (keyof UserInterface)[] = ["id", "name", "email", "number", "photo", "schedule"];

        propertiesToUpdate.map((prop) => {
            if (updates[prop] !== undefined) {
                (this as any)[`_${prop}`] = updates[prop]!;
            }
        });
        console.log(updates)

        await updateDoc(docRef, updates);
        await this.updateTimeStamp();
    }

    public async getUser(id: string) {
        const docRef = doc(db, "users", id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.data()) return

        this.fillFromSnapshot(docSnap);
    }

    public async deleteUser() {
        if (this._id == "") {
            return console.error("no id was found");
        }

        const docRef = doc(db, "users", this._id);
        await deleteDoc(docRef);
    }

    public async checkUser() {
        const docRef = doc(db, "users", this._id);
        const docSnap = await getDoc(docRef);
        return docSnap.data() !== undefined

    }

    public async getGroups() {
        const snapArray: any[] = []
        const querySnapshot = await getDocs(collection(db, "groups"));

        querySnapshot.forEach((snap) => {
            snapArray.push(snap)
        })
        const promises = snapArray.map(async (snap) => {
            const group = new Group();
            group.fillFromSnapshot(snap);
            await group.downloadImages();
            return group;
        });

        const groupArray = await Promise.all(promises);
        return groupArray

    }

    private getFirestoreFormat() {
        return {
            id: this._id,
            name: this._name,
            email: this._email,
            number: this._number,
            photo: this._photo,
            schedule: this._schedule
        };
    }

    private async updateTimeStamp() {
        const userRef = doc(db, "users", this._id);
        await updateDoc(userRef, { timestamp: serverTimestamp() });
    }


}