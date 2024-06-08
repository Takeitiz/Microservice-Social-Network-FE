import { Component, ElementRef, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { User } from '../../models/user.model';
import { Friendship } from '../../models/friendship.model';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { FriendCardComponent } from '../../components/friend-card/friend-card.component';
import { RequestsComponent } from '../../components/requests/requests.component';
import { ProfileCardComponent } from '../../components/profile-card/profile-card.component';
import { UserService } from '../../services/user.service';
import { SearchService } from '../../services/search.service';
import { RelationService } from '../../services/relation.service';
import { KeycloakService } from '../../services/keycloak/keycloak.service';
import { UploadService } from '../../services/upload.service';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    SidebarComponent,
    FriendCardComponent,
    RequestsComponent,
    ProfileCardComponent
  ],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.scss'
})
export class ExploreComponent implements OnInit {
  currentUser: User = new User();
  searchedUsers: User[] = [];
  friends: Friendship[] = [];
  friendRequests: Friendship[] = [];

  constructor(
    private elementRef: ElementRef,
    private router: Router,
    private activedRoute: ActivatedRoute,
    private userService: UserService,
    private searchService: SearchService,
    private relationService: RelationService,
    private uploadService: UploadService,
    private keycloakService: KeycloakService
  ) { }

  ngOnInit() {
    this.searchUserByKeyword();
  }

  async getUserInformation(): Promise<void> {
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

      this.getCurrentUserAvatar();
      this.getFriendRequests();
    }
  }

  getCurrentUserAvatar() {
    this.uploadService.fetchImage(this.currentUser.id).subscribe(data => {
      this.currentUser.avatarUrl = data;
    });
  }

  getFriends(): void {
    this.relationService.getUserRelationship(this.currentUser.id).subscribe(data => this.friends = data);
  }

  getFriendRequests(): void {
    this.relationService.getFriendRequestByUserId(this.currentUser.id).subscribe(data => this.friendRequests = data);
  }

  async searchUserByKeyword(): Promise<void> {
    await this.getUserInformation();

    let keyword = this.activedRoute.snapshot.paramMap.get('keyword');
    if (keyword) {
      this.searchService.search(this.currentUser.id, keyword).subscribe(data => this.searchedUsers = data, error => console.log(error));
    }
  }

  showTab(tabIndex: number): void {
    const tabHome = document.querySelector('.tab-home') as HTMLElement;
    const tabFriends = document.querySelector('.tab-friends') as HTMLElement;
    const tabSettings = document.querySelector('.tab-settings') as HTMLElement;

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

  navigateToWall(): void {
    this.router.navigateByUrl('/home/wall');
  }
}
