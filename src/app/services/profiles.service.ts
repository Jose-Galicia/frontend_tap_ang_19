import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaz para el objeto de perfil
export interface Profile {
  _id: string;
  name: string;
  permissions: string[];
  created_at: string;
  updated_at: string;
}

export interface NewProfile {
  name: string;
  permissions: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ProfilesService {
  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api/profiles';

  getProfiles(): Observable<Profile[]> {
    // Obtener el token de autenticación del local storage
    const authToken = localStorage.getItem('auth_token');

    // Crear las cabeceras con el token de autorización
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    // Realizar la petición HTTP con las cabeceras
    return this.http.get<Profile[]>(this.apiUrl, { headers: headers });
  }

  getProfileById(profileId: string): Observable<Profile> {
    const authToken = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    return this.http.get<Profile>(`${this.apiUrl}/${profileId}`, { headers: headers });
  }

  exportExcel(): Observable<Blob> {
    const authToken = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    return this.http.get(`${this.apiUrl}/excel`, { headers: headers, responseType: 'blob' });
  }

  exportPDF(): Observable<Blob> {
    const authToken = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    return this.http.get(`${this.apiUrl}/pdf`, { headers: headers, responseType: 'blob' });
  }

  addProfile(profile: NewProfile): Observable<Profile> {
    const authToken = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    return this.http.post<Profile>(this.apiUrl, profile, { headers: headers });
  }

  updateProfile(profileId: string, profile: Partial<Profile>): Observable<Profile> {
    const authToken = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    return this.http.put<Profile>(`${this.apiUrl}/${profileId}`, profile, { headers: headers });
  }

  deleteProfile = (profileId: string): Observable<void> => {
    const authToken = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    return this.http.delete<void>(`${this.apiUrl}/${profileId}`, { headers: headers });
  }
}