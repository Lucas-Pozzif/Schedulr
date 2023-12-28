import { DocumentData, DocumentSnapshot, deleteField, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { Schedule } from "../classes-imports";
import { auth, db } from "../../Services/firebase/firebase";
import { ScheduleItem, ScheduleList } from "../schedule/schedule";
import { GoogleAuthProvider, UserCredential, signInAnonymously, signInWithPopup, signOut } from "firebase/auth";

export class Account {
  private _id: string;
  private _name: string;
  private _email: string;
  private _number: string;
  private _profile: string;
  private _schedule: ScheduleList;
  private _groups: string[]; //Groups where you are the owner or a admin

  constructor(arg?: string | Account, name: string = "", email: string = "", number: string = "", profile: string = "", schedule: ScheduleList = {}, groups: string[] = []) {
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

  private fillFromAuth(result: UserCredential) {
    this._id = result.user.uid;
    this._name = result.user.displayName || "";
    this._email = result.user.email || "";
    this._number = result.user.phoneNumber || "";
    this._profile = result.user.photoURL || "";
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

  public async getScheduleDay(date: Date) {
    if (this._id === "") return console.error("not downloading schedule, no id was found!");

    const month = date.toLocaleDateString("pt-BR", { month: "2-digit", year: "2-digit" }).split("/").join("-");
    const day = date.toLocaleDateString("pt-BR", { day: "2-digit" });

    const dayRef = doc(db, "schedules", this._id, month, day);
    const daySnap = await getDoc(dayRef);

    this._schedule[`${day}-${month}`] = daySnap.data() || {};
  }

  // Upload to database

  private async addAccount() {
    const accRef = doc(db, "accounts", this._id);
    const schedRef = doc(db, "schedule", this._id);

    await setDoc(accRef, this.firestoreFormat());
    await setDoc(schedRef, {});
  }

  public async addToSchedule(date: Date, index: string, value: ScheduleItem, overwrite?: boolean) {
    if (this._id === "") return console.error("not updating schedule, no id was found!");

    const month = date.toLocaleDateString("pt-BR", { month: "2-digit", year: "2-digit" }).split("/").join("-");
    const day = date.toLocaleDateString("pt-BR", { day: "2-digit" });

    const dayRef = doc(db, "schedules", this._id, month, day);
    const daySnap = await getDoc(dayRef);

    if (!daySnap.data()) return await setDoc(dayRef, { [index]: value });
    if (daySnap.data()?.[index] !== undefined && overwrite !== true) {
      console.log("there is a value already");
      return false;
    } else await updateDoc(dayRef, { [index]: value });
  }

  // Update the database
  public async updateDatabase(attribute: "name" | "email" | "number" | "profile" | "groups") {
    if (this._id === "") return console.error("not updating database, no id was found!");

    const accRef = doc(db, "accounts", this._id);
    await updateDoc(accRef, { [attribute]: (this as any)[`_${attribute}`] });
  }

  public async updateValue(attribute: "name" | "email" | "number" | "profile" | "groups", newValue: any, update?: boolean, setter?: React.Dispatch<React.SetStateAction<Account>>) {
    (this as any)[`_${attribute}`] = newValue;

    if (update) await this.updateDatabase(attribute);
    if (setter) setter(new Account(this));
  }

  // Remove from database

  public async deleteScheduleDay(date: Date, index: string) {
    if (this._id === "") return console.error("not deleting schedule, no id was found!");

    const month = date.toLocaleDateString("pt-BR", { month: "2-digit", year: "2-digit" }).split("/").join("-");
    const day = date.toLocaleDateString("pt-BR", { day: "2-digit" });

    const dayRef = doc(db, "schedules", this._id, month, day);
    const daySnap = await getDoc(dayRef);

    if (!daySnap.data()) return;
    await updateDoc(dayRef, { [index]: deleteField() });
  }

  // Authentication

  public async anonymousSignIn() {
    await signInAnonymously(auth).then((result) => this.fillFromAuth(result));

    const accRef = doc(db, "accounts", this._id);
    const accSnap = await getDoc(accRef);

    if (!accSnap.exists()) {
      await this.addAccount();
    }
  }

  public async googleSignIn() {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider).then((result) => this.fillFromAuth(result));

    const accRef = doc(db, "accounts", this._id);
    const accSnap = await getDoc(accRef);

    if (!accSnap.exists()) {
      await this.addAccount();
    } else {
      await this.getAccount();
    }
  }

  public async logout() {
    signOut(auth);
  }

  // Quality of life

  public checkNumber() {
    const cleanedNumber = this._number.replace(/[^\d]/g, "");
    return cleanedNumber.length >= 10 && !isNaN(parseInt(cleanedNumber));
  }
}
