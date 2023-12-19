import { Schedule } from "../classes-imports";

export class Profile {
  private _id: string;
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
      const { _id, _name, _occupations, _number, _isAdmin, _activities, _hours, _startHours, _profile, _schedule } = arg;
      this._id = _id;
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
}
