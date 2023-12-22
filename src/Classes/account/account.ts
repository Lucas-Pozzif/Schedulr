import { DocumentData, DocumentSnapshot, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { Schedule } from "../classes-imports";
import { db } from "../../Services/firebase/firebase";

export class Account {
  private _id: string;
  private _name: string;
  private _email: string;
  private _number: string;
  private _profile: string;
  private _schedule: Schedule;
  private _groups: string[]; //Groups where you are the owner or a admin

  constructor(arg?: string | Account, name: string = "", email: string = "", number: string = "", profile: string = "", schedule: Schedule = {}, groups: string[] = []) {
    if (arg instanceof Account) {
      const { _id, _name, _email, _number, _profile, _schedule, _groups } = arg;

      this._id = _id;
      this._name = _name;
      this._email = _email;
      this._number = _number;
      this._profile = _profile;
      this._schedule = _schedule;
      this._groups = _groups;
    } else {
      this._id = arg || "";
      this._name = name;
      this._email = email;
      this._number = number;
      this._profile = profile;
      this._schedule = schedule;
      this._groups = groups;
    }
  }

  // Getter
  public get(attribute: "id" | "name" | "email" | "number" | "profile" | "schedule" | "groups") {
    return (this as any)[`_${attribute}`];
  }

  // Database comunication
  private firestoreFormat() {
    return { name: this._name, email: this._email, number: this._number, profile: this._profile, groups: this._groups };
  }

  private fillAccount(accSnap: DocumentSnapshot<DocumentData, DocumentData>) {
    if (!accSnap.data()) {
      console.error("no data was found, the id is incorrect or this account was not created yet");
    } else {
      const accData = accSnap.data();

      this._id = accSnap.id;
      this._name = accData?.name || "";
      this._email = accData?.email || "";
      this._number = accData?.number || "";
      this._profile = accData?.profile || "";
      this._groups = accData?.groups || [];
    }
  }

  // Download from database
  public async getAccount(id?: string) {
    if (id) this._id = id;
    if (this._id === "") console.error("error on getUser: no id was found");
    else {
      const accRef = doc(db, "accounts", this._id);
      const accSnap = await getDoc(accRef);
      this.fillAccount(accSnap);
    }
  }

  // Upload to database

  private async addAccount() {
    const accRef = doc(db, "accounts", this._id);
    const schedRef = doc(db, "schedule", this._id);

    await setDoc(accRef, this.firestoreFormat());
    await setDoc(schedRef, {});
  }

  // Update the database
  public async updateDatabase(attribute: "name" | "email" | "number" | "profile" | "groups") {
    if (this._id === "") return console.error("not updating database, no id was found!");

    const accRef = doc(db, "accounts", this._id);
    await updateDoc(accRef, { [attribute]: (this as any)[`_${attribute}`] });
  }

  public updateValue(attribute: "name" | "email" | "number" | "profile" | "groups", newValue: any, update?: boolean, setter?: React.Dispatch<React.SetStateAction<Account>>) {
    (this as any)[`_${attribute}`] = newValue;

    if (update) this.updateDatabase(attribute);
    if (setter) setter(new Account(this));
  }

  // Remove from database

  // Authentication

  public signInWithPhoneNumber(){
    
  }
}
