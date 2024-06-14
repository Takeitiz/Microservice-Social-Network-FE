import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { PostService } from '../../services/post.service';
import { Router } from '@angular/router';
import { ContentService } from '../../services/content.service';
import { UploadService } from '../../services/upload.service';
import { Post } from '../../models/post.model';
import { Content } from '../../models/content.model';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.scss'
})
export class CreatePostComponent implements OnInit {
  @Input() currentUser: User = new User();

  mediaContents: File[] = [];
  caption: string = '';

  constructor(
    private elementRef: ElementRef,
    private router: Router,
    private postService: PostService,
    private contentService: ContentService,
    private uploadService: UploadService
  ) { }

  ngOnInit() {
    this.initCreatePostEvent();
  }

  createPost() {
    let newPost = new Post();
    newPost.userId = this.currentUser.id;
    newPost.caption = this.caption;

    this.postService.add(newPost).subscribe(async postId => {
      for (const media of this.mediaContents) {
        await new Promise<void>((resolve, reject) => {
          this.uploadService.uploadPostImage(media).subscribe(result => {

            let content = new Content();
            content.postId = postId;
            content.linkContent = result;
            content.image_id = result;
            content.type = 1;
            content.textContent = "random";

            this.contentService.add(content).subscribe(
              success => {
                console.log(success);
                resolve();
              },
              error => {
                console.error(error);
                resolve();
              }
            );
          })
        })
      }
      this.router.navigateByUrl('/home');
    })
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];

    if (file) {
      this.mediaContents.push(file);
      const wrapper = this.elementRef.nativeElement.querySelector('#image-wrapper');

      let container = document.createElement('div');
      container.style.position = 'relative';
      container.style.width = '33%';
      container.style.height = '15rem';
      container.style.marginRight = '0.3rem';
      container.style.borderRadius = 'var(--card-border-radius)';
      container.style.overflow = 'hidden';

      let removeBtn = document.createElement('span');
      removeBtn.innerHTML = '<i class="uil uil-multiply"></i>';
      removeBtn.addEventListener('click', () => {
        let index = this.mediaContents.indexOf(file);
        this.mediaContents.splice(index, 1);
        container.remove();
        this.showCreatePost();
      });

      removeBtn.style.position = 'absolute';
      removeBtn.style.top = '0.5rem';
      removeBtn.style.right = '0.5rem';
      removeBtn.style.fontSize = '1rem';
      removeBtn.style.color = 'white';
      removeBtn.style.fontWeight = '500';
      removeBtn.style.cursor = 'pointer';

      let img = document.createElement('img');

      img.onload = () => {
        URL.revokeObjectURL(img.src);
      }
      img.src = URL.createObjectURL(file);
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      img.style.marginRight = '0.3rem';

      container.appendChild(img);
      container.appendChild(removeBtn);

      wrapper?.appendChild(container);
      this.showCreatePost();
    }
  }

  initCreatePostEvent() {
    const input = this.elementRef.nativeElement.querySelector('.create-post input') as HTMLInputElement;
    const modal = this.elementRef.nativeElement.querySelector('.posting') as HTMLElement;

    input.addEventListener('click', () => this.showCreatePost());

    modal.addEventListener('click', (event) => {
      if ((event.target as HTMLElement).classList.contains('posting')) {
        modal.style.display = 'none';
      }
    });
  }

  showCreatePost(): void {
    const modal = this.elementRef.nativeElement.querySelector('.posting') as HTMLElement;
    const textarea = this.elementRef.nativeElement.querySelector('.posting .textarea') as HTMLTextAreaElement;
    const addons = this.elementRef.nativeElement.querySelector('.add-ons') as HTMLElement;

    addons.style.display = this.mediaContents.length < 3 ? 'flex' : 'none';
    modal.style.display = 'grid';
    textarea.focus();
  }

  navigateToWall() {
    this.router.navigateByUrl('/home/wall');
  }


}
