import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppComponent } from '../app.component';
import { React } from '../models/react.model';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment.model';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class NewsfeedService {
  private apiUrl: string = AppComponent.baseUrl + '/feed';

  constructor(private http: HttpClient) { }

  getUserFeeds(userId: string, myPostOnly: boolean): Observable<Post[]> {
    let apiPost = `${this.apiUrl}/user-feeds`;

    return this.http.post<Post[]>(
      apiPost,
      { userId: userId, isPostedByUserOnly: myPostOnly },
      AppComponent.httpOptions);
  }

  getPostReacts(postId: string): Observable<React[]> {
    let apiGet = `${this.apiUrl}/post/${postId}/react`;
    return this.http.get<React[]>(apiGet);
  }

  getPostComments(postId: string): Observable<Comment[]> {
    let apiGet = `${this.apiUrl}/post/${postId}/comment`;
    return this.http.get<Comment[]>(apiGet);
  }

}
