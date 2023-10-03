export class Group {
    private _id: string;
    private _title: string;
    private _type: string;
    private _pricing: number; //this varies from 0 to 3 to store how expensive the group is
    private _ratings: string[];
    private _location: any;
    private _hours: number[][];
    private _services: string[];
    private _professionals: string[];
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
        hours: number[][] = [],
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
                _hours,
                _services,
                _professionals,
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
            this._hours = _hours;
            this._services = _services;
            this._professionals = _professionals;
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
            this._hours = hours;
            this._services = services;
            this._professionals = professionals;
            this._images = images;
            this._profile = profile;
            this._banner = banner;
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

    getHours(): number[][] {
        return this._hours;
    }

    getServices(): any {
        return this._services;
    }

    getProfessionals(): any {
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

    setHours(hours: number[][]) {
        this._hours = hours;
    }

    setServices(services: any) {
        this._services = services;
    }

    setProfessionals(professionals: any) {
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