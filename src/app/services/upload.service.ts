import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppComponent } from '../app.component';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private apiUrl: string = AppComponent.baseUrl + '/upload';

  constructor(private http: HttpClient) { }

  uploadPostImage(file: File): Observable<string> {
    let postApi = `${this.apiUrl}/post`

    const formData: FormData = new FormData();
    formData.append('multipartFile', file, file.name);
    return this.http.post<string>(postApi, formData, { responseType: 'text' as 'json' });
  }

  uploadAvatar(file: File, imageName: string): Observable<string> {
    let postApi = `${this.apiUrl}/user`

    const formData: FormData = new FormData();
    formData.append('multipartFile', file, file.name);
    formData.append('imageName', imageName);

    return this.http.post<string>(postApi, formData, { responseType: 'text' as 'json' });
  }

  fetchImage(publicId: string): Observable<string> {
    let fetchApi = `${this.apiUrl}/image?publicId=${publicId}`;
    return this.http.get<string>(fetchApi, { responseType: 'text' as 'json' });
  }
}
