import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { Post } from '../../models/post.model';
import { Friendship } from '../../models/friendship.model';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-newsfeed',
  standalone: true,
  imports: [SidebarComponent],
  templateUrl: './newsfeed.component.html',
  styleUrl: './newsfeed.component.scss'
})
export class NewsfeedComponent implements OnInit {

  currentUser: User = new User();
  newFeeds: Post[] = [];
  friends: Friendship[] = [];
  friendRequests: Friendship[] = [];

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
    }
  }

  showTab(tabIndex: number): void {
    console.log("show tab");
  }

  createPostButtonClick(): void {
    console.log("createPost");
  }
}
