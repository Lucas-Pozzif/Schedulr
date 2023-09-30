export class User {
    private _id: string;
    private _name: string;
    private _email: string;
    private _number: string;
    private _photo: string;
    private _schedule: any;

    constructor(
        id: string = "",
        name: string = "",
        email: string = "",
        number: string = "",
        photo: string = "",
        schedule: any = {}
    ) {
        this._id = id;
        this._name = name;
        this._email = email;
        this._number = number;
        this._photo = photo;
        this._schedule = schedule;
    }

    // Getters
    getId(): string {
        return this._id;
    }

    getName(): string {
        return this._name;
    }

    getEmail(): string {
        return this._email;
    }

    getNumber(): string {
        return this._number;
    }

    getPhoto(): string {
        return this._photo;
    }

    getSchedule(): any {
        return this._schedule;
    }

    // Setters
    setId(id: string) {
        this._id = id;
    }

    setName(name: string) {
        this._name = name;
    }

    setEmail(email: string) {
        this._email = email;
    }

    setNumber(number: string) {
        this._number = number;
    }

    setPhoto(photo: string) {
        this._photo = photo;
    }

    setSchedule(schedule: any) {
        this._schedule = schedule;
    }
}