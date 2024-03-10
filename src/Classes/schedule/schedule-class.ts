import { doc, getDoc } from "firebase/firestore";
import { db } from "../../Services/firebase/firebase";

export interface ScheduleItem {
  author?: string;
  user?: string;
  profile?: string;
  activity?: string;
  message?: string;
  number?: string;
}
/**
 * @param day is in the format DD/MM/YY
 */
export interface ScheduleList {
  [day: string]: {
    [index: string]: ScheduleItem;
  };
}

type Attributes = {
  attribute: "id" | "author" | "user" | "message" | "profile" | "activity" | "number";
};

export class Schedule {
  /** Unique id of the schedule, it is shared with the user or profile */
  private _id: string;
  /** id of the responsible for the scheduling */
  private _author: string;
  /** Name of the person that was scheduled */
  private _user: string;
  /** Id of the profile that the activity was scheduled with, replace user for profile schedules */
  private _profile: string;
  /** Id of the activity that was scheduled */
  private _activity: string;
  /** Message that was left with the schedule */
  private _message: string;
  /** Phone number of the user, used by the profile to keep in touch */
  private _number: string;

  /**
   * Creates a new schedule instance, it can be empty, filled with the values or with another instance
   * @param arg The id of the user or profile, or a Schedule instance.
   * @param author id of the responsible for the scheduling
   * @param user name of the person that was scheduled
   * @param message Message that was left with the schedule
   * @param profile Id of the profile that the activity was scheduled with, replace user for profile schedules
   * @param activity Id of the activity that was scheduled
   * @param number Phone number of the user, used by the profile to keep in touch
   */
  constructor(arg?: string | Schedule, author: string = "", user: string = "", message: string = "", profile: string = "", activity: string = "", number: string = "") {
    if (typeof arg === "string") {
      // Case: ID provided
      this._id = arg;
      this._author = author;
      this._user = user;
      this._message = message;
      this._profile = profile;
      this._activity = activity;
      this._number = number;
    } else if (arg instanceof Schedule) {
      // Case: Another profile object provided
      const { _id, _author, _user, _message, _profile, _activity, _number } = arg;
      this._id = _id;
      this._author = _author;
      this._user = _user;
      this._message = _message;
      this._profile = _profile;
      this._activity = _activity;
      this._number = _number;
    } else {
      // Case: No arguments or invalid argument type
      this._id = "";
      this._author = author;
      this._user = user;
      this._message = message;
      this._profile = profile;
      this._activity = activity;
      this._number = number;
    }
  }

  /**
   * It takes the values inside the class and convert them all to firestore format, so it can be udpated to the database
   */
  private firestoreFormat() {
    return {
      author: this._author,
      user: this._user,
      profile: this._profile,
      activity: this._activity,
      message: this._message,
      number: this._number,
    };
  }

  /**
   * Returns the value of a specific attribute
   */
  public get(attribute: Attributes) {
    return (this as any)[`_${attribute}`];
  }
  /**
   * Updates locally the value of an attribute
   * @param attribute the attribute that we want to update
   * @param newValue the new value that will replace the one on the given attribute
   * @param setter if using the method "UseState" from react, you can update both the class and the setter at the same time
   */
  public update(attribute: Attributes, newValue: any, setter?: React.Dispatch<React.SetStateAction<Schedule>>) {
    (this as any)[`_${attribute}`] = newValue;
    if (setter) setter(new Schedule(this));
  }

  /**
   * Add the current data to the given date and indexes, it will not overwrite any value, to overwrite, use the overwrite method
   * @param date it must be in the format DD/MM/YY
   * @param indexes array of indexes that the value will be stored
   */
  public async add(date: string, indexes: string[]) {
    if (this._id === "") return console.error("not updating database, no id was found!");
    const splitedDate = date.split("/");

    indexes.forEach(async (index) => {
      const indexRef = doc(db, "schedules", this._id, `${splitedDate[1]}-${splitedDate[2]}`, splitedDate[0], index);
      const indexSnap = await getDoc(indexRef);
      console.log(indexSnap.data());
    });
  }
}
