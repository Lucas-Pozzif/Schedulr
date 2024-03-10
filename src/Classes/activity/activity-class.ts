import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../Services/firebase/firebase";
type ActivityAttributes = {
  attributes: "id" | "groupId" | "name" | "duration";
};

export class Activity {
  /** The internal id of the activity */
  private _id: string;
  private _groupId: string;
  private _name: string;
  /** Duration of the activity is given by an array of boolean, every true value means 10 minutes */
  private _duration: boolean[];
  
  /**
   * Creates a new activity, it can be empty or be filled with both the values or the class
   * @param arg it can be the id of the activity, or a activity class itself
   * @param groupId the id of the group that this activity belongs
   * @param name name of the activity
   * @param duration array of booleans that represent the duration
   */
  constructor(arg?: string | Activity, groupId: string = "", name: string = "", duration: boolean[] = [false]) {
    if (typeof arg === "string") {
      this._id = arg;
      this._groupId = groupId;
      this._name = name;
      this._duration = duration;
    } else if (arg instanceof Activity) {
      const { _id, _groupId, _name, _duration } = arg;
      this._id = _id;
      this._groupId = _groupId;
      this._name = _name;
      this._duration = _duration;
    } else {
      this._id = "";
      this._groupId = groupId;
      this._name = name;
      this._duration = duration;
    }
  }

  /**
   * It takes the values inside the class and convert them all to firestore format, so it can be udpated to the database
   */
  private firestoreFormat() {
    return {
      name: this._name,
      duration: this._duration,
    };
  }

  /**
   * Returns the value of a specific attribute
   */
  public get(attribute: ActivityAttributes) {
    return (this as any)[`_${attribute}`];
  }

  /**
   * Updates locally the value of an attribute
   * @param attribute the attribute that we want to update
   * @param newValue the new value that will replace the one on the given attribute
   * @param setter if using the method "UseState" from react, you can update both the class and the setter at the same time
   */
  public update(attribute: ActivityAttributes, newValue: any, setter?: React.Dispatch<React.SetStateAction<Activity>>) {
    (this as any)[`_${attribute}`] = newValue;
    if (setter) setter(new Activity(this));
  }

  /**
   * Adds a brand new activity to the group.
   * It will save all data, except for the id, that will be replaced with the last possible for that group
   */
  public async add() {
    this._id = "this is a placeholder";
    const actRef = doc(db, "activities", this._groupId);

    await updateDoc(actRef, { [this._id]: this.firestoreFormat() });
  }

  /**
   * Update the current data of the activity on the database
   * it will only work if there is an id and a group id.
   * Useful for both updating current items on the database and creating activities with unique ids
   */
  public async updateDatabase() {
    if (this._id === "") return console.error("not updating database, no id was found!");
    if (this._groupId === "") return console.error("not updating database, no group was found!");
    const actRef = doc(db, "activities", this._groupId);

    await updateDoc(actRef, { [this._id]: this.firestoreFormat() });
  }
}

/*
  // Update the database
  private async updateActivityId() {
    const configRef = doc(db, "config", "ids");
    const configSnap = await getDoc(configRef);
    if (!configSnap.data()) return console.error("config collection not found");

    var config = configSnap.data();
    config!.activity++;
    await updateDoc(configRef, { activity: config!.activity });

    return config!.activity.toString();
  }
*/
