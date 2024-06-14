import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { Friendship } from '../../models/friendship.model';
import { Router } from '@angular/router';
import { FriendshipService } from '../../services/friendship.service';
import { RelationService } from '../../services/relation.service';
import { firstValueFrom } from 'rxjs';
import { UploadService } from '../../services/upload.service';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.scss'
})
export class ProfileCardComponent implements OnInit {
  @Input() currentUser?: User;
  @Input() user: User = new User();

  icons: string[] = ['uil uil-user-plus', "uil uil-user-times"];
  friendship?: Friendship;
  relationIndex = 0;

  constructor(
    private router: Router,
    private friendshipService: FriendshipService,
    private relationService: RelationService,
    private uploadService: UploadService,
  ) { }

  ngOnInit() {
    if (this.user) {
      this.user = Object.assign(new User(), this.user);
    }
    this.uploadService.fetchImage(this.user.id).subscribe(data => {
      this.user.avatarUrl = data;
    });
    this.getRelationship();
  }

  async getRelationship(): Promise<void> {
    if (this.currentUser && this.user) {
      this.friendship = await firstValueFrom(
        this.relationService.getRelationshipBetweenUsers(
          this.user.id, this.currentUser.id));

      this.relationIndex = this.friendship !== null ? 1 : 0;
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
