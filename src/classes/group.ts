import { Professional } from "./professional";
import { Service } from "./service";

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
        location: any = {},
        startHours: number[] = [],
        hours: boolean[][] = [],
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
            } = arg;
            this._id = _id;
            this._title = _title;
            this._type = _type;
            this._pricing = _pricing;
            this._ratings = _ratings;
            this._location = _location;
            this._startHours = _startHours;
            this._hours = _hours;
            this._servicesIds = _servicesIds;
            this._professionalsIds = _professionalsIds;
            this._images = _images;
            this._profile = _profile;
            this._banner = _banner;
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
        }
        // Initialize the arrays if they are not provided
        this._services = [];
        this._professionals = [];
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

    getProfessionalsids(): string[] {
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
}