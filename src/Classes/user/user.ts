import { GoogleAuthProvider, UserCredential, signInWithPopup, signInWithRedirect, signOut } from "firebase/auth";
import { DocumentSnapshot, collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { Group } from "../group/group";
import { LegacySchedItem, LegacySchedList, Schedule, ScheduleItem } from "../schedule/schedule";
import { auth, db } from "../../Services/firebase/firebase";

interface UserInterface {
  id: string;
  name: string;
  email: string;
  number: string;
  photo: string;
}

export class User {
  private _id: string;
  private _name: string;
  private _email: string;
  private _number: string;
  private _photo: string;
  private _schedule: LegacySchedList | any;

  constructor(arg?: string | User, name: string = "", email: string = "", number: string = "", photo: string = "", schedule: LegacySchedList = {}) {
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

  getSchedule(): LegacySchedList {
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

  setSchedule(schedule: LegacySchedList) {
    this._schedule = schedule;
  }

  //Auth methods

  public async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    this.fillFromGoogle(userCredential);
  }

  public async logout() {
    signOut(auth);
  }

  private fillFromGoogle(userCredential: UserCredential) {
    const user = userCredential.user;

    this._id = user.uid;
    this._name = user.displayName || "";
    this._email = user.email || "";
    this._number = user.phoneNumber || "";
    this._photo = user.photoURL || "";
  }

  //Fill service methods

  public fillFromSnapshot(snap: DocumentSnapshot) {
    const servData = snap.data();

    this._id = snap.id;
    this._name = servData!.name;
    this._email = servData!.email;
    this._number = servData!.number;
    this._photo = servData!.photo;
  }

  //Firestore methods

  public async addUser() {
    await this.addSchedule();
    await this.setUser();
  }

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
    const propertiesToUpdate: (keyof UserInterface)[] = ["id", "name", "email", "number", "photo"];

    propertiesToUpdate.map((prop) => {
      if (updates[prop] !== undefined) {
        (this as any)[`_${prop}`] = updates[prop]!;
      }
    });

    await updateDoc(docRef, updates);
    await this.updateTimeStamp();
  }

  public async getUser(id: string) {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.data()) return;

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
    return docSnap.data() !== undefined;
  }

  public async getGroups() {
    const snapArray: any[] = [];
    const querySnapshot = await getDocs(collection(db, "groups"));

    querySnapshot.forEach((snap) => {
      snapArray.push(snap);
    });
    const promises = snapArray.map(async (snap) => {
      const group = new Group();
      group.fillFromSnapshot(snap);
      await group.downloadImages();
      return group;
    });

    const groupArray = await Promise.all(promises);
    return groupArray;
  }

  private getFirestoreFormat() {
    return {
      id: this._id,
      name: this._name,
      email: this._email,
      number: this._number,
      photo: this._photo,
    };
  }

  private async updateTimeStamp() {
    const userRef = doc(db, "users", this._id);
    await updateDoc(userRef, { timestamp: serverTimestamp() });
  }

  // Schedule methods

  public async updateSchedule(day: string, index: string, value: LegacySchedItem) {
    const [dayPart, monthPart, yearPart] = day.split("/");
    const date = `${monthPart}-${yearPart.slice(-2)}`;
    const formattedDay = dayPart;

    const docRef = doc(db, "schedules", this._id, date, formattedDay);
    try {
      // Check if the document exists
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await updateDoc(docRef, { [index]: value });
        console.log("Document updated successfully!");
      } else {
        // Document doesn't exist, create it with the field
        await setDoc(docRef, { [index]: value });
        console.log("Document created successfully!");
      }
    } catch (e) {
      console.error("Error updating document:", e);
    }
  }

  public async deleteScheduleIndex(day: string, index: string) {
    const [dayPart, monthPart, yearPart] = day.split("/");
    const date = `${monthPart}-${yearPart.slice(-2)}`;
    const formattedDay = dayPart;

    delete this._schedule[day][index];

    const docRef = doc(db, "schedules", this._id, date, formattedDay);
    await setDoc(docRef, this._schedule[day]);
  }

  public async getScheduleDay(day: string) {
    const [dayPart, monthPart, yearPart] = day.split("/");
    const date = `${monthPart}-${yearPart.slice(-2)}`;
    const formattedDay = dayPart;

    const nestedField = `${date}/${formattedDay}`;

    const docRef = doc(db, "schedules", this._id, nestedField);

    const docSnap = await getDoc(docRef);
    this._schedule[day] = docSnap.data();
  }

  public async getAllSchedule() {
    const docRef = doc(db, "schedules", this._id);

    const docSnap = await getDoc(docRef);
    this._schedule = docSnap.data();
  }

  private async addSchedule() {
    const docRef = doc(db, "schedules", this._id);

    await setDoc(docRef, {});
    await this.updateScheduleTimeStamp();
  }

  private async updateScheduleTimeStamp() {
    const userRef = doc(db, "schedules", this._id);
    await updateDoc(userRef, { timestamp: serverTimestamp() });
  }

  public updateState(setter: React.Dispatch<React.SetStateAction<User>>, attribute: "id" | "name" | "email" | "number" | "photo" | "schedule", newValue: any) {
    switch (attribute) {
      case "id":
        this._id = newValue;
        break;
      case "name":
        this._name = newValue;
        break;
      case "email":
        this._email = newValue;
        break;
      case "number":
        const cleanedNumber = newValue.replace(/[^\d]/g, "");
        this._number = cleanedNumber;
        break;
      case "photo":
        this._photo = newValue;
        break;
      case "schedule":
        this._schedule = newValue;
        break;
      default:
        break;
    }
    setter(new User(this));
  }

  public isNumberValid() {
    const cleanedNumber = this._number.replace(/[^\d]/g, "");
    console.log(cleanedNumber.length);
    return cleanedNumber.length >= 10 && !isNaN(parseInt(cleanedNumber));
  }
}
