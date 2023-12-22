import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../Services/firebase/firebase";

export interface LegacySchedItem {
  client: string;
  service: string;
  edited?: boolean;
}

export interface LegacySchedList {
  [date: string]: {
    [number: number]: LegacySchedItem;
  };
}

export interface ScheduleItem {
  author?: string;
  user?: string;
  profile?: string;
  activity?: string;
  message?: string;
}

export interface ScheduleList {
  [month: string]: {
    [day: string]: ScheduleItem;
  };
}

export class Schedule {
  private _id: string;
  private _index: string;
  private _date: Date;
  private _author: string;
  private _user: string;
  private _profile: string;
  private _activity: string;
  private _message: string;

  constructor(id: string = "", scheduleItem: ScheduleItem, date: Date = new Date(), index: string = "-1") {
    this._id = id;
    this._index = index;
    this._date = date;
    this._author = scheduleItem.author || "";
    this._user = scheduleItem.user || "";
    this._profile = scheduleItem.profile || "";
    this._activity = scheduleItem.activity || "";
    this._message = scheduleItem.message || "";
  }

  private firestoreFormat() {
    return {
      author: this._author,
      user: this._user,
      profile: this._profile,
      activity: this._activity,
      message: this._message,
    };
  }

  // It will not add if there is something in there already
  public async addToSchedule() {
  }
}
