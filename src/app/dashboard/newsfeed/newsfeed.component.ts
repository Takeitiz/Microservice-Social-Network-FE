import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { User } from '../../models/user.model';
import { Post } from '../../models/post.model';
import { Friendship } from '../../models/friendship.model';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { PostsComponent } from '../../components/posts/posts.component';
import { FriendCardComponent } from '../../components/friend-card/friend-card.component';
import { RequestsComponent } from '../../components/requests/requests.component';
import { CreatePostComponent } from '../../components/create-post/create-post.component';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { NewsfeedService } from '../../services/newsfeed.service';
import { NgFor } from '@angular/common';
import { RelationService } from '../../services/relation.service';
import { KeycloakService } from '../../services/keycloak/keycloak.service';
import { NgIf } from '@angular/common';
import { UploadService } from '../../services/upload.service';

import { TranslateModule } from '@ngx-translate/core';
import {
  StreamAutocompleteTextareaModule,
  StreamChatModule,
  ChannelService,
  StreamI18nService,
  ChatClientService,
} from 'stream-chat-angular';
import { ChatService } from '../../services/chat.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-newsfeed',
  standalone: true,
  imports: [
    SidebarComponent,
    PostsComponent,
    NgFor,
    FriendCardComponent,
    NgIf,
    RequestsComponent,
    CreatePostComponent,
    TranslateModule,
    StreamAutocompleteTextareaModule,
    StreamChatModule
  ],
  templateUrl: './newsfeed.component.html',
  styleUrl: './newsfeed.component.scss'
})
export class NewsfeedComponent implements OnInit {
  @ViewChild(CreatePostComponent) createPost?: CreatePostComponent;

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
    private uploadService: UploadService,
    private getTokenService: ChatService,
    private keycloakService: KeycloakService,

    private chatService: ChatClientService,
    private channelService: ChannelService,
    private streamI18nService: StreamI18nService,
  ) {
  }

  async ngOnInit() {
    await this.getHomeInformations();

    let userData = localStorage.getItem('user');
    if (userData) {
      let userObj = JSON.parse(userData);
      const apiKey = '42zja5qw98p3';
      const userId = userObj.id;

      try {
        const token = await firstValueFrom(this.getTokenService.getToken(userId));
        this.chatService.init(apiKey, userId, token);
        this.streamI18nService.setTranslation();

        if (this.chatService.chatClient) {
          await this.getFriends();
        }
      } catch (error) {
        console.error('Failed to fetch user token or initialize chat client:', error);
      }
    }
  }

  async createChannelsForFriends() {
    if (!this.chatService.chatClient) {
      console.error('Chat client is not initialized');
      return;
    }

    const friendDetailsPromises = this.friends.map(async friendship => {
      let friendId = friendship.userId === this.currentUser.id ? friendship.friendId : friendship.userId;

      try {
        const [friendDetails, friendAvatar] = await Promise.all([
          firstValueFrom(this.userService.getById(friendId)),
          firstValueFrom(this.uploadService.fetchImage(friendId))
        ]);

        return {
          friendId,
          friendDetails,
          friendAvatar
        };
      } catch (error) {
        console.error(`Failed to fetch details for friend ID ${friendId}:`, error);
        return null;
      }
    });

    const friendsWithData = (await Promise.all(friendDetailsPromises)).filter(friend => friend !== null) as {
      friendId: string;
      friendDetails: User;
      friendAvatar: string;
    }[];

    friendsWithData.forEach(async ({ friendId, friendDetails, friendAvatar }) => {
      const channelId = `chat-with-${friendId}`;
      try {
        const channel = this.chatService.chatClient.channel('messaging', channelId, {
          image: friendAvatar,
          members: [this.currentUser.id, friendId],
          name: `Chat with ${friendDetails.firstName} ${friendDetails.lastName}`,
        });

        console.log('Channel initialized:', channelId);

        const creationResult = await channel.create();
        console.log('Channel creation result:', creationResult);

        const addMembersResult = await channel.addMembers([this.currentUser.id, friendId]);
        console.log('Add members result:', addMembersResult);

      } catch (error) {
        console.error(`Failed to create channel for friend ${friendId}:`, error);
      }
    });
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

      this.getCurrentUserAvatar();
      this.getNewFeeds();
      this.getFriendRequests();
    }
  }

  getCurrentUserAvatar() {
    this.uploadService.fetchImage(this.currentUser.id).subscribe(data => {
      this.currentUser.avatarUrl = data;
    });
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
    this.relationService.getUserRelationship(this.currentUser.id).subscribe({
      next: (data) => {
        this.friends = data;
        this.createChannelsForFriends();
      },
      error: (error) => {
        console.error('Error fetching friends:', error);
      }
    });
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
    if (this.createPost) {
      this.createPost.showCreatePost();
      this.showTab(0);
    }
  }
}
