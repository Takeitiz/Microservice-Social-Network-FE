import { Injectable } from '@angular/core';
import { AppComponent } from '../app.component';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl: string = AppComponent.baseUrl + '/user';

  constructor(private http: HttpClient) { }

  getById(id: string): Observable<User> {
    let getUrl = `http://localhost:8090/api/user/${id}`;
    return this.http.get<User>(getUrl, AppComponent.httpOptions).pipe(map(data => Object.assign(new User(), data)));
  }

}
