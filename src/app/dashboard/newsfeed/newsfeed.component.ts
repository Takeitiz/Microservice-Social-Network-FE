import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { Post } from '../../models/post.model';
import { Friendship } from '../../models/friendship.model';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { PostsComponent } from '../../components/posts/posts.component';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { NewsfeedService } from '../../services/newsfeed.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-newsfeed',
  standalone: true,
  imports: [SidebarComponent, PostsComponent, NgFor],
  templateUrl: './newsfeed.component.html',
  styleUrl: './newsfeed.component.scss'
})
export class NewsfeedComponent implements OnInit, AfterViewInit {

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
  ) {
  }

  ngOnInit(): void {
    this.getHomeInformations();
  }

  ngAfterViewInit() {
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


  showTab(tabIndex: number): void {
    console.log("show tab");
  }

  createPostButtonClick(): void {
    console.log("createPost");
  }
}
