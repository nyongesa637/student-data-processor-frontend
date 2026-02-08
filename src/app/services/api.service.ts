import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:9090/api';

  constructor(private http: HttpClient) {}

  generateData(count: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/generate`, null, {
      params: new HttpParams().set('count', count.toString())
    });
  }

  processFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/process`, formData);
  }

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/upload`, formData);
  }

  getStudents(page: number, size: number, studentId?: string, studentClass?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    if (studentId) params = params.set('studentId', studentId);
    if (studentClass) params = params.set('studentClass', studentClass);
    return this.http.get(`${this.baseUrl}/students`, { params });
  }

  exportExcel(studentId?: string, studentClass?: string): Observable<Blob> {
    let params = new HttpParams();
    if (studentId) params = params.set('studentId', studentId);
    if (studentClass) params = params.set('studentClass', studentClass);
    return this.http.get(`${this.baseUrl}/students/export/excel`, { params, responseType: 'blob' });
  }

  exportCsv(studentId?: string, studentClass?: string): Observable<Blob> {
    let params = new HttpParams();
    if (studentId) params = params.set('studentId', studentId);
    if (studentClass) params = params.set('studentClass', studentClass);
    return this.http.get(`${this.baseUrl}/students/export/csv`, { params, responseType: 'blob' });
  }

  exportPdf(studentId?: string, studentClass?: string): Observable<Blob> {
    let params = new HttpParams();
    if (studentId) params = params.set('studentId', studentId);
    if (studentClass) params = params.set('studentClass', studentClass);
    return this.http.get(`${this.baseUrl}/students/export/pdf`, { params, responseType: 'blob' });
  }
}
