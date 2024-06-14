import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppComponent } from '../app.component';
import { Friendship } from '../models/friendship.model';

@Injectable({
  providedIn: 'root'
})
export class RelationService {
  private apiUrl: string = AppComponent.baseUrl + '/relation';

  constructor(private http: HttpClient) { }

  getUserRelationship(userId: string): Observable<Friendship[]> {
    let apiGet = `${this.apiUrl}/user/${userId}`;
    return this.http.get<Friendship[]>(apiGet);
  }

  getRelationshipBetweenUsers(userId: string, friendId: string): Observable<Friendship> {
    let apiGet = `${this.apiUrl}/user/${userId}/friend/${friendId}`;
    return this.http.get<Friendship>(apiGet);
  }

  getFriendRequestByUserId(userId: string): Observable<Friendship[]> {
    let apiGet = `${this.apiUrl}/user/${userId}/friend-request`;
    return this.http.get<Friendship[]>(apiGet);
  }
}
