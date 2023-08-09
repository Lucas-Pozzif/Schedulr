import {
  DocumentSnapshot,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../Services/firebase/firebase";

type serviceType = {
  name: string;
  value: string;
  photo: string;
  duration: string;
  inicial: string;
  subServices?: serviceType[];
};

class Service {
  private id: string;
  private name: string;
  private value: string;
  private photo: string;
  private duration: string;
  private inicial: string;
  private subServices?: Service[];

  constructor(
    id: string,
    name: string,
    value: string,
    photo: string,
    duration: string,
    inicial: string,
    subServices?: Service[]
  ) {
    this.id = id;
    this.name = name;
    this.value = value;
    this.photo = photo;
    this.duration = duration;
    this.inicial = inicial;
    this.subServices = subServices;
  }

  // Setters
  public setId(id: string): void {
    this.id = id;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public setValue(value: string): void {
    this.value = value;
  }

  public setPhoto(photo: string): void {
    this.photo = photo;
  }

  public setDuration(duration: string): void {
    this.duration = duration;
  }

  public setInicial(inicial: string): void {
    this.inicial = inicial;
  }

  public setSubServices(subServices?: Service[]): void {
    this.subServices = subServices;
  }

  // Getters
  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getValue(): string {
    return this.value;
  }

  public getPhoto(): string {
    return this.photo;
  }

  public getDuration(): string {
    return this.duration;
  }

  public getInicial(): string {
    return this.inicial;
  }

  public getSubServices(): Service[] | undefined {
    return this.subServices;
  }

  public async createService() {
    const colRef = collection(db, "services");
    await addDoc(colRef, this.serviceData());
  }

  public async getService() {
    if (!this.id) return console.error("this service has no Id: " + this.name);

    const docRef = doc(db, "services", this.id);
    const docSnap = await getDoc(docRef);

    this.fillService(docSnap);
  }
  public async deleteService() {
    if (!this.id) return console.error("this service has no Id: " + this.name);

    const docRef = doc(db, "services", this.id);
    await deleteDoc(docRef);
  }

  private fillService(serviceSnapshot: DocumentSnapshot) {
    const serviceData = serviceSnapshot.data();

    this.name = serviceData!.name;
    this.value = serviceData!.value;
    this.photo = serviceData!.photo;
    this.duration = serviceData!.duration;
    this.inicial = serviceData!.inicial;
    this.subServices = serviceData!.subServices;
  }

  private serviceData(isSubservice: boolean = false): serviceType {
    var subs: serviceType[] = [];
    if (this.subServices && !isSubservice) {
      subs = this.subServices.map((subservice) => {
        return subservice.serviceData(true);
      });
    }

    return {
      name: this.name,
      value: this.value,
      photo: this.photo,
      duration: this.duration,
      inicial: this.inicial,
      subServices: subs,
    };
  }
}
