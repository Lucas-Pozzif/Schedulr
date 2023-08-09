import { addDoc, collection } from "firebase/firestore";
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

  public async createProfessional() {
    const colRef = collection(db, "professionals");
    await addDoc(colRef, this.professionalData());
  }

  public getProfessional() {}

  public deleteUser() {}

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
