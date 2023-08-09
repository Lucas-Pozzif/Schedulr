class User {
  private id: string;
  private name: string;
  private email: string;
  private number: string;

  constructor(id?: string, name?: string, email?: string, number?: string) {
    this.id = id || "";
    this.name = name || "";
    this.email = email || "";
    this.number = number || "";
  }

  public getId(): string {
    return this.id;
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

  public getUser() {}

  public setUser(user: User): void {
    this.id = user.id || "";
    this.name = user.name || "";
    this.email = user.email || "";
    this.number = user.number || "";
  }

  public deleteUser(): void {
    // Implement delete logic here
  }
  
  public grabAllProfessionals() {}

  public grabAllServices() {

  }
}
