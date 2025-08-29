import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

//Interface para los productos, estructura de datos que espero recibir del back
export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  password?: string;
  profileId?: string;
  profile: Profile;
}

export interface Profile {
  created_at: string;
  id: string;
  name: string;
  permissions: string[];
  updated_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private http = inject(HttpClient);
  private usersUrl = 'http://127.0.0.1:8000/api/users'; 

  constructor() { }

  /**
   * Fetches the list of products from the backend API.
   * @returns An Observable with the list of products.
   */
  getUsers(): Observable<User[]> {
    // Get the authentication token from local storage
    const authToken = localStorage.getItem('auth_token');

    // Create the headers with the authorization token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    // Make the HTTP request with the headers
    return this.http.get<User[]>(this.usersUrl, { headers: headers });
  }

  getUserById(id: string): Observable<User> {
    const authToken = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    return this.http.get<User>(`${this.usersUrl}/${id}`, { headers: headers });
  }

  exportExcel(): Observable<Blob> {
    const authToken = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    return this.http.get(`${this.usersUrl}/excel`, { headers: headers, responseType: 'blob' });
  }

  exportPDF(): Observable<Blob> {
    const authToken = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    return this.http.get(`${this.usersUrl}/pdf`, { headers: headers, responseType: 'blob' });
  }

  addUser(user: User): Observable<User> {
    const authToken = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    return this.http.post<User>(this.usersUrl, user, { headers: headers });
  }

  updateUser(user: User): Observable<User> {
    const authToken = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    debugger;
    return this.http.put<User>(`${this.usersUrl}/${user.id}`, user, { headers: headers });
  }

  deleteUser(id: string): Observable<void> {
    const authToken = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    if (id == localStorage.getItem('userId')){
      return new Observable<void>(subscriber => {
        subscriber.error('No se puede eliminar el usuario actual');
      });
    }
    return this.http.delete<void>(`${this.usersUrl}/${id}`, { headers: headers });
  }
}
