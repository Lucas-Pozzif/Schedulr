export class SubService {
    private _name: string;
    private _value: string;
    private _inicial: boolean;
    private _duration: boolean[];

    constructor(
        name: string = "",
        value: string = "",
        inicial: boolean = false,
        duration: boolean[] = [true],
    ) {
        this._name = name;
        this._value = value;
        this._inicial = inicial;
        this._duration = duration;
    }

    // Getters
    getName(): string {
        return this._name;
    }

    getValue(): string {
        return this._value;
    }

    getInicial(): boolean {
        return this._inicial;
    }

    getDuration(): boolean[] {
        return this._duration;
    }

    // Setters
    setName(name: string) {
        this._name = name;
    }

    setValue(value: string) {
        this._value = value;
    }

    setInicial(inicial: boolean) {
        this._inicial = inicial;
    }

    setDuration(duration: boolean[]) {
        this._duration = duration;
    }
}

export class Service {
    private _id: string;
    private _name: string;
    private _value: string;
    private _photo: string;
    private _duration: boolean[];
    private _inicial: boolean;
    private _subServices: SubService[];

    constructor(
        id: string = "",
        name: string = "",
        value: string = "",
        photo: string = "",
        duration: boolean[] = [true],
        inicial: boolean = false,
        subServices: SubService[] = []
    ) {
        this._id = id;
        this._name = name;
        this._value = value;
        this._photo = photo;
        this._duration = duration;
        this._inicial = inicial;
        this._subServices = subServices;
    }

    // Getters
    getId(): string {
        return this._id;
    }

    getName(): string {
        return this._name;
    }

    getValue(): string {
        return this._value;
    }

    getPhoto(): string {
        return this._photo;
    }

    getDuration(): boolean[] {
        return this._duration;
    }

    getInicial(): boolean {
        return this._inicial;
    }

    getSubServices(): SubService[] {
        return this._subServices;
    }

    // Setters
    setId(id: string) {
        this._id = id;
    }

    setName(name: string) {
        this._name = name;
    }

    setValue(value: string) {
        this._value = value;
    }

    setPhoto(photo: string) {
        this._photo = photo;
    }

    setDuration(duration: boolean[]) {
        this._duration = duration;
    }

    setInicial(inicial: boolean) {
        this._inicial = inicial;
    }

    setSubServices(subServices: SubService[]) {
        this._subServices = subServices;
    }
}