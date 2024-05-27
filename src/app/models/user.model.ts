import { AppComponent } from "../app.component";

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

    getAvatar(): string {
        // return AppComponent.baseUrl + 'app-images/' + this.id + '.jpg';
        // fix later
        return AppComponent.defaultAvatar;
    }

    getDefaultAvatar(): string {
        return AppComponent.defaultAvatar;
    }
}