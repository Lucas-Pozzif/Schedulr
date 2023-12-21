import { DocumentData, DocumentSnapshot } from "firebase/firestore";
import { Schedule } from "../classes-imports";
import { storage } from "../../Services/firebase/firebase";
import { getDownloadURL, ref } from "firebase/storage";

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
  private _schedule: Schedule;

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
    schedule: Schedule = {}
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

  // Database comunication

  public fillProfile(profSnap: DocumentSnapshot<DocumentData, DocumentData>) {
    if (!profSnap.data()) console.error("no data was found, the id is incorrect or this profile was not created yet");
    else {
      const profData = profSnap.data();

      this._id = profSnap.id;
      this._name = profData?.name || "";
      this._occupations = profData?.occupations || [];
      this._number = profData?.number || "";
      this._isAdmin = profData?.isAdmin || false;
      this._activities = profData?.activities || [];
      this._hours = profData?.hours || [profData?.hours[0] || [], profData?.hours[1] || [], profData?.hours[2] || [], profData?.hours[3] || [], profData?.hours[4] || [], profData?.hours[5] || [], profData?.hours[6] || []];
      this._startHours = profData?.startHours || [-1, -1, -1, -1, -1, -1, -1];
    }
  }

  // Download from database

  public async getImages() {
    const profileRef = ref(storage, `groups/${this._groupId}/profiles/${this._id}/profile`);
    this._profile = await getDownloadURL(profileRef);
  }

  // Upload to database

  public async addProfile() {}

  // Update the database

  // Remove from the database


  /**
   * Gets the schedule day of this profile, it will grab the entire day
   */
  public async getSchedule(day: Date) {}
}
