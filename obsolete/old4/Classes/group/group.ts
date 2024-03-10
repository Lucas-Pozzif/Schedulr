import { DocumentSnapshot, deleteDoc, doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { Professional } from "../professional/professional";
import { Service } from "../service/service";
import { db, storage } from "../../Services/firebase/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
export interface GroupInterface {
  title: string;
  type: string;
  pricing: number;
  ratings: { userId: string; message: string; rate: number }[];
  location: any;
  startHours: number[];
  hours: boolean[][];
  servicesIds: string[];
  professionalsIds: string[];
  owner: string;
  admins: string[];
}
export class Group {
  private _id: string;
  private _title: string;
  private _type: string;
  private _pricing: number; //this varies from 0 to 3 to store how expensive the group is
  private _ratings: { userId: string; message: string; rate: number }[];
  private _location: any;
  private _startHours: number[];
  private _hours: boolean[][];
  private _servicesIds: string[];
  private _professionalsIds: string[];
  private _services: Service[];
  private _professionals: Professional[];
  private _images: string[];
  private _profile: string;
  private _banner: string;
  private _owner: string;
  private _admins: string[];

  /** Constructs a new Group instance. Accepts as possible inputs, nothing, an ID, a group or everything*/
  constructor(
    arg?: string | Group,
    title: string = "",
    type: string = "",
    pricing: number = 1,
    ratings: { userId: string; message: string; rate: number }[] = [],
    location: any = "",
    startHours: number[] = [-1, -1, -1, -1, -1, -1, -1],
    hours: boolean[][] = [[false], [false], [false], [false], [false], [false], [false]],
    services: string[] = [],
    professionals: string[] = [],
    images: string[] = [],
    profile: string = "",
    banner: string = "",
    owner: string = "",
    admins: string[] = []
  ) {
    if (arg instanceof Group) {
      // Case: Another Group object provided
      const { _id, _title, _type, _pricing, _ratings, _location, _startHours, _hours, _servicesIds, _professionalsIds, _images, _profile, _banner, _services, _professionals, _owner, _admins } = arg;

      this._id = _id;
      this._title = _title;
      this._type = _type;
      this._pricing = _pricing;
      this._ratings = _ratings;
      this._location = _location;
      this._startHours = _startHours;
      this._hours = _hours;
      this._images = _images;
      this._profile = _profile;
      this._banner = _banner;
      this._servicesIds = _servicesIds;
      this._professionalsIds = _professionalsIds;
      this._services = _services;
      this._professionals = _professionals;
      this._owner = _owner;
      this._admins = _admins;
    } else {
      // Case: ID or no arguments provided
      this._id = arg || "";
      this._title = title;
      this._type = type;
      this._pricing = pricing;
      this._ratings = ratings;
      this._location = location;
      this._startHours = startHours;
      this._hours = hours;
      this._servicesIds = services;
      this._professionalsIds = professionals;
      this._images = images;
      this._profile = profile;
      this._banner = banner;
      this._owner = owner;
      this._admins = admins;

      // Initialize the arrays if they are not provided
      this._services = [];
      this._professionals = [];
    }
  }

  // Getters
  getId(): string {
    return this._id;
  }

  getTitle(): string {
    return this._title;
  }

  getType(): string {
    return this._type;
  }

  getPricing(): number {
    return this._pricing;
  }

  getRatings(): { userId: string; message: string; rate: number }[] {
    return this._ratings;
  }

  getLocation(): any {
    return this._location;
  }

  getStartHours(): number[] {
    return this._startHours;
  }

  getHours(): boolean[][] {
    return this._hours;
  }

  getServicesIds(): string[] {
    return this._servicesIds;
  }

  getProfessionalsIds(): string[] {
    return this._professionalsIds;
  }

  getServices(): Service[] {
    return this._services;
  }

  getProfessionals(): Professional[] {
    return this._professionals;
  }

  getImages(): string[] {
    return this._images;
  }

  getProfile(): string {
    return this._profile;
  }

  getBanner(): string {
    return this._banner;
  }

  getOwner(): string {
    return this._owner;
  }

  getAdmins(): string[] {
    return this._admins;
  }
  // Setters
  setId(id: string) {
    this._id = id;
  }

  setTitle(title: string) {
    this._title = title;
  }

  setType(type: string) {
    this._type = type;
  }

  setPricing(pricing: number) {
    this._pricing = pricing;
  }

  setRatings(ratings: { userId: string; message: string; rate: number }[]) {
    this._ratings = ratings;
  }

  setLocation(location: any) {
    this._location = location;
  }

  setStartHours(startHours: number[]) {
    this._startHours = startHours;
  }

  setHours(hours: boolean[][]) {
    this._hours = hours;
  }

  setServicesIds(servicesIds: string[]) {
    this._servicesIds = servicesIds;
  }

  setProfessionalsIds(professionalsIds: string[]) {
    this._professionalsIds = professionalsIds;
  }

  setServices(services: Service[]) {
    this._services = services;
  }

  setProfessionals(professionals: Professional[]) {
    this._professionals = professionals;
  }

  setImages(images: string[]) {
    this._images = images;
  }

  setProfile(profile: string) {
    this._profile = profile;
  }

  setBanner(banner: string) {
    this._banner = banner;
  }

  setOwner(owner: string) {
    this._owner = owner;
  }

  setAdmins(admins: string[]) {
    this._admins = admins;
  }

  //Fill professional methods

  public fillFromSnapshot(snap: DocumentSnapshot) {
    const profData = snap.data();
    this._id = snap.id;
    this._title = profData!.title;
    this._type = profData!.type;
    this._pricing = profData!.pricing;
    this._ratings = profData!.ratings;
    this._location = profData!.location;
    this._startHours = profData!.startHours;
    this._hours = [profData!.hours[0], profData!.hours[1], profData!.hours[2], profData!.hours[3], profData!.hours[4], profData!.hours[5], profData!.hours[6]];
    this._servicesIds = profData!.servicesIds;
    this._professionalsIds = profData!.professionalsIds;
    this._owner = profData!.owner;
    this._admins = profData!.admins;
  }

  //Firestore methods

  public async addGroup() {
    this._id = await this.updateGroupId();
    await this.setGroup();
  }

  public async setGroup() {
    if (this._id == "") {
      return console.error("no id was found");
    }

    const docRef = doc(db, "groups", this._id);
    await setDoc(docRef, this.getFirestoreFormat());
    await this.uploadImages();
    await this.updateTimeStamp();
  }

  public async updateGroup(updates: Partial<GroupInterface>) {
    if (this._id == "") {
      return console.error("no id was found");
    }

    const docRef = doc(db, "groups", this._id);
    const propertiesToUpdate: (keyof GroupInterface)[] = ["title", "type", "pricing", "ratings", "location", "startHours", "hours", "servicesIds", "professionalsIds", "owner", "admins"];

    propertiesToUpdate.forEach((prop) => {
      if (updates[prop] !== undefined) {
        (this as any)[`_${prop}`] = updates[prop]!;
      }
    });

    await updateDoc(docRef, updates);
    await this.updateTimeStamp();
  }

  public async getGroup(id?: string) {
    if (!id) return;
    const docRef = doc(db, "groups", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.data()) return;

    this.fillFromSnapshot(docSnap);
    await this.downloadImages();
  }

  public async deleteProfessional() {
    if (this._id == "") {
      return console.error("no id was found");
    }

    const docRef = doc(db, "groups", this._id);
    await deleteDoc(docRef);
  }

  public async updateServices() {
    this._services = [];
    for (let i = 0; i < this._servicesIds.length; i++) {
      const service = new Service();
      await service.getService(this._servicesIds[i]);
      this._services.push(service);
    }
  }
  public async updateProfessionals() {
    this._professionals = [];
    for (let i = 0; i < this._professionalsIds.length; i++) {
      const professional = new Professional();
      await professional.getProfessional(this._professionalsIds[i]);
      this._professionals.push(professional);
    }
  }

  public async downloadImages() {
    const profileRef = ref(storage, `groups/${this._id}/profile`);
    const bannerRef = ref(storage, `groups/${this._id}/banner`);
    try {
      this._profile = await getDownloadURL(profileRef);
      this._banner = await getDownloadURL(bannerRef);
    } catch (error) {
      this._profile = "";
      this._banner = "";
    }
  }

  private getFirestoreFormat() {
    return {
      title: this._title,
      type: this._type,
      pricing: this._pricing,
      ratings: this._ratings,
      location: this._location,
      startHours: this._startHours,
      hours: {
        0: this._hours[0] || [],
        1: this._hours[1] || [],
        2: this._hours[2] || [],
        3: this._hours[3] || [],
        4: this._hours[4] || [],
        5: this._hours[5] || [],
        6: this._hours[6] || [],
      },
      servicesIds: this._servicesIds,
      professionalsIds: this._professionalsIds,
      owner: this._owner,
      admins: this._admins,
    };
  }

  private async uploadImages() {
    try {
      const profileRef = ref(storage, `groups/${this._id}/profile`);
      const bannerRef = ref(storage, `groups/${this._id}/banner`);

      const bannerResponse = await fetch(this._banner);
      const profileResponse = await fetch(this._profile);

      await uploadBytes(bannerRef, await bannerResponse.blob());
      await uploadBytes(profileRef, await profileResponse.blob());
    } catch (error) {
      console.error("failed to fetch images", error);
    }
  }

  private async updateTimeStamp() {
    const userRef = doc(db, "groups", this._id);
    await updateDoc(userRef, { timestamp: serverTimestamp() });
  }

  private async updateGroupId() {
    const docRef = doc(db, "config", "ids");
    const configSnap = await getDoc(docRef);
    if (!configSnap.data()) return;

    var config = configSnap.data();
    config!.group++;
    await setDoc(docRef, config);

    return configSnap.data()!.group.toString();
  }

  //qol methods

  public isValid() {
    const hasTitle = this._title.length > 0;
    const hasLocation = this._location.length > 0;

    return hasTitle && hasLocation;
  }
  public updateGroupState(
    setter: React.Dispatch<React.SetStateAction<Group>>,
    attribute: "id" | "title" | "type" | "pricing" | "ratings" | "location" | "startHours" | "hours" | "servicesIds" | "professionalsIds" | "images" | "profile" | "banner" | "services" | "professionals" | "owner" | "admins",
    newValue: any
  ) {
    switch (attribute) {
      case "id":
        this._id = newValue;
        break;
      case "title":
        this._title = newValue;
        break;
      case "type":
        this._type = newValue;
        break;
      case "pricing":
        this._pricing = newValue;
        break;
      case "ratings":
        this._ratings = newValue;
        break;
      case "location":
        this._location = newValue;
        break;
      case "startHours":
        this._startHours = newValue;
        break;
      case "hours":
        this._hours = newValue;
        break;
      case "servicesIds":
        this._servicesIds = newValue;
        break;
      case "professionalsIds":
        this._professionalsIds = newValue;
        break;
      case "images":
        this._images = newValue;
        break;
      case "profile":
        this._profile = newValue;
        break;
      case "banner":
        this._banner = newValue;
        break;
      case "services":
        this._services = newValue;
        break;
      case "professionals":
        this._professionals = newValue;
        break;
      case "owner":
        this._owner = newValue;
        break;
      case "admins":
        this._admins = newValue;
        break;
      default:
        break;
    }
    setter(new Group(this));
  }
  public cleanDay(selectedDay: number, setter: React.Dispatch<React.SetStateAction<Group>>) {
    this._startHours[selectedDay] = 0;
    this._hours[selectedDay] = [];
    setter(new Group(this));
  }

  public fillHours(selectedDay: number, setter: React.Dispatch<React.SetStateAction<Group>>) {
    this._hours[selectedDay] = this._hours[selectedDay]?.map(() => true);
    setter(new Group(this));
  }
  public updateHourList(selectedDay: number, index: number, setter: React.Dispatch<React.SetStateAction<Group>>) {
    if (!this._startHours[selectedDay] || isNaN(this._startHours[selectedDay])) this._startHours[selectedDay] = 0;
    if (this._startHours[selectedDay] > 0) {
      // Fill the hour list with all the values
      const pseudoIndexes = Array(this._startHours[selectedDay]).fill(false);
      this._hours[selectedDay] = [...pseudoIndexes, ...this._hours[selectedDay]];
      this._startHours[selectedDay] = 0;
    }
    if (!this._hours[selectedDay]) this._hours[selectedDay] = [];
    if (index >= this._hours[selectedDay].length) {
      // Fill any value between the given index and the last hour list value with falses
      const diff = index - this._hours[selectedDay].length + 1;
      this._hours[selectedDay].push(...Array(diff).fill(false));
    }

    this._hours[selectedDay][index] = !this._hours[selectedDay][index];

    for (let i = this._hours[selectedDay].length - 1; i >= 0; i--) {
      // Remove any value from the end, until the last value is true
      if (this._hours[selectedDay][i]) break;
      this._hours[selectedDay].pop();
    }
    this._startHours[selectedDay] = this._hours[selectedDay].indexOf(true); // Update the startHours value
    for (let i = 0; i < this._startHours[selectedDay]; i++) {
      // Remove any value from the start, until the first value is true
      this._hours[selectedDay].shift();
    }

    setter(new Group(this));
  }
}
