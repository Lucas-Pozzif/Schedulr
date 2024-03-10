import { DocumentData, DocumentSnapshot, deleteDoc, deleteField, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../Services/firebase/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Schedule, ScheduleItem, ScheduleList } from "../schedule/schedule";

type ProfileAttributes = {
  attribute: "id" | "groupId" | "name" | "occupations" | "number" | "isAdmin" | "activities" | "hours" | "profile" | "schedule";
};
export class Profile {
  /** The internal id of the profile */
  private _id: string;
  private _groupId: string;
  private _name: string;
  /** List of occupations of that profile, it holds the name and the id to make it database friendly, the occupations will be stored in an attribute of the group */
  private _occupations: { name: string; id: string }[];
  /** Profile's phone number */
  private _number: string;
  private _isAdmin: boolean;
  /** List of activities that this profile is able to do within this group */
  private _activities: string[];
  /** List of 7 lists of booleans that hold the working shift of the profile for the week, it starts the week on the sunday and the shift at 00:10 */
  private _hours: boolean[][];
  /** Profile picture */
  private _profile: string;
  private _schedule: ScheduleList;

  /**
   * Creates a new profile, it can be empty or be filled with both the values or the class
   * @param arg it can be the id of the profile, or a profile class itself
   * @param groupIdthe id of the group that this profile belongs
   * @param name name of the profile
   * @param occupations List of occupations of that profile, it holds the name and the id to make it database friendly, the occupations will be stored in an attribute of the group
   * @param number Profile's phone number
   * @param isAdmin boolean that tells if the profile have admin priviledges
   * @param activities List of activities that this profile is able to do within this group
   * @param hours list of 7 lists of booleans that hold the working shift of the profile for the week, it starts the week on the sunday and the shift at 00:10
   * @param profile profile picture
   * @param schedule the schedule of the professional
   */
  constructor(
    arg?: string | Profile,
    groupId: string = "",
    name: string = "",
    occupations: { name: string; id: string }[] = [],
    number: string = "",
    isAdmin: boolean = false,
    activities: string[] = [],
    hours: boolean[][] = [[false], [false], [false], [false], [false], [false], [false]],
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
      this._profile = profile;
      this._schedule = schedule;
    } else if (arg instanceof Profile) {
      // Case: Another profile object provided
      const { _id, _groupId, _name, _occupations, _number, _isAdmin, _activities, _hours, _profile, _schedule } = arg;
      this._id = _id;
      this._groupId = _groupId;
      this._name = _name;
      this._occupations = _occupations;
      this._number = _number;
      this._isAdmin = _isAdmin;
      this._activities = _activities;
      this._hours = _hours;
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
      this._profile = profile;
      this._schedule = schedule;
    }
  }

  /**
   * It takes the values inside the class and convert them all to firestore format, so it can be udpated to the database
   */
  private firestoreFormat() {
    return {
      name: this._name,
      occupations: this._occupations,
      number: this._number,
      isAdmin: this._isAdmin,
      activities: this._activities,
      hours: {
        0: this._hours[0] || [false],
        1: this._hours[1] || [false],
        2: this._hours[2] || [false],
        3: this._hours[3] || [false],
        4: this._hours[4] || [false],
        5: this._hours[5] || [false],
        6: this._hours[6] || [false],
      },
    };
  }

  /**
   * Returns the value of a specific attribute
   */
  public get(attribute: ProfileAttributes) {
    return (this as any)[`_${attribute}`];
  }

  /**
   * Updates locally the value of an attribute
   * @param attribute the attribute that we want to update
   * @param newValue the new value that will replace the one on the given attribute
   * @param setter if using the method "UseState" from react, you can update both the class and the setter at the same time
   */
  public update(attribute: ProfileAttributes, newValue: any, setter?: React.Dispatch<React.SetStateAction<Profile>>) {
    (this as any)[`_${attribute}`] = newValue;
    if (setter) setter(new Profile(this));
  }

  /**
   * Adds a brand new profile to the group and a new schedule to the list of schedules.
   * It will save all data, except for the id, that will be replaced with the last possible for that group
   */
  public async add() {
    this._id = "this is a placeholder";
    const actRef = doc(db, "profiles", this._groupId);
    const schedRef = doc(db, "schedules", this._id);

    await updateDoc(actRef, { [this._id]: this.firestoreFormat() });
    await setDoc(schedRef, {});
  }

  /**
   * Update the current data of the profile on the database
   * it will only work if there is an id and a group id.
   * Useful for both updating current items on the database and creating profiles with unique ids
   */
  public async updateDatabase() {
    if (this._id === "") return console.error("not updating database, no id was found!");
    if (this._groupId === "") return console.error("not updating database, no group was found!");
    const profRef = doc(db, "profiles", this._groupId);

    await updateDoc(profRef, { [this._id]: this.firestoreFormat() });
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

  public async updateImage() {
    const profileRef = ref(storage, `groups/${this._groupId}/profiles/${this._id}/profile`);
    const bannerResponse = await fetch(this._profile);

    await uploadBytes(profileRef, await bannerResponse.blob());
  }

  // Remove from the database

  public async deleteprofile() {
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
