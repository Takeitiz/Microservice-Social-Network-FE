import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AppComponent } from '../app.component';
import { Friendship } from '../models/friendship.model';

@Injectable({
  providedIn: 'root'
})
export class FriendshipService {
  private apiUrl: string = AppComponent.baseUrl + '/friendship';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Friendship[]> {
    return this.http.get<Friendship[]>(this.apiUrl);
  }

  getById(id: string): Observable<Friendship> {
    let getUrl = `${this.apiUrl}/${id}`;
    return this.http.get(getUrl).pipe(map(data => Object.assign(new Friendship(), data)));
  }

  add(friendship: Friendship): Observable<string> {
    return this.http.post<string>(this.apiUrl, friendship, AppComponent.httpOptions);
  }

  update(friendship: Friendship): Observable<string> {
    let putUrl = `${this.apiUrl}/${friendship.id}`;
    return this.http.put<string>(putUrl, friendship, AppComponent.httpOptions);
  }

  delete(id: string): Observable<string> {
    let deleteUrl = `${this.apiUrl}/${id}`;
    return this.http.delete<string>(deleteUrl, AppComponent.httpOptions);
  }
}
