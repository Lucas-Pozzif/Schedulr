import { DocumentData, DocumentSnapshot, collection, deleteDoc, doc, getDoc, getDocs, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../Services/firebase/firebase";
import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { Service } from "./service";

interface UserInterface {
  name: string;
  email: string;
  number: string;
  photo: string;
  isProfessional: boolean;
  isAdministrator: boolean;
}

export class User {
  private _id: string;
  private _name: string;
  private _email: string;
  private _number: string;
  private _photo: string;
  private _isProfessional: boolean;
  private _isAdministrator: boolean;

  constructor(id: string = "", name: string = "", email: string = "", number: string = "", photo: string = "") {
    this._id = id;
    this._name = name;
    this._email = email;
    this._number = number;
    this._photo = photo;
    this._isProfessional = false;
    this._isAdministrator = false;
  }

  //Setters and getters

  public getId(): string {
    return this._id;
  }

  public setId(id: string): void {
    this._id = id;
  }

  public getName(): string {
    return this._name;
  }

  public setName(name: string): void {
    this._name = name;
  }

  public getEmail(): string {
    return this._email;
  }

  public setEmail(email: string): void {
    this._email = email;
  }

  public getNumber(): string {
    return this._number;
  }

  public setNumber(number: string): void {
    this._number = number;
  }

  public getPhoto(): string {
    return this._photo;
  }

  public setPhoto(photo: string): void {
    this._photo = photo;
  }

  public getIsProfessional(): boolean {
    return this._isProfessional;
  }

  public setIsProfessional(isProfessional: boolean): void {
    this._isProfessional = isProfessional;
  }

  public getIsAdministrator(): boolean {
    return this._isAdministrator;
  }

  public setIsAdministrator(isAdministrator: boolean): void {
    this._isAdministrator = isAdministrator;
  }

  //Fill user methods

  public fillFromAuth() { }

  private fillFromSnapshot(snap: DocumentSnapshot) {
    const userData = snap.data();

    this._id = snap.id;
    this._name = userData!.name;
    this._email = userData!.email;
    this._number = userData!.number;
    this._photo = userData!.photo;
    this._isProfessional = userData!.isProfessional;
    this._isAdministrator = userData!.isAdministrator;
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
    const propertiesToUpdate: (keyof UserInterface)[] = ["name", "email", "number", "photo", "isProfessional", "isAdministrator"];

    propertiesToUpdate.forEach((prop) => {
      if (updates[prop] !== undefined) {
        (this as any)[`_${prop}`] = updates[prop]!;
      }
    });

    await updateDoc(docRef, { updates });
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

  private getFirestoreFormat() {
    return {
      name: this._name,
      email: this._email,
      number: this._number,
      photo: this._photo,
      isAdministrator: this._isAdministrator,
      isProfessional: this._isProfessional,
    };
  }

  private async updateTimeStamp() {
    const userRef = doc(db, "users", this._id);
    await updateDoc(userRef, { timestamp: serverTimestamp() });
  }

  //Authentication methods

  public async AuthWithGoogle() {
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
  }

  //List calling methods

  public async getServiceList() {
    const colRef = collection(db, "services")
    const querySnap = await getDocs(colRef)
    const serviceList: Service[] = [];

    querySnap.forEach((docSnap) => {
      const service = new Service();
      service.fillFromSnapshot(docSnap);
      serviceList.push(service);
    })

    serviceList.sort((a,b)=>a.getName().localeCompare(b.getName()))
    return serviceList
  }
}
