import { DocumentSnapshot, deleteDoc, doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { Professional } from "./professional";
import { Service } from "./service";
import { db } from "../Services/firebase/firebase";
interface GroupInterface {
    title: string;
    type: string;
    pricing: number;
    ratings: string[];
    location: any;
    startHours: number[];
    hours: boolean[][];
    servicesIds: string[];
    professionalsIds: string[];
    services: Service[];
    professionals: Professional[];
    images: string[];
    profile: string;
    banner: string;
}
export class Group {
    private _id: string;
    private _title: string;
    private _type: string;
    private _pricing: number; //this varies from 0 to 3 to store how expensive the group is
    private _ratings: string[];
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

    /** Constructs a new Group instance. Accepts as possible inputs, nothing, an ID, a group or everything*/
    constructor(
        arg?: string | Group,
        title: string = "",
        type: string = "",
        pricing: number = 0,
        ratings: string[] = [],
        location: any = "",
        startHours: number[] = [-1, -1, -1, -1, -1, -1, -1],
        hours: boolean[][] = [[false], [false], [false], [false], [false], [false], [false]],
        services: string[] = [],
        professionals: string[] = [],
        images: string[] = [],
        profile: string = "",
        banner: string = ""
    ) {
        if (arg instanceof Group) {
            // Case: Another Group object provided
            const {
                _id,
                _title,
                _type,
                _pricing,
                _ratings,
                _location,
                _startHours,
                _hours,
                _servicesIds,
                _professionalsIds,
                _images,
                _profile,
                _banner,
                _services,
                _professionals,
            } = arg;

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

    gettype(): string {
        return this._type;
    }

    getPricing(): number {
        return this._pricing;
    }

    getRatings(): any {
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

    // Setters
    setId(id: string) {
        this._id = id;
    }

    setTitle(title: string) {
        this._title = title;
    }

    settype(type: string) {
        this._type = type;
    }

    setPricing(pricing: number) {
        this._pricing = pricing;
    }

    setRatings(ratings: any) {
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


    //Fill professional methods

    private fillFromSnapshot(snap: DocumentSnapshot) {
        const profData = snap.data();
        this._id = snap.id
        this._title = profData!.title;
        this._type = profData!.type;
        this._pricing = profData!.pricing;
        this._ratings = profData!.ratings;
        this._location = profData!.location;
        this._startHours = profData!.startHours;
        this._hours = [profData!.hours[0], profData!.hours[1], profData!.hours[2], profData!.hours[3], profData!.hours[4], profData!.hours[5], profData!.hours[6]]
        this._servicesIds = profData!.servicesIds;
        this._professionalsIds = profData!.professionalsIds;
        this._images = profData!.images;
        this._profile = profData!.profile;
        this._banner = profData!.banner;
    }

    //Firestore methods

    public async addGroup() {
        this._id = await this.updateGroupId()
        await this.setGroup()
    }

    public async setGroup() {
        if (this._id == "") {
            return console.error("no id was found");
        }

        const docRef = doc(db, "groups", this._id);
        console.log(this.getFirestoreFormat())
        await setDoc(docRef, this.getFirestoreFormat());
        await this.updateTimeStamp();
    }

    public async updateGroup(updates: Partial<GroupInterface>) {
        if (this._id == "") {
            return console.error("no id was found");
        }

        const docRef = doc(db, "groups", this._id);
        const propertiesToUpdate: (keyof GroupInterface)[] = [
            "title",
            "type",
            "pricing",
            "ratings",
            "location",
            "startHours",
            "hours",
            "servicesIds",
            "professionalsIds",
            "services",
            "professionals",
            "images",
            "profile",
            "banner",
        ];

        propertiesToUpdate.forEach((prop) => {
            if (updates[prop] !== undefined) {
                (this as any)[`_${prop}`] = updates[prop]!;
            }
        });

        await updateDoc(docRef, { updates });
        await this.updateTimeStamp();
    }

    public async getGroup(id: string) {
        const docRef = doc(db, "groups", id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.data()) return

        this.fillFromSnapshot(docSnap);
    }

    public async deleteProfessional() {
        if (this._id == "") {
            return console.error("no id was found");
        }

        const docRef = doc(db, "groups", this._id);
        await deleteDoc(docRef);
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
            images: this._images,
            profile: this._profile,
            banner: this._banner,
        };
    }

    private async updateTimeStamp() {
        const userRef = doc(db, "groups", this._id);
        await updateDoc(userRef, { timestamp: serverTimestamp() });
    }

    private async updateGroupId() {
        const docRef = doc(db, "config", "ids")
        const configSnap = await getDoc(docRef)
        if (!configSnap.data()) return

        var config = configSnap.data()
        config!.group++
        await setDoc(docRef, config)

        return configSnap.data()!.group.toString()
    }

    //qol methods

    public isValid() {
        const hasTitle = this._title.length > 0;
        const hasLocation = this._location.length > 0;
        console.log(this._location)

        return (hasTitle && hasLocation)
    }

}