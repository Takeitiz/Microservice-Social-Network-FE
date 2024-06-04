import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { AppComponent } from '../app.component';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl: string = AppComponent.baseUrl + '/post';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  getById(id: string): Observable<Post> {
    let getUrl = `${this.apiUrl}/${id}`;
    return this.http.get(getUrl).pipe(map(data => Object.assign(new Post(), data)));
  }

  add(post: Post): Observable<string> {
    return this.http.post<string>(this.apiUrl, post, AppComponent.httpOptions);
  }

  update(post: Post): Observable<string> {
    let putUrl = `${this.apiUrl}/${post.id}`;
    return this.http.put<string>(putUrl, post, AppComponent.httpOptions);
  }

  delete(id: string): Observable<string> {
    let deleteUrl = `${this.apiUrl}/${id}`;
    return this.http.delete<string>(deleteUrl);
  }
}
