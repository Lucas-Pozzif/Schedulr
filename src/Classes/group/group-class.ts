import { doc, setDoc, updateDoc } from "firebase/firestore";
import { Activity, Profile } from "../classpaths";
import { db, storage } from "../../Services/firebase/firebase";
import { ref, uploadBytes } from "firebase/storage";

interface Rating {
  _userId: string;
  _message: string;
  _rate: string;
  _messageId: string;
}

interface Type {
  _id: string;
  _name: string;
}

interface Attributes {
  attributes: "id" | "name" | "type" | "ratings" | "location" | "hours" | "activities" | "profiles" | "owner" | "admins" | "images";
}

export class Group {
  /** The unique id of the group */
  private _id: string;
  /** The name of the group */
  private _name: string;
  /** The type of the group, it comes from a list of types */
  private _type: Type;
  /** A list of ratings that the users do to that group */
  private _ratings: Rating[];
  /** The physical adress of the group, stored in coordinates */
  private _location: any;
  /** List of 7 lists of booleans that hold the open hours of the group for the week, it starts the week on the sunday and the shift at 00:10, every boolean means 10 minutes */
  private _hours: boolean[][];
  /** List of activities that this group holds */
  private _activities: Activity[];
  /** List of profiles that this group holds */
  private _profiles: Profile[];
  /** The user Id related to the owner of the group */
  private _owner: string;
  /** List of user ids that the owner or other admins can add or remove */
  private _admins: string[];
  /** The group holds two images, the banner and the group images, both stored within this attribute */
  private _images: {
    _banner: string;
    _profile: string;
  };

  /**
   * Creates a new group.
   * @param arg The id of the group or a Group instance.
   * @param name The name of the group.
   * @param type The type of the group.
   * @param ratings A list of ratings given to the group.
   * @param location The physical address of the group.
   * @param hours List of 7 lists of booleans representing open hours for each day of the week.
   * @param activities List of activities associated with the group.
   * @param profiles List of profiles associated with the group.
   * @param owner The user ID of the group owner.
   * @param admins List of user IDs for group administrators.
   * @param images Object containing banner and profile picture URLs.
   */
  constructor(
    arg?: string | Group,
    name: string = "",
    type: { _id: string; _name: string } = { _id: "", _name: "" },
    ratings: Rating[] = [],
    location: any = null,
    hours: boolean[][] = [[false], [false], [false], [false], [false], [false], [false]],
    activities: Activity[] = [],
    profiles: Profile[] = [],
    owner: string = "",
    admins: string[] = [],
    images: { _banner: string; _profile: string } = { _banner: "", _profile: "" }
  ) {
    if (arg instanceof Group) {
      // If arg is a group, then just copy it
      const { _id, _name, _type, _ratings, _location, _hours, _activities, _profiles, _owner, _admins, _images } = arg;

      this._id = _id;
      this._name = _name;
      this._type = _type;
      this._ratings = _ratings;
      this._location = _location;
      this._hours = _hours;
      this._activities = _activities;
      this._profiles = _profiles;
      this._owner = _owner;
      this._admins = _admins;
      this._images = _images;
    } else {
      // if its not, just take the actual values
      this._id = arg || "";
      this._name = name;
      this._type = type;
      this._ratings = ratings;
      this._location = location;
      this._hours = hours;
      this._activities = activities;
      this._profiles = profiles;
      this._owner = owner;
      this._admins = admins;
      this._images = images;
    }
  }

  private firestoreFormat() {
    return {
      group: {
        name: this._name,
        type: this._type._id,
        location: this._location,
        hours: this._hours,
        owner: this._owner,
        admins: this._admins,
      },
      lightGroup: {
        name: this._name,
        type: this._type._id,
        location: this._location,
      },
    };
  }

  /**
   * Returns the value of a specific attribute
   */
  public get(attribute: "id" | "name" | "type" | "ratings" | "location" | "hours" | "activities" | "profiles" | "owner" | "admins" | "images") {
    return (this as any)[`_${attribute}`];
  }

  /**
   * Updates locally the value of an attribute
   * @param attribute the attribute that we want to update
   * @param newValue the new value that will replace the one on the given attribute
   * @param setter if using the method "UseState" from react, you can update both the class and the setter at the same time
   */
  public update(attribute: Attributes, newValue: any, setter?: React.Dispatch<React.SetStateAction<Group>>) {
    (this as any)[`_${attribute}`] = newValue;
    if (setter) setter(new Group(this));
  }

  /**
   * Adds a new group to the database and a new lightGroup
   * It will save all data, including for the id, that will be replaced with the last possible for that group
   */
  public async add() {
    if (this._id === "") return console.error("not updating database, no id was found!");
    const groupRef = doc(db, "groups", this._id);
    const lightGroupRef = doc(db, "light_groups", this._id);

    await setDoc(groupRef, this.firestoreFormat().group);
    await setDoc(lightGroupRef, this.firestoreFormat().lightGroup);
  }

  /**
   * Update the current data of the group on the database
   * it will only work if there is an id and a group id.
   */
  public async updateDatabase(attribute: "id" | "name" | "type" | "ratings" | "location" | "hours" | "activities" | "profiles" | "owner" | "admins" | "profile" | "banner") {
    if (this._id === "") return console.error("not updating database, no id was found!");

    const groupRef = doc(db, "groups", this._id);
    const lightGroupRef = doc(db, "light_groups", this._id);
    const profileRef = ref(storage, `groups/${this._id}/profile`);
    const bannerRef = ref(storage, `groups/${this._id}/banner`);

    switch (attribute) {
      case "banner":
        const bannerResponse = await fetch(this._images._banner);
        await uploadBytes(bannerRef, await bannerResponse.blob());
        break;
      case "profile":
        const profileResponse = await fetch(this._images._profile);
        await uploadBytes(profileRef, await profileResponse.blob());
        break;
      case "name" || "type" || "location":
        await updateDoc(groupRef, { [attribute]: (this as any)[`_${attribute}`] });
        await updateDoc(lightGroupRef, { [attribute]: (this as any)[`_${attribute}`] });
        break;
      default:
        await updateDoc(groupRef, { [attribute]: (this as any)[`_${attribute}`] });
        break;
    }
  }
}
