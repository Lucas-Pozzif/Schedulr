import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { auth, db } from "../Services/firebase/firebase";
import { DocumentData, doc, getDoc } from "firebase/firestore";
import { User as FirebaseUser } from "firebase/auth";

export class User {
  private id: string;
  private name: string;
  private email: string;
  private number: string;
  private isProfessional: boolean;
  private isAdministrator: boolean;

  constructor(id: string = "", name: string = "", email: string = "", number: string = "") {
    this.id = id;
    this.name = name;
    this.email = email;
    this.number = number;
    this.isProfessional = false; // Default value, can be changed later
    this.isAdministrator = false; // Default value, can be changed later
  }

  // Getters and Setters
  public getId(): string {
    return this.id;
  }

  public setId(id: string): void {
    this.id = id;
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public getEmail(): string {
    return this.email;
  }

  public setEmail(email: string): void {
    this.email = email;
  }

  public getNumber(): string {
    return this.number;
  }

  public setNumber(number: string): void {
    this.number = number;
  }

  public isProfessionalUser(): boolean {
    return this.isProfessional;
  }

  public setIsProfessional(isProfessional: boolean): void {
    this.isProfessional = isProfessional;
  }

  public isAdministratorUser(): boolean {
    return this.isAdministrator;
  }

  public setIsAdministrator(isAdministrator: boolean): void {
    this.isAdministrator = isAdministrator;
  }

  public async googleAuth() {
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
  }
  

  public async getUser(client?: FirebaseUser) {
    const docRef = doc(db, "users", this.id);
    const docSnap = await getDoc(docRef);

    this.fillUser(docSnap);
  }

  private fillUser(userSnapshot: DocumentData) {
    const userData = userSnapshot.data();

    this.id = userData!.id;
    this.name = userData!.name;
    this.email = userData!.email;
    this.number = userData!.number;
    this.isProfessional = userData!.isProfessional;
    this.isAdministrator = userData!.isAdministrator;
  }
}