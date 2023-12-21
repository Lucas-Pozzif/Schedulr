import { DocumentData, DocumentSnapshot, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../Services/firebase/firebase";

export class Activity {
  private _id: string;
  private _groupId: string;
  private _name: string;
  private _duration: boolean[];

  constructor(arg?: string | Activity, name: string = "", groupId: string = "", duration: boolean[] = [false]) {
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

  // Database comunication

  private firestoreFormat() {
    return {
      name: this._name,
      duration: this._duration,
    };
  }

  private fillActivities(actSnap: DocumentSnapshot<DocumentData, DocumentData>) {
    if (!actSnap.data()) {
      console.error("no data was found, the id is incorrect or this group was not created yet");
    } else {
    }
  }

  // Download from database

  // Upload to database

  public async addActivity() {
    this._id = await this.updateActivityId();
    const actRef = doc(db, "activities", this._groupId);

    await updateDoc(actRef, { [this._id]: this.firestoreFormat() });
  }

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

  // Remove from database

  

  // Unrelated to database
}
