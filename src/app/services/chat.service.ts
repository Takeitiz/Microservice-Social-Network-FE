import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppComponent } from '../app.component';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl: string = AppComponent.baseUrl + '/chat/genusertoken';

  constructor(private http: HttpClient) { }

  getToken(userId: string): Observable<string> {
    let apiGet = `${this.apiUrl}/${userId}`;
    return this.http.get<string>(apiGet, { responseType: 'text' as 'json' });
  }
}
