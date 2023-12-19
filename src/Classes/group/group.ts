import { DocumentData, DocumentSnapshot, doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../Services/firebase/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

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

  /**
   * Converts the group to the firestore format
   * it returns the group, the ratings and the lightGroup formats
   */
  private firestoreFormat() {
    return {
      group: {
        name: this._name,
        type: this._type._id,
        pricing: this._pricing,
        location: this._location,
        startHours: this._startHours,
        hours: this._hours,
        activities: this._activities.map((activity) => activity._id),
        profiles: this._profiles.map((profile) => profile._id),
        owner: this._owner,
        admins: this._admins,
      },
      lightGroup: {
        name: this._name,
        type: this._type._id,
        pricing: this._pricing,
        location: this._location,
      },
      ratings: this._ratings.map((rating) => ({
        [rating._messageId]: {
          userId: rating._userId,
          message: rating._message,
          rate: rating._rate,
        },
      })),
    };
  }

  /**
   * Given a snapshot from the group or light group storage it will fill the class attributes from that
   */
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
      this._activities = groupData?.activities || [];
      this._profiles = groupData?.profiles || [];
      this._owner = groupData?.owner || "";
      this._admins = groupData?.admins || [];
    }
  }

  /**
   * Grabs the group from the database
   * @param id if given a id, it will use this id, if not, it will use the id that is already on the group
   * if there is not a id, it will return a error message
   */
  public async getGroup(id?: string) {
    if (id) this._id = id;
    if (this._id === "") console.error("error on grabGroup: no id was found");
    else {
      const groupRef = doc(db, "groups", this._id);
      const groupSnap = await getDoc(groupRef);
      this.fillGroup(groupSnap);
    }
  }

  /**
   * Grabs the images of the group from the database
   */
  public async getImages() {
    const profileRef = ref(storage, `groups/${this._id}/profile`);
    const bannerRef = ref(storage, `groups/${this._id}/banner`);
    this._images._banner = await getDownloadURL(bannerRef);
    this._images._profile = await getDownloadURL(profileRef);
  }

  /**
   * Grabs the reviews from that group
   */
  public async getReviews() {}

  public async getActivities() {}

  public async getProfiles() {}

  /**
   * Update locally the value of a given attribute, to update it on the database, set the parameter update as true
   */
  public async updateState(
    setter: React.Dispatch<React.SetStateAction<Group>>,
    attribute: "name" | "type" | "pricing" | "location" | "startHours" | "hours" | "activities" | "profiles" | "owner" | "admins" | "banner" | "profile",
    newValue: any,
    update?: boolean
  ) {
    if (attribute === "banner") this._images._banner = newValue;
    else if (attribute === "profile") this._images._profile = newValue;
    else (this as any)[`_${attribute}`] = newValue;

    if (update) this.updateDatabase(attribute);

    setter(new Group(this));
  }

  public async updateDatabase(attribute: "name" | "type" | "pricing" | "location" | "startHours" | "hours" | "activities" | "profiles" | "owner" | "admins" | "banner" | "profile") {
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
}
