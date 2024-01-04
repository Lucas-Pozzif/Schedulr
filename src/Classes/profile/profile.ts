import { DocumentData, DocumentSnapshot, deleteDoc, deleteField, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../Services/firebase/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Schedule, ScheduleItem, ScheduleList } from "../schedule/schedule";

export class Profile {
  private _id: string;
  private _groupId: string;
  private _name: string;
  private _occupations: { _name: string; _id: string }[];
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
    occupations: { _name: string; _id: string }[] = [],
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
      occupations: this._occupations.map((value: { _name: string; _id: string }) => {
        return { name: value._name, id: value._id };
      }),
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
    if (this._id === "" || this._id.startsWith("$")) return console.error("not downloading schedule, no id was found!");

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
    if (this._id === "" || this._id.startsWith("$")) return console.error("not updating schedule, no id was found!");

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
    if (this._id === ""|| this._id.startsWith('$')) return console.error("not updating database, no id was found!");
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
    if (this._id === ""|| this._id.startsWith('$')) return console.error("not deleting schedule, no id was found!");

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

  public async findAccount(value: string) {
    const searchRef = doc(db, "search", "accounts");

    const searchSnap = await getDoc(searchRef);
    const userList = searchSnap.data();

    console.log(userList);
  }

  public formattedOccupations() {
    const length = this._occupations.length;
    return length === 0 ? "Não há ocupações" : length === 1 ? this._occupations[0]._name : length === 2 ? `${this._occupations[0]._name} & ${this._occupations[1]}` : `${this._occupations[0]._name}, ${this._occupations[1]._name} & ${length - 2} mais`;
  }

  public daySpan(weekDay: number) {
    return "Fechado";
  }

  // Unrelated to database

  public isValid() {
    if (this._name == "") return "name";
    else return true;
  }

  public groupFormat() {
    return {
      _id: this._id,
      _profile: this,
    };
  }

  public cleanDay(selectedDay: number, setter: React.Dispatch<React.SetStateAction<Profile>>) {
    this._startHours[selectedDay] = 0;
    this._hours[selectedDay] = [];
    setter(new Profile(this));
  }

  public fillHours(selectedDay: number, setter: React.Dispatch<React.SetStateAction<Profile>>) {
    this._hours[selectedDay] = this._hours[selectedDay]?.map(() => true);
    setter(new Profile(this));
  }

  public updateHourList(selectedDay: number, index: number, setter: React.Dispatch<React.SetStateAction<Profile>>) {
    if (!this._startHours[selectedDay] || isNaN(this._startHours[selectedDay])) this._startHours[selectedDay] = 0;
    if (this._startHours[selectedDay] > 0) {
      // Fill the hour list with all the values
      const pseudoIndexes = Array(this._startHours[selectedDay]).fill(false);
      this._hours[selectedDay] = [...pseudoIndexes, ...this._hours[selectedDay]];
      this._startHours[selectedDay] = 0;
    }
    if (!this._hours[selectedDay]) this._hours[selectedDay] = [];
    if (index >= this._hours[selectedDay].length) {
      // Fill any value between the given index and the last hour list value with falses
      const diff = index - this._hours[selectedDay].length + 1;
      this._hours[selectedDay].push(...Array(diff).fill(false));
    }

    this._hours[selectedDay][index] = !this._hours[selectedDay][index];

    for (let i = this._hours[selectedDay].length - 1; i >= 0; i--) {
      // Remove any value from the end, until the last value is true
      if (this._hours[selectedDay][i]) break;
      this._hours[selectedDay].pop();
    }
    this._startHours[selectedDay] = this._hours[selectedDay].indexOf(true); // Update the startHours value
    for (let i = 0; i < this._startHours[selectedDay]; i++) {
      // Remove any value from the start, until the first value is true
      this._hours[selectedDay].shift();
    }

    setter(new Profile(this));
  }

  public generateLocalId() {
    this._id = `$${new Date().getTime()}`;
  }

  public generateNewOccupation() {
    const newId = new Date().getTime().toString();
    this._occupations.push({ _name: "", _id: newId });
    return newId;
  }

  public handleActivity(activityId: string, setter: React.Dispatch<React.SetStateAction<Profile>>) {
    const index = this._activities.indexOf(activityId);
    if (index !== -1) {
      this._activities.splice(index, 1);
    } else {
      this._activities.push(activityId);
    }
    setter(new Profile(this));
  }
}
