import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Comment } from '../../models/comment.model';
import { Util } from '../../utils/utils';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class CommentComponent implements OnInit {
  @Input() commentData!: Comment;
  @Output() onAvatarClick: EventEmitter<string> = new EventEmitter();

  timeDiff: string = '';

  constructor() { }

  ngOnInit() {
    this.commentData.user = Object.assign(new User(), this.commentData.user);
    this.getTimeDiff();
  }

  avatarClick() {
    this.onAvatarClick.emit(this.commentData.user!.id);
  }

  getTimeDiff() {
    this.timeDiff = Util.getTimeDiff(this.commentData.createdTime);
  }

}
