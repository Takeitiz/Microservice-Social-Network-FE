import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { Friendship } from '../../models/friendship.model';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FriendshipService } from '../../services/friendship.service';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.scss'
})
export class RequestsComponent implements OnInit {
  @Input() friendshipData!: Friendship;
  @Input() currentUser!: User;

  user: User = new User();
  response: string = '';

  constructor(
    private elementRef: ElementRef,
    private router: Router,
    private userService: UserService,
    private friendshipService: FriendshipService,
  ) { }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.userService.getById(this.friendshipData.userId).subscribe(data => this.user = data);
  }

  async accept(): Promise<void> {
    if (this.friendshipData.status === 0) {
      this.friendshipData.status = 1;
      this.friendshipService.update(this.friendshipData).subscribe(data => this.showResponse('accepted'));
    }
  }

  decline(): void {
    this.friendshipService.delete(this.friendshipData.id).subscribe(data => this.showResponse('declined'));
  }

  showResponse(result: string): void {
    const buttons = this.elementRef.nativeElement.querySelector('.action') as HTMLElement;
    const responseElm = this.elementRef.nativeElement.querySelector('.response') as HTMLElement;

    buttons.style.display = 'none';
    responseElm.style.display = 'block';

    this.response = result;
  }

  navigateToWall(): void {
    this.router.navigateByUrl(`home/wall/${this.friendshipData.userId}`);
  }
}
