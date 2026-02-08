import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  generateData(count: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/generate`, null, {
      params: new HttpParams().set('count', count.toString())
    });
  }
}
