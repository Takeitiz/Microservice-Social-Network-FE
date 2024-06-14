import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Comment } from '../../models/comment.model';
import { Util } from '../../utils/utils';
import { User } from '../../models/user.model';
import { UploadService } from '../../services/upload.service';

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

  constructor(
    private uploadService: UploadService
  ) { }

  ngOnInit() {
    this.commentData.user = Object.assign(new User(), this.commentData.user);

    this.uploadService.fetchImage(this.commentData.user.id).subscribe({
      next: (data) => {
        if (this.commentData.user) {
          this.commentData.user.avatarUrl = data;
        }
      },
      error: (err) => {
        console.error('Failed to fetch image', err);
      }
    });


    this.getTimeDiff();
  }

  avatarClick() {
    this.onAvatarClick.emit(this.commentData.user!.id);
  }

  getTimeDiff() {
    this.timeDiff = Util.getTimeDiff(this.commentData.createdTime);
  }

}
