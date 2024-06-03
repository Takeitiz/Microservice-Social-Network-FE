import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { NgIf, } from '@angular/common';
import { User } from '../models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, NgIf],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  user: User = new User();

  constructor(private router: Router) { }

  ngOnInit() {
    this.getCurrentUser();
  }

  getCurrentUser() {
    let userData = localStorage.getItem('user');

    if (userData) {
      let userObj = JSON.parse(userData);

      const dobParts = userObj.attributes.dateOfBirth[0].split('/');
      const dateOfBirth = new Date(+dobParts[2], +dobParts[1] - 1, +dobParts[0]);

      this.user.id = userObj.id;
      this.user.firstName = userObj.firstName;
      this.user.lastName = userObj.lastName;
      this.user.email = userObj.email;
      this.user.phone = userObj.attributes.phone[0];
      this.user.dateOfBirth = dateOfBirth;
    }
  }

  navigateToDashboard() {
    this.router.navigateByUrl('/home');
  }

  navigateToWall() {
    this.router.navigateByUrl('/home/wall');
  }

  search(evt: any) {
    // TODO: Implement search
    console.log("Search");
  }

}
