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
  // fix later
  user: User = new User();

  constructor(private router: Router) { }

  ngOnInit() {
    console.log("Hello from dashboard");
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
