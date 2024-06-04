import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AppComponent } from '../app.component';
import { React } from '../models/react.model';

@Injectable({
  providedIn: 'root'
})
export class ReactService {
  private apiUrl: string = AppComponent.baseUrl + '/react';

  constructor(private http: HttpClient) { }

  getAll(): Observable<React[]> {
    return this.http.get<React[]>(this.apiUrl);
  }

  getById(id: string): Observable<React> {
    let getUrl = `${this.apiUrl}/${id}`;
    return this.http.get(getUrl).pipe(map(data => Object.assign(new React(), data)));
  }

  add(react: React): Observable<string> {
    return this.http.post<string>(this.apiUrl, react, AppComponent.httpOptions);
  }

  update(react: React): Observable<string> {
    let putUrl = `${this.apiUrl}/${react.id}`;
    return this.http.put<string>(putUrl, react, AppComponent.httpOptions);
  }

  delete(id: string): Observable<string> {
    let deleteUrl = `${this.apiUrl}/${id}`;
    return this.http.delete<string>(deleteUrl, AppComponent.httpOptions);
  }
}
