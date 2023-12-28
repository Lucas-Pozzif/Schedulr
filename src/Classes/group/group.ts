import { DocumentData, DocumentSnapshot, deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../Services/firebase/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Profile } from "../profile/profile";
import { Activity } from "../activity/activity";

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

export class Group {
  private _id: string; //The unique id of the group
  private _name: string; //The name of the group
  private _type: Type;
  private _pricing: number;
  private _ratings: Rating[];
  private _location: any; //I have no idea of how to make it
  private _startHours: number[]; // array of values that tell when the group schedule starts
  private _hours: boolean[][];
  private _activities: {
    _id: string;
    _activity: Activity;
  }[]; //group of services related to this group
  private _profiles: {
    _id: string;
    _profile: Profile;
  }[];
  private _owner: string; //The id of the owner
  private _admins: string[]; //The id of the users related to admin profiles
  private _images: {
    _banner: string;
    _profile: string;
  };

  constructor(
    arg?: string | Group,
    name: string = "",
    type: { _id: string; _name: string } = { _id: "", _name: "" },
    pricing: number = -1,
    ratings: { _userId: string; _message: string; _rate: string; _messageId: string }[] = [],
    location: any = null, // Adjust the default value based on the actual type of location
    startHours: number[] = [-1, -1, -1, -1, -1, -1, -1],
    hours: boolean[][] = [[], [], [], [], [], [], []],
    activities: { _id: string; _activity: Activity }[] = [],
    profiles: { _id: string; _profile: Profile }[] = [],
    owner: string = "",
    admins: string[] = [],
    images: { _banner: string; _profile: string } = { _banner: "", _profile: "" }
  ) {
    if (arg instanceof Group) {
      // If arg is a group, then just copy it
      const { _id, _name, _type, _pricing, _ratings, _location, _startHours, _hours, _activities, _profiles, _owner, _admins, _images } = arg;

      this._id = _id;
      this._name = _name;
      this._type = _type;
      this._pricing = _pricing;
      this._ratings = _ratings;
      this._location = _location;
      this._startHours = _startHours;
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
      this._pricing = pricing;
      this._ratings = ratings;
      this._location = location;
      this._startHours = startHours;
      this._hours = hours;
      this._activities = activities;
      this._profiles = profiles;
      this._owner = owner;
      this._admins = admins;
      this._images = images;
    }
  }

  // Getter
  public get(attribute: "id" | "name" | "type" | "pricing" | "ratings" | "location" | "startHours" | "hours" | "activities" | "profiles" | "owner" | "admins" | "images") {
    return (this as any)[`_${attribute}`];
  }

  // Database comunication

  private firestoreFormat() {
    return {
      group: {
        name: this._name,
        type: this._type._id,
        pricing: this._pricing,
        location: this._location,
        startHours: this._startHours,
        hours: this._hours,
        owner: this._owner,
        admins: this._admins,
      },
      lightGroup: {
        name: this._name,
        type: this._type._id,
        pricing: this._pricing,
        location: this._location,
      },
    };
  }

  private fillGroup(groupSnap: DocumentSnapshot<DocumentData, DocumentData>) {
    if (!groupSnap.data()) {
      console.error("no data was found, the id is incorrect or this group was not created yet");
    } else {
      const groupData = groupSnap.data();

      this._id = groupSnap.id;
      this._name = groupData?.name || "";
      this._type = groupData?.type || "";
      this._pricing = groupData?.pricing || 1;
      this._location = groupData?.location || "";
      this._startHours = groupData?.startHours || [-1, -1, -1, -1, -1, -1, -1];
      this._hours = [groupData?.hours[0] || [], groupData?.hours[1] || [], groupData?.hours[2] || [], groupData?.hours[3] || [], groupData?.hours[4] || [], groupData?.hours[5] || [], groupData?.hours[6] || []];
      this._owner = groupData?.owner || "";
      this._admins = groupData?.admins || [];
    }
  }

  // Download from database

  public async getGroup(id?: string) {
    if (id) this._id = id;
    if (this._id === "") console.error("error on getGroup: no id was found");
    else {
      const groupRef = doc(db, "groups", this._id);
      const groupSnap = await getDoc(groupRef);
      this.fillGroup(groupSnap);
    }
  }

