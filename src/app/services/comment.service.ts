import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppComponent } from '../app.component';
import { Observable, map } from 'rxjs';
import { Comment } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl: string = AppComponent.baseUrl + '/comment';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.apiUrl);
  }

  getById(id: string): Observable<Comment> {
    let getUrl = `${this.apiUrl}/${id}`;
    return this.http.get(getUrl).pipe(map(data => Object.assign(new Comment(), data)));
  }

  add(comment: Comment): Observable<string> {
    return this.http.post<string>(this.apiUrl, comment, AppComponent.httpOptions);
  }

  update(comment: Comment): Observable<string> {
    let putUrl = `${this.apiUrl}/${comment.id}`;
    return this.http.put<string>(putUrl, comment, AppComponent.httpOptions);
  }

  delete(id: string): Observable<string> {
    let deleteUrl = `${this.apiUrl}/${id}`;
    return this.http.delete<string>(deleteUrl, AppComponent.httpOptions);
  }
}
