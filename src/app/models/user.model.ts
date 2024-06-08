import { Injectable } from "@angular/core";
import { AppComponent } from "../app.component";
import { UploadService } from "../services/upload.service";
import { Util } from "../utils/utils";

export class User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    dateOfBirth: Date;
    role: number;
    avatarUrl: string = "";

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
        if (this.avatarUrl === "") return AppComponent.defaultAvatar;
        return this.avatarUrl;
    }

    getDefaultAvatar(): string {
        return AppComponent.defaultAvatar;
    }

    getFullName(): string {
        return this.firstName + " " + this.lastName;
    }

    getEmailPrefix(): string {
        let prefixIndex = this.email.indexOf("@");
        if (prefixIndex === -1) {
            return this.email;
        }
        return this.email.substring(0, prefixIndex);
    }

    getDateOfBirth(): string {
        return this.dateOfBirth.toString();
    }
}