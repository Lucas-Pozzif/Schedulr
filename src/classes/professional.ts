export class Professional {
    private _id: string
    private _name: string;
    private _occupations: string[];
    private _email: string;
    private _isAdmin: boolean;
    private _services: string[];
    private _shift: string[][];
    private _images:string[]

    constructor(
        id: string,
        name: string = "",
        occupations: string[] = [],
        email: string = "",
        isAdmin: boolean = false,
        services: string[] = [],
        shift: string[][] = [],
        images: string[] = []
    ) {
        this._id = id;
        this._name = name;
        this._occupations = occupations;
        this._email = email;
        this._isAdmin = isAdmin;
        this._services = services;
        this._shift = shift;
        this._images = images;
    }
    
    // Getters
    getId(): string {
        return this._id;
    }

    getName(): string {
        return this._name;
    }

    getOccupations(): string[] {
        return this._occupations;
    }

    getEmail(): string {
        return this._email;
    }

    getIsAdmin(): boolean {
        return this._isAdmin;
    }

    getServices(): string[] {
        return this._services;
    }

    getShift(): string[][] {
        return this._shift;
    }

    getImages(): string[] {
        return this._images;
    }

    // Setters
    setId(id: string) {
        this._id = id;
    }

    setName(name: string) {
        this._name = name;
    }

    setOccupations(occupations: string[]) {
        this._occupations = occupations;
    }

    setEmail(email: string) {
        this._email = email;
    }

    setIsAdmin(isAdmin: boolean) {
        this._isAdmin = isAdmin;
    }

    setServices(services: string[]) {
        this._services = services;
    }

    setShift(shift: string[][]) {
        this._shift = shift;
    }

    setImages(images: string[]) {
        this._images = images;
    }
    
}