import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AppComponent } from '../app.component';
import { Content } from '../models/content.model';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private apiUrl: string = AppComponent.baseUrl + '/content';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Content[]> {
    return this.http.get<Content[]>(this.apiUrl);
  }

  getById(id: string): Observable<Content> {
    let getUrl = `${this.apiUrl}/${id}`;
    return this.http.get(getUrl).pipe(map(data => Object.assign(new Content(), data)));
  }

  add(content: Content): Observable<string> {
    return this.http.post<string>(this.apiUrl, content, AppComponent.httpOptions);
  }

  update(content: Content): Observable<string> {
    let putUrl = `${this.apiUrl}/${content.id}`;
    return this.http.put<string>(putUrl, content, AppComponent.httpOptions);
  }

  delete(id: string): Observable<string> {
    let deleteUrl = `${this.apiUrl}/${id}`;
    return this.http.delete<string>(deleteUrl, AppComponent.httpOptions);
  }
}
