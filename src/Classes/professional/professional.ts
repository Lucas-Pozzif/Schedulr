import { DocumentSnapshot, collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../../Services/firebase/firebase";
import { Schedule, ScheduleItem } from "../schedule/schedule";
import { User } from "../user/user";
import { Service } from "../service/service";

interface ProfessionalInterface {
    name: string;
    occupations: string[];
    email: string;
    isAdmin: boolean;
    services: string[];
    shift: boolean[][];
    startHours: number[];
    images: string[];
}

export class Professional {
    private _id: string;
    private _name: string;
    private _occupations: string[];
    private _email: string;
    private _isAdmin: boolean;
    private _services: string[];
    private _shift: boolean[][];
    private _startHours: number[];
    private _images: string[];
    private _schedule: Schedule | any;

    constructor(
        arg?: string | Professional,
        name: string = "",
        occupations: string[] = [],
        email: string = "",
        isAdmin: boolean = false,
        services: string[] = [],
        shift: boolean[][] = [],
        startHours: number[] = [],
        images: string[] = [],
        schedule: Schedule = {}
    ) {
        if (typeof arg === "string") {
            // Case: ID provided
            this._id = arg;
            this._name = name;
            this._occupations = occupations;
            this._email = email;
            this._isAdmin = isAdmin;
            this._services = services;
            this._shift = shift;
            this._startHours = startHours;
            this._images = images;
            this._schedule = schedule;
        } else if (arg instanceof Professional) {
            // Case: Another Professional object provided
            const { _id, _name, _occupations, _email, _isAdmin, _services, _shift, _startHours, _images, _schedule } = arg;
            this._id = _id;
            this._name = _name;
            this._occupations = _occupations;
            this._email = _email;
            this._isAdmin = _isAdmin;
            this._services = _services;
            this._shift = _shift;
            this._startHours = _startHours;
            this._images = _images;
            this._schedule = _schedule;
        } else {
            // Case: No arguments or invalid argument type
            this._id = "";
            this._name = name;
            this._occupations = occupations;
            this._email = email;
            this._isAdmin = isAdmin;
            this._services = services;
            this._shift = shift;
            this._startHours = startHours;
            this._images = images;
            this._schedule = schedule;
        }
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

    getShift(): boolean[][] {
        return this._shift;
    }

    getStartHours(): number[] {
        return this._startHours;
    }

    getImages(): string[] {
        return this._images;
    }

    getSchedule(): Schedule {
        return this._schedule;
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

    setShift(shift: boolean[][]) {
        this._shift = shift;
    }

    setStartHours(startHours: number[]) {
        this._startHours = startHours;
    }

    setImages(images: string[]) {
        this._images = images;
    }

    setSchedule(schedule: Schedule) {
        this._schedule = schedule;
    }

    //Fill professional methods

    private fillFromSnapshot(snap: DocumentSnapshot) {
        const profData = snap.data();
        this._id = snap.id;
        this._name = profData!.name;
        this._occupations = profData!.occupations;
        this._email = profData!.email;
        this._isAdmin = profData!.isAdmin;
        this._services = profData!.services;
        this._shift = [profData!.shift[0], profData!.shift[1], profData!.shift[2], profData!.shift[3], profData!.shift[4], profData!.shift[5], profData!.shift[6]];
        this._startHours = profData!.startHours;
        this._images = profData!.images;
    }

    //Firestore methods

    public async addProfessional() {
        this._id = await this.updateProfessionalId();
        await this.addSchedule();
        await this.setProfessional();
    }

    public async setProfessional() {
        if (this._id == "") {
            return console.error("no id was found");
        }

        const docRef = doc(db, "professionals_dev", this._id);

        await setDoc(docRef, this.getFirestoreFormat());
        await this.updateTimeStamp();
    }

    public async updateProfessional(updates: Partial<ProfessionalInterface>) {
        if (this._id == "") {
            return console.error("no id was found");
        }

        const docRef = doc(db, "professionals_dev", this._id);
        const propertiesToUpdate: (keyof ProfessionalInterface)[] = ["name", "occupations", "email", "isAdmin", "services", "shift", "images"];

        propertiesToUpdate.forEach((prop) => {
            if (updates[prop] !== undefined) {
                (this as any)[`_${prop}`] = updates[prop]!;
            }
        });

        await updateDoc(docRef, updates);
        await this.updateTimeStamp();
    }

    public async getProfessional(id: string) {
        const docRef = doc(db, "professionals_dev", id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.data()) return;

        this.fillFromSnapshot(docSnap);
    }

    public async deleteProfessional() {
        if (this._id == "") {
            return console.error("no id was found");
        }

        const profRef = doc(db, "professionals_dev", this._id);
        const schedRef = doc(db, "schedules", this._id);
        await deleteDoc(profRef);
        await deleteDoc(schedRef);
    }

    private getFirestoreFormat() {
        return {
            name: this._name,
            occupations: this._occupations,
            email: this._email,
            isAdmin: this._isAdmin,
            services: this._services,
            shift: {
                0: this._shift[0] || [],
                1: this._shift[1] || [],
                2: this._shift[2] || [],
                3: this._shift[3] || [],
                4: this._shift[4] || [],
                5: this._shift[5] || [],
                6: this._shift[6] || [],
            },
            startHours: this._startHours,
            images: this._images,
        };
    }

    private async updateTimeStamp() {
        const userRef = doc(db, "professionals_dev", this._id);
        await updateDoc(userRef, { timestamp: serverTimestamp() });
    }

    private async updateProfessionalId() {
        const docRef = doc(db, "config", "ids");
        const configSnap = await getDoc(docRef);
        if (!configSnap.data()) return;

        var config = configSnap.data();
        config!.professional++;
        await setDoc(docRef, config);

        return configSnap.data()!.professional.toString();
    }

    public async searchForUser() {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", this._email));

        const querySnapshot = await getDocs(q);

        const user = new User();
        querySnapshot.forEach((snap) => {
            user.fillFromSnapshot(snap);
        });

        return user;
    }

    // Schedule methods

    public async updateSchedule(day: string, index: string, value: ScheduleItem) {
        const [dayPart, monthPart, yearPart] = day.split("/");
        const date = `${monthPart}-${yearPart.slice(-2)}`;
        const formattedDay = dayPart;

        const docRef = doc(db, "schedules", this._id, date, formattedDay);
        try {
            // Check if the document exists
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                await updateDoc(docRef, { [index]: value });
                console.log("Document updated successfully!");
            } else {
                // Document doesn't exist, create it with the field
                await setDoc(docRef, { [index]: value });
                console.log("Document created successfully!");
            }
        } catch (e) {
            console.error("Error updating document:", e);
        }
    }

    public async deleteScheduleIndex(day: string, index: string) {
        const [dayPart, monthPart, yearPart] = day.split("/");
        const date = `${monthPart}-${yearPart.slice(-2)}`;
        const formattedDay = dayPart;

        delete this._schedule[day][index];

        const docRef = doc(db, "schedules", this._id, date, formattedDay);
        await setDoc(docRef, this._schedule[day]);
    }

    public async getScheduleDay(day: string) {
        const [dayPart, monthPart, yearPart] = day.split("/");
        const date = `${monthPart}-${yearPart.slice(-2)}`;
        const formattedDay = dayPart;

        const nestedField = `${date}/${formattedDay}`;

        const docRef = doc(db, "schedules", this._id, nestedField);

        const docSnap = await getDoc(docRef);
        this._schedule[day] = docSnap.data();
    }

    public async getAllSchedule() {
        const docRef = doc(db, "schedules", this._id);

        const docSnap = await getDoc(docRef);
        this._schedule = docSnap.data();
    }

    private async addSchedule() {
        const docRef = doc(db, "schedules", this._id);

        await setDoc(docRef, {});
        await this.updateScheduleTimeStamp();
    }

    private async updateScheduleTimeStamp() {
        const userRef = doc(db, "schedules", this._id);
        await updateDoc(userRef, { timestamp: serverTimestamp() });
    }

    //qol methods

    public isValid() {
        const hasName = this._name.length > 0;

        return hasName;
    }

    public updateProfessionalState(setter: React.Dispatch<React.SetStateAction<Professional>>, attribute: "id" | "name" | "occupations" | "email" | "isAdmin" | "services" | "shift" | "startHours" | "images" | "schedule", newValue: any) {
        switch (attribute) {
            case "id":
                this._id = newValue;
                break;
            case "name":
                this._name = newValue;
                break;
            case "occupations":
                this._occupations = newValue;
                break;
            case "email":
                this._email = newValue;
                break;
            case "isAdmin":
                this._isAdmin = newValue;
                break;
            case "services":
                this._services = newValue;
                break;
            case "shift":
                this._shift = newValue;
                break;
            case "startHours":
                this._startHours = newValue;
                break;
            case "images":
                this._images = newValue;
                break;
            case "schedule":
                this._schedule = newValue;
                break;
            default:
                break;
        }
        setter(new Professional(this));
    }

    public handleService(service: Service, setter: React.Dispatch<React.SetStateAction<Professional>>) {
        if (this._services.includes(service.getId())) {
            const index = this._services.indexOf(service.getId());
            this._services.splice(index, 1);
        } else {
            this._services.push(service.getId());
        }
        setter(new Professional(this));
    }

    public cleanDay(selectedDay: number, setter: React.Dispatch<React.SetStateAction<Professional>>) {
        this._startHours[selectedDay] = 0;
        this._shift[selectedDay] = [];
        setter(new Professional(this));
    }

    public fillHours(selectedDay: number, setter: React.Dispatch<React.SetStateAction<Professional>>) {
        this._shift[selectedDay] = this._shift[selectedDay]?.map(() => true);
        setter(new Professional(this));
    }

    public updateHourList(selectedDay: number, index: number, setter: React.Dispatch<React.SetStateAction<Professional>>) {
        if (!this._startHours[selectedDay] || isNaN(this._startHours[selectedDay])) this._startHours[selectedDay] = 0;
        if (this._startHours[selectedDay] > 0) {
            // Fill the hour list with all the values
            const pseudoIndexes = Array(this._startHours[selectedDay]).fill(false);
            this._shift[selectedDay] = [...pseudoIndexes, ...this._shift[selectedDay]];
            this._startHours[selectedDay] = 0;
        }
        if (!this._shift[selectedDay]) this._shift[selectedDay] = [];
        if (index >= this._shift[selectedDay].length) {
            // Fill any value between the given index and the last hour list value with falses
            const diff = index - this._shift[selectedDay].length + 1;
            this._shift[selectedDay].push(...Array(diff).fill(false));
        }

        this._shift[selectedDay][index] = !this._shift[selectedDay][index];

        for (let i = this._shift[selectedDay].length - 1; i >= 0; i--) {
            // Remove any value from the end, until the last value is true
            if (this._shift[selectedDay][i]) break;
            this._shift[selectedDay].pop();
        }
        this._startHours[selectedDay] = this._shift[selectedDay].indexOf(true); // Update the startHours value
        for (let i = 0; i < this._startHours[selectedDay]; i++) {
            // Remove any value from the start, until the first value is true
            this._shift[selectedDay].shift();
        }

        setter(new Professional(this));
    }
}
