import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppComponent } from '../app.component';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class AdditionalService {
  private apiUrl: string = AppComponent.baseUrl + '/additional';

  constructor(private http: HttpClient) { }

  getTotalComments(postId: string): Observable<number> {
    let apiGet = `${this.apiUrl}/post/${postId}`;
    return this.http.get<number>(apiGet);
  }

  getSharePost(postId: string): Observable<Post> {
    let apiGet = `${this.apiUrl}/sharepost/${postId}`;
    return this.http.get<Post>(apiGet);
  }
}
