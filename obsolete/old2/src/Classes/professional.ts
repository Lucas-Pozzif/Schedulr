import { DocumentSnapshot, addDoc, collection, deleteDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../Services/firebase/firebase";

class Professional {
  private id?: string;
  private name?: string;
  private email?: string;
  private photo?: string;
  private occupations?: string[];
  private services?: string[];
  private comercialTime?: {
    0: boolean[];
    1: boolean[];
    2: boolean[];
    3: boolean[];
    4: boolean[];
    5: boolean[];
    6: boolean[];
  };

  constructor();
  constructor(id: string);
  constructor(
    name?: string,
    email?: string,
    photo?: string,
    occupations?: string[],
    services?: string[],
    comercialTime?: {
      0: boolean[];
      1: boolean[];
      2: boolean[];
      3: boolean[];
      4: boolean[];
      5: boolean[];
      6: boolean[];
    }
  ) {
    if (email) {
      this.name = name;
      this.email = email;
      this.photo = photo;
      this.occupations = occupations;
      this.services = services;
      this.comercialTime = comercialTime;
    } else {
      this.id = name;
    }
  }
  // Setters
  public setId(id: string): void {
    this.id = id;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public setEmail(email: string): void {
    this.email = email;
  }

  public setPhoto(photo: string): void {
    this.photo = photo;
  }

  public setOccupations(occupations: string[]): void {
    this.occupations = occupations;
  }

  public setServices(services: string[]): void {
    this.services = services;
  }

  public setComercialTime(comercialTime: { 0: boolean[]; 1: boolean[]; 2: boolean[]; 3: boolean[]; 4: boolean[]; 5: boolean[]; 6: boolean[] }): void {
    this.comercialTime = comercialTime;
  }

  // Getters
  public getId(): string | undefined {
    return this.id;
  }

  public getName(): string | undefined {
    return this.name;
  }

  public getEmail(): string | undefined {
    return this.email;
  }

  public getPhoto(): string | undefined {
    return this.photo;
  }

  public getOccupations(): string[] | undefined {
    return this.occupations;
  }

  public getServices(): string[] | undefined {
    return this.services;
  }

  public getComercialTime():
    | {
        0: boolean[];
        1: boolean[];
        2: boolean[];
        3: boolean[];
        4: boolean[];
        5: boolean[];
        6: boolean[];
      }
    | undefined {
    return this.comercialTime;
  }

  public async createProfessional() {
    const colRef = collection(db, "professionals");
    await addDoc(colRef, this.professionalData());
  }

  public async getProfessional() {
    if (!this.id) return console.error("this professional has no Id: " + this.name);

    const docRef = doc(db, "professionals", this.id);
    const docSnap = await getDoc(docRef);

    this.fillProfessional(docSnap);
  }

  public async deleteProfessional() {
    if (!this.id) return console.error("this professional has no Id: " + this.name);
    const docRef = doc(db, "professionals", this.id);

    await deleteDoc(docRef);
  }

  private fillProfessional(professionalSnapshot: DocumentSnapshot) {
    const serviceData = professionalSnapshot.data();

    this.name = serviceData!.name;
    this.email = serviceData!.email;
    this.photo = serviceData!.photo;
    this.occupations = serviceData!.occupations;
    this.services = serviceData!.services;
    this.comercialTime = serviceData!.comercialTime;
  }

  private professionalData() {
    return {
      name: this.name,
      email: this.email,
      photo: this.photo,
      occupations: this.occupations,
      services: this.services,
      comercialTime: this.comercialTime,
    };
  }
}
