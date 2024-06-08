import { Component, ElementRef, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { User } from '../../models/user.model';
import { Post } from '../../models/post.model';
import { Friendship } from '../../models/friendship.model';
import { Content } from '../../models/content.model';
import { CreatePostComponent } from '../../components/create-post/create-post.component';
import { PostsComponent } from '../../components/posts/posts.component';
import { FriendCardComponent } from '../../components/friend-card/friend-card.component';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FriendshipService } from '../../services/friendship.service';
import { RelationService } from '../../services/relation.service';
import { NewsfeedComponent } from '../newsfeed/newsfeed.component';
import { NewsfeedService } from '../../services/newsfeed.service';
import { UploadService } from '../../services/upload.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-wall',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    CreatePostComponent,
    PostsComponent,
    FriendCardComponent
  ],
  templateUrl: './wall.component.html',
  styleUrl: './wall.component.scss'
})
export class WallComponent implements OnInit {
  currentUser: User = new User();
  loggedUser: User = new User();
  myFeeds: Post[] = [];
  friends: Friendship[] = [];
  images: Content[] = [];
  isMyWall: boolean = true;
  currentUserAvatarUrl: string = "";

  paging: number = 0;
  loggedUserId: string = '';
  friendCountStr: string = '';

  friendship?: Friendship;
  relationIndex = 0;

  avatar?: File;

  constructor(
    private elementRef: ElementRef,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private friendshipService: FriendshipService,
    private relationService: RelationService,
    private newsfeedService: NewsfeedService,
    private uploadService: UploadService
  ) { }

  ngOnInit() {
    this.initTabsClickEvent();
    this.initUploadAvatarClickEvent();
    this.getWallInfomations();
  }

  async getWallInfomations(): Promise<void> {
    let userId = this.activatedRoute.snapshot.paramMap.get("userId");
    let userData = localStorage.getItem('user');

    if (userData) {
      let userObj = JSON.parse(userData);
      this.loggedUserId = userObj.id;
      this.isMyWall = userId == null;
      userId = this.isMyWall ? this.loggedUserId : userId;

      if (userId) {
        this.currentUser = await firstValueFrom(this.userService.getById(userId));
        this.loggedUser = this.currentUser;
        this.getMyFeeds();
        this.getFriends();
        this.getCurrentUserAvatar();

        if (!this.isMyWall) {
          this.loggedUser = await firstValueFrom(this.userService.getById(this.loggedUserId));
          this.getRelationship();
        }
      }
    }

  }

  async getRelationship(): Promise<void> {
    this.friendship = await firstValueFrom(
      this.relationService.getRelationshipBetweenUsers(
        this.loggedUserId, this.currentUser.id
      )
    );

    this.relationIndex = this.friendship !== null ? (this.friendship.status + 1) : 0;
    if (this.relationIndex === 1 && this.friendship.friendId === this.currentUser.id) {
      this.relationIndex = 4;
    }
  }

  getMyFeeds() {
    this.newsfeedService.getUserFeeds(this.currentUser.id, true)
      .subscribe(data => this.myFeeds = data, error => console.log(error));
  }

  getFriends() {
    this.relationService.getUserRelationship(this.currentUser.id)
      .subscribe(data => {
        this.friends = data;
        this.friendCountStr = this.friends.length + " friend";
        if (this.friends.length > 1) {
          this.friendCountStr += "s";
        }
      })
  }

  getImages() {
    if (this.images.length == 0) {
      this.myFeeds.forEach(post => this.images.push(...post.contents!));
    }
  }

  addFriend() {
    let newFriendship = new Friendship();
    newFriendship.status = 0;
    newFriendship.userId = this.loggedUserId;
    newFriendship.friendId = this.currentUser.id;

    this.friendshipService.add(newFriendship).subscribe(data => this.getRelationship());
  }

  async acceptFriendRequest(): Promise<void> {
    if (this.friendship && this.friendship.status === 0) {
      this.friendship.status = 1;
      this.friendshipService.update(this.friendship).subscribe(data => this.getRelationship());
    }
  }

  async unFriend(): Promise<void> {
    if (this.friendship) {
      this.friendshipService.delete(this.friendship.id).subscribe(data => this.relationIndex = 0);
    }
  }

  getCurrentUserAvatar() {
    this.uploadService.fetchImage(this.currentUser.id).subscribe(data => {
      this.currentUser.avatarUrl = data;
    });
  }

  chooseAvatar(event: any): void {
    this.avatar = event.target.files[0];

    if (this.avatar) {

      const uploadAvatar = this.elementRef.nativeElement.querySelector('.upload-avatar') as HTMLElement;
      const img = this.elementRef.nativeElement.querySelector('.upload-avatar .avatar') as HTMLImageElement;

      uploadAvatar.style.display = 'grid';

      img.onload = () => {
        URL.revokeObjectURL(img.src);
      }
      img.src = URL.createObjectURL(this.avatar);
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
    }
  }

  uploadAvatar(): void {
    if (this.avatar) {
      this.uploadService.uploadAvatar(this.avatar, this.currentUser.id).subscribe(data => {
        console.log(data);
        const img = this.elementRef.nativeElement.querySelector('.head .profile-picture img') as HTMLImageElement;

        img.onload = () => {
          URL.revokeObjectURL(img.src);
        }
        img.src = URL.createObjectURL(this.avatar!);

        this.currentUser.avatarUrl = data;
        window.location.reload();
      });
    }
  }

  initTabsClickEvent(): void {
    const tabs = document.querySelectorAll('.tabs span');
    const postsLayout = document.querySelector('.container .posts-layout') as HTMLElement;
    const friendsLayout = document.querySelector('.container .friends-layout') as HTMLElement;
    const imagesLayout = document.querySelector('.container .images-layout') as HTMLElement;

    const removeActiveClass = () => {
      tabs.forEach(tab => {
        tab.classList.remove('active');
      });
    };

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        removeActiveClass();
        tab.classList.add('active');

        postsLayout.style.display = 'none';
        friendsLayout.style.display = 'none';
        imagesLayout.style.display = 'none';

        if (tab.id === 'tab-posts') {
          postsLayout.style.display = 'grid';
        } else if (tab.id === 'tab-friends') {
          friendsLayout.style.display = 'grid';
        }
        else if (tab.id === 'tab-images') {
          imagesLayout.style.display = 'grid';
          this.getImages();
        }
      });
    });
  }

  initUploadAvatarClickEvent() {
    const uploadAvatar = this.elementRef.nativeElement.querySelector('.upload-avatar') as HTMLElement;
    uploadAvatar.addEventListener('click', (event) => {
      if ((event.target as HTMLElement).classList.contains('upload-avatar')) {
        uploadAvatar.style.display = 'none';
      }
    })
  }
}
