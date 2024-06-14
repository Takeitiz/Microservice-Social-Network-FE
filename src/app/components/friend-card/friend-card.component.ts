import { Component, Input, OnInit } from '@angular/core';
import { Friendship } from '../../models/friendship.model';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FriendshipService } from '../../services/friendship.service';
import { RelationService } from '../../services/relation.service';
import { firstValueFrom } from 'rxjs';
import { NgIf } from '@angular/common';
import { UploadService } from '../../services/upload.service';


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

  icons: string[] = ['uil uil-user-plus', "uil uil-user-times"];
  relationIndex = 0;

  constructor(
    private router: Router,
    private userService: UserService,
    private friendshipService: FriendshipService,
    private uploadService: UploadService,
    private relationService: RelationService
  ) { }

  ngOnInit() {
    this.friendship = Object.assign(new Friendship(), this.friendship);

    let id = this.friendship.userId === this.currentUser.id ? this.friendship.friendId : this.friendship.userId;
    this.userService.getById(id).subscribe(data => this.user = data);

    this.uploadService.fetchImage(id).subscribe(data => {
      this.user.avatarUrl = data;
    });
    this.getRelationship(false);
  }

  async getRelationship(update: boolean): Promise<void> {
    if (update) {
      this.friendship = await firstValueFrom(
        this.relationService.getRelationshipBetweenUsers(
          this.user.id, this.currentUser.id));
    }

    this.relationIndex = this.friendship !== null ? 1 : 0;
  }

  onAddFriendButtonClick(): void {
    switch (this.relationIndex) {
      case 0: {
        this.addFriend();
        break;
      }
      case 1: {
        this.unFriend();
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
