import { DocumentData, DocumentSnapshot, deleteDoc, deleteField, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../Services/firebase/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Schedule, ScheduleItem, ScheduleList } from "../schedule/schedule";

export class Profile {
  private _id: string;
  private _groupId: string;
  private _name: string;
  private _occupations: { name: string; id: string }[];
  private _number: string;
  private _isAdmin: boolean;
  private _activities: string[];
  private _startHours: number[];
  private _hours: boolean[][];
  private _profile: string;
  private _schedule: ScheduleList;

  constructor(
    arg?: string | Profile,
    groupId: string = "",
    name: string = "",
    occupations: { name: string; id: string }[] = [],
    number: string = "",
    isAdmin: boolean = false,
    activities: string[] = [],
    startHours: number[] = [-1, -1, -1, -1, -1, -1, -1],
    hours: boolean[][] = [[], [], [], [], [], [], []],
    profile: string = "",
    schedule: ScheduleList = {}
  ) {
    if (typeof arg === "string") {
      // Case: ID provided
      this._id = arg;
      this._groupId = groupId;
      this._name = name;
      this._occupations = occupations;
      this._number = number;
      this._isAdmin = isAdmin;
      this._activities = activities;
      this._hours = hours;
      this._startHours = startHours;
      this._profile = profile;
      this._schedule = schedule;
    } else if (arg instanceof Profile) {
      // Case: Another Professional object provided
      const { _id, _groupId, _name, _occupations, _number, _isAdmin, _activities, _hours, _startHours, _profile, _schedule } = arg;
      this._id = _id;
      this._groupId = _groupId;
      this._name = _name;
      this._occupations = _occupations;
      this._number = _number;
      this._isAdmin = _isAdmin;
      this._activities = _activities;
      this._hours = _hours;
      this._startHours = _startHours;
      this._profile = _profile;
      this._schedule = _schedule;
    } else {
      // Case: No arguments or invalid argument type
      this._id = "";
      this._groupId = groupId;
      this._name = name;
      this._occupations = occupations;
      this._number = number;
      this._isAdmin = isAdmin;
      this._activities = activities;
      this._hours = hours;
      this._startHours = startHours;
      this._profile = profile;
      this._schedule = schedule;
    }
  }
  // Getter

  public get(attribute: "id" | "groupId" | "name" | "occupations" | "number" | "isAdmin" | "activities" | "startHours" | "hours" | "profile" | "schedule") {
    return (this as any)[`_${attribute}`];
  }

  // Database comunication

  private firestoreFormat() {
    return {
      name: this._name,
      occupations: this._occupations,
      number: this._number,
      isAdmin: this._isAdmin,
      activities: this._activities,
      startHours: this._startHours,
      hours: {
        0: this._hours[0] || [],
        1: this._hours[1] || [],
        2: this._hours[2] || [],
        3: this._hours[3] || [],
        4: this._hours[4] || [],
        5: this._hours[5] || [],
        6: this._hours[6] || [],
      },
    };
  }

  public fillProfile(value: any) {
    this._name = value.name;
    this._occupations = value.occupations;
    this._number = value.number;
    this._isAdmin = value.isAdmin;
    this._activities = value.activities;
    this._startHours = value.startHours;
    this._hours = value.hours;
  }

  // Download from database

  public async getImages() {
    const profileRef = ref(storage, `groups/${this._groupId}/profiles/${this._id}/profile`);
    this._profile = await getDownloadURL(profileRef);
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

  public async addProfile() {
    this._id = await this.updateActivityId();
    const actRef = doc(db, "profiles", this._groupId);
    const schedRef = doc(db, "schedules", this._id);

    await updateDoc(actRef, { [this._id]: this.firestoreFormat() });
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

  private async updateActivityId() {
    const configRef = doc(db, "config", "ids");
    const configSnap = await getDoc(configRef);
    if (!configSnap.data()) return console.error("config collection not found");

    var config = configSnap.data();
    config!.profile++;
    await updateDoc(configRef, { profile: config!.profile });

    return config!.profile.toString();
  }

  public async updateDatabase() {
    if (this._id === "") return console.error("not updating database, no id was found!");
    const profRef = doc(db, "profiles", this._groupId);

    await updateDoc(profRef, { [this._id]: this.firestoreFormat() });
  }

  public async updateImage() {
    const profileRef = ref(storage, `groups/${this._groupId}/profiles/${this._id}/profile`);
    const bannerResponse = await fetch(this._profile);

    await uploadBytes(profileRef, await bannerResponse.blob());
  }

  public updateValue(attribute: "name" | "occupations" | "number" | "isAdmin" | "activities" | "startHours" | "hours" | "profile", newValue: any, setter?: React.Dispatch<React.SetStateAction<Profile>>) {
    (this as any)[`_${attribute}`] = newValue;
    if (setter) setter(new Profile(this));
  }

  // Remove from the database

  public async deleteProfessional() {
    const schedRef = doc(db, "schedules", this._id);
    const profRef = doc(db, "profiles", this._groupId);

    await deleteDoc(schedRef);
    await updateDoc(profRef, { [this._id]: deleteField() });
  }

  public async deleteScheduleDay(date: Date, index: string) {
    if (this._id === "") return console.error("not deleting schedule, no id was found!");

    const month = date.toLocaleDateString("pt-BR", { month: "2-digit", year: "2-digit" }).split("/").join("-");
    const day = date.toLocaleDateString("pt-BR", { day: "2-digit" });

    const dayRef = doc(db, "schedules", this._id, month, day);
    const daySnap = await getDoc(dayRef);

    if (!daySnap.data()) return;
    await updateDoc(dayRef, { [index]: deleteField() });
  }

  /**
   * Gets the schedule day of this profile, it will grab the entire day
   */
}
