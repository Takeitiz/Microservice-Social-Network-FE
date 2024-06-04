import { Component, Input, OnInit } from '@angular/core';
import { Friendship } from '../../models/friendship.model';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FriendshipService } from '../../services/friendship.service';
import { RelationService } from '../../services/relation.service';
import { firstValueFrom } from 'rxjs';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-friend-card',
  standalone: true,
  imports: [NgIf],
  templateUrl: './friend-card.component.html',
  styleUrl: './friend-card.component.scss'
})
export class FriendCardComponent implements OnInit {
  @Input() friendship!: Friendship;
  @Input() currentUser!: User;
  @Input() showFriendButton: boolean = true;

  user: User = new User();

  icons: string[] = ['uil uil-user-plus', "uil uil-user-times", 'uil uil-user-check', "uil uil-ban", 'uil uil-user-exclamation'];
  relationIndex = 0;

  constructor(
    private router: Router,
    private userService: UserService,
    private friendshipService: FriendshipService,
    private relationService: RelationService
  ) { }

  ngOnInit() {
    this.friendship = Object.assign(new Friendship(), this.friendship);

    let id = this.friendship.userId === this.currentUser.id ? this.friendship.friendId : this.friendship.userId;
    this.userService.getById(id).subscribe(data => this.user = data);

    this.getRelationship(false);
  }

  async getRelationship(update: boolean): Promise<void> {
    if (update) {
      this.friendship = await firstValueFrom(
        this.relationService.getRelationshipBetweenUsers(
          this.user.id, this.currentUser.id));
    }

    this.relationIndex = this.friendship !== null ? (this.friendship.status + 1) : 0;
    if (this.relationIndex === 1 && this.friendship.friendId === this.currentUser.id) {
      this.relationIndex = 4;
    }
  }

  onAddFriendButtonClick(): void {
    switch (this.relationIndex) {
      case 0: {
        this.addFriend();
        break;
      }
      case 1:
      case 2:
      case 3: {
        this.unFriend();
        break;
      }
      case 4: {
        this.navigateToWall();
        break;
      }
      default: break;
    }
  }

  addFriend(): void {
    if (this.currentUser) {
      let newFriendship = new Friendship();
      newFriendship.status = 0;
      newFriendship.userId = this.currentUser.id;
      newFriendship.friendId = this.user.id;

      this.friendshipService.add(newFriendship).subscribe(data => this.relationIndex = 1);
    }
  }

  async unFriend(): Promise<void> {
    if (this.friendship && this.currentUser) {
      this.friendshipService.delete(this.friendship.id).subscribe(data => this.relationIndex = 0);
    }
  }

  navigateToWall(): void {
    if (this.currentUser) {
      this.router.navigateByUrl(`home/wall/${this.user.id}`)
    }
  }
}
