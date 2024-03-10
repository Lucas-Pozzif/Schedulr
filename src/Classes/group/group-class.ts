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
}
