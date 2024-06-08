import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppComponent } from '../app.component';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl: string = 'http://localhost:8090/api/search/users';

  constructor(private http: HttpClient) { }

  search(userId: string, keyword: string): Observable<User[]> {
    return this.http.post<User[]>(this.apiUrl, { userId: userId, keyword: keyword }, AppComponent.httpOptions);
  }
}
