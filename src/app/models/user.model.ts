export class User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    dateOfBirth: Date;
    role: number;

    constructor(id = '', firstName = '', lastName = '', email = '', password = '', phone = '', dateOfBirth = new Date(), role = 0) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.dateOfBirth = dateOfBirth;
        this.role = role;
    }
}