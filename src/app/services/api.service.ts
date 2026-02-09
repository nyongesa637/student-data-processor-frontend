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

  getStudents(page: number, size: number, search?: string, studentClass?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    if (search) params = params.set('search', search);
    if (studentClass) params = params.set('studentClass', studentClass);
    return this.http.get(`${this.baseUrl}/students`, { params });
  }

  getClasses(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/students/classes`);
  }

  getAnalyticsSummary(): Observable<any> {
    return this.http.get(`${this.baseUrl}/analytics/summary`);
  }

  getNotifications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/notifications`);
  }

  getUnreadNotificationCount(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/notifications/unread-count`);
  }

  markNotificationRead(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/notifications/${id}/read`, null);
  }

  markAllNotificationsRead(): Observable<any> {
    return this.http.put(`${this.baseUrl}/notifications/read-all`, null);
  }

  submitFeatureRequest(data: { title: string; description: string; email: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/feature-requests`, data);
  }

  getChangelog(component?: string): Observable<any[]> {
    let params = new HttpParams();
    if (component) params = params.set('component', component);
    return this.http.get<any[]>(`${this.baseUrl}/changelog`, { params });
  }

  exportExcel(search?: string, studentClass?: string): Observable<Blob> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    if (studentClass) params = params.set('studentClass', studentClass);
    return this.http.get(`${this.baseUrl}/students/export/excel`, { params, responseType: 'blob' });
  }

  exportCsv(search?: string, studentClass?: string): Observable<Blob> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    if (studentClass) params = params.set('studentClass', studentClass);
    return this.http.get(`${this.baseUrl}/students/export/csv`, { params, responseType: 'blob' });
  }

  exportPdf(search?: string, studentClass?: string): Observable<Blob> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    if (studentClass) params = params.set('studentClass', studentClass);
    return this.http.get(`${this.baseUrl}/students/export/pdf`, { params, responseType: 'blob' });
  }
}
