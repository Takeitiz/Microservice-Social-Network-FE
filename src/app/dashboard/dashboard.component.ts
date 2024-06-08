import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { NgIf, } from '@angular/common';
import { User } from '../models/user.model';
import { UploadService } from '../services/upload.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, NgIf],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  user: User = new User();

  constructor(
    private router: Router,
    private uploadService: UploadService
  ) { }

  ngOnInit() {
    this.initElementsClickEvent();
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

      this.getCurrentUserAvatar();
    }
  }

  getCurrentUserAvatar() {
    this.uploadService.fetchImage(this.user.id).subscribe(data => {
      this.user.avatarUrl = data;
    });
  }

  navigateToDashboard() {
    this.router.navigateByUrl('/home');
  }

  navigateToWall() {
    this.router.navigateByUrl('/home/wall');
  }

  search(evt: any) {
    const keyword = evt.target.value;
    evt.target.value = '';

    if (keyword) {
      this.router.navigateByUrl('home/search/' + keyword);
    }
  }

  initElementsClickEvent(): void {
    const bell = document.querySelector('.notification') as HTMLElement;
    const popup = document.querySelector('.notification-popup') as HTMLElement;
    const notiCount = document.querySelector('.notification-count') as HTMLElement;

    bell.addEventListener('click', (event) => {
      event.stopPropagation();
      let visible = popup.style.display && popup.style.display !== 'none';
      popup.style.display = visible ? 'none' : 'block';
      notiCount.style.display = 'none';
    });

    popup.addEventListener('click', (event) => {
      event.stopPropagation();
    })

    window.addEventListener('click', () => {
      popup.style.display = 'none';
    });
  }
}