  public async getImages() {
    const profileRef = ref(storage, `groups/${this._id}/profile`);
    const bannerRef = ref(storage, `groups/${this._id}/banner`);
    this._images._banner = await getDownloadURL(bannerRef);
    this._images._profile = await getDownloadURL(profileRef);
  }

  public async getReviews() {}

  public async getActivities() {
    if (this._id === "") return console.error("error on getActivities: no id was found");
    const actRef = doc(db, "activities", this._id);
    const actSnap = await getDoc(actRef);
    if (!actSnap.exists()) return;

    this._activities = Object.entries(actSnap.data()).map(([key, value]) => {
      const activity = new Activity(key, this._id);
      activity.fillActivities(value);

      return {
        _id: key,
        _activity: activity,
      };
    });
  }

  public async getProfiles() {
    if (this._id === "") console.error("error on getProfiles: no id was found");
    else {
      const profRef = doc(db, "profiles", this._id);
      const profSnap = await getDoc(profRef);
      if (!profSnap.exists()) return;

      this._profiles = Object.entries(profSnap.data()).map(([key, value]) => {
        const profile = new Profile(key, this._id);
        profile.fillProfile(value);

        return {
          _id: key,
          _profile: profile,
        };
      });
    }
  }

  // Upload to database

  public async addGroup() {
    this._id = await this.updateGroupId();
    const groupRef = doc(db, "groups", this._id);
    const lightGroupRef = doc(db, "light_groups", this._id);
    const profRef = doc(db, "profiles", this._id);
    const actRef = doc(db, "activities", this._id);

    await setDoc(groupRef, this.firestoreFormat().group);
    await setDoc(lightGroupRef, this.firestoreFormat().lightGroup);
    await setDoc(
      profRef,
      this._profiles.map(async (value) => {
        const profile = value._profile;
        await profile.addProfile();
        return profile.get("id");
      })
    );
    await setDoc(
      actRef,
      this._activities.map(async (value) => {
        const activity = value._activity;
        await activity.addActivity();
        return activity.get("id");
      })
    );

    await this.updateDatabase("banner");
    await this.updateDatabase("profile");
  }

  // Update to database

  private async updateGroupId() {
    const configRef = doc(db, "config", "ids");
    const configSnap = await getDoc(configRef);
    if (!configSnap.data()) return console.error("config collection not found");

    var config = configSnap.data();
    config!.group++;
    await updateDoc(configRef, { group: config!.group });

    return config!.group.toString();
  }

  private async updateDatabase(attribute: "name" | "type" | "pricing" | "location" | "startHours" | "hours" | "activities" | "profiles" | "owner" | "admins" | "banner" | "profile") {
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
      case "name":
      case "type":
      case "pricing":
      case "location":
        await updateDoc(groupRef, { [attribute]: (this as any)[`_${attribute}`] });
        await updateDoc(lightGroupRef, { [attribute]: (this as any)[`_${attribute}`] });
        break;
      default:
        await updateDoc(groupRef, { [attribute]: (this as any)[`_${attribute}`] });
        break;
    }
  }

  public async updateValue(
    attribute: "name" | "type" | "pricing" | "location" | "startHours" | "hours" | "activities" | "profiles" | "owner" | "admins" | "banner" | "profile",
    newValue: any,
    update?: boolean,
    setter?: React.Dispatch<React.SetStateAction<Group>>
  ) {
    if (attribute === "banner" || attribute === "profile") this._images[`_${attribute}`] = newValue;
    else (this as any)[`_${attribute}`] = newValue;

    if (update) this.updateDatabase(attribute);
    if (setter) setter(new Group(this));
  }

  // Remove from database

  public async deleteGroup() {
    if (this._id == "") {
      return console.error("no id was found on delete group");
    }

    const groupRef = doc(db, "groups", this._id);
    const profRef = doc(db, "profiles", this._id);
    const actRef = doc(db, "activities", this._id);
    const ratRef = doc(db, "ratings", this._id);

    await deleteDoc(groupRef);
    await deleteDoc(profRef);
    await deleteDoc(actRef);
    await deleteDoc(ratRef);

    //schedules not being deleted, needs fix
  }

  // Class methods unrelated to the database
}
