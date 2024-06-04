import { Component, ElementRef, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { Post } from '../../models/post.model';
import { Friendship } from '../../models/friendship.model';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { PostsComponent } from '../../components/posts/posts.component';
import { FriendCardComponent } from '../../components/friend-card/friend-card.component';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { NewsfeedService } from '../../services/newsfeed.service';
import { NgFor } from '@angular/common';
import { RelationService } from '../../services/relation.service';
import { KeycloakService } from '../../services/keycloak/keycloak.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-newsfeed',
  standalone: true,
  imports: [SidebarComponent, PostsComponent, NgFor, FriendCardComponent, NgIf],
  templateUrl: './newsfeed.component.html',
  styleUrl: './newsfeed.component.scss'
})
export class NewsfeedComponent implements OnInit {

  currentUser: User = new User();
  newFeeds: Post[] = [];
  friends: Friendship[] = [];
  friendRequests: Friendship[] = [];

  constructor(
    private elementRef: ElementRef,
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private newsfeedService: NewsfeedService,
    private relationService: RelationService,
    private keycloakService: KeycloakService
  ) {
  }

  ngOnInit(): void {
    this.getHomeInformations();
  }

  getHomeInformations() {
    let userData = localStorage.getItem('user');

    if (userData) {
      let userObj = JSON.parse(userData);

      const dobParts = userObj.attributes.dateOfBirth[0].split('/');
      const dateOfBirth = new Date(+dobParts[2], +dobParts[1] - 1, +dobParts[0]);

      this.currentUser.id = userObj.id;
      this.currentUser.firstName = userObj.firstName;
      this.currentUser.lastName = userObj.lastName;
      this.currentUser.email = userObj.email;
      this.currentUser.phone = userObj.attributes.phone[0];
      this.currentUser.dateOfBirth = dateOfBirth;

      this.getNewFeeds();
      this.getFriendRequests();
    }
  }

  getNewFeeds(): void {
    this.newsfeedService.getUserFeeds(this.currentUser.id, false)
      .subscribe({
        next: (data) => {
          this.newFeeds = data;
        },
        error: (error) => {
          console.error('Error fetching news feeds:', error);
        }
      });
  }

  getFriends(): void {
    this.relationService.getUserRelationship(this.currentUser.id).subscribe(data => this.friends = data);
  }

  getFriendRequests(): void {
    this.relationService.getFriendRequestByUserId(this.currentUser.id).subscribe(data => this.friendRequests = data);
  }

  showTab(tabIndex: number) {
    const tabHome = this.elementRef.nativeElement.querySelector('.tab-home') as HTMLElement;
    const tabFriends = this.elementRef.nativeElement.querySelector('.tab-friends') as HTMLElement;
    const tabSettings = this.elementRef.nativeElement.querySelector('.tab-settings') as HTMLElement;

    tabHome.style.display = 'none';
    tabFriends.style.display = 'none';
    tabSettings.style.display = 'none';

    switch (tabIndex) {
      case 0: {
        tabHome.style.display = 'block';
        break;
      } case 1: {
        tabFriends.style.display = 'block';
        this.getFriends();
        break;
      } case 2: {
        this.openSetting();
        break;
      }
      default:
        break;
    }
  }

  openSetting() {
    this.keycloakService.setting();
  }

  createPostButtonClick(): void {
    console.log("createPost");
  }
}
