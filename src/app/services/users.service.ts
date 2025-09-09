import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

export interface ApiResponse<T> {
  message: string;
  user: T;
}

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
  profile_image?: string; // Campo para la imagen de perfil
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

  addUser(user: User): Observable<ApiResponse<User>> {
    const authToken = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    return this.http.post<ApiResponse<User>>(this.usersUrl, user, { headers: headers });
  }

  updateUser(user: User): Observable<ApiResponse<User>> {
    const authToken = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    // debugger;
    return this.http.put<ApiResponse<User>>(`${this.usersUrl}/${user.id}`, user, { headers: headers });
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

  // === MÉTODOS PARA MANEJO DE IMÁGENES ===

  /**
   * Sube una imagen de perfil para un usuario
   */
  uploadProfileImage(userId: string, image: File): Observable<any> {
    const authToken = localStorage.getItem('auth_token');
    debugger;
    const formData = new FormData();
    formData.append('image', image);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
      // NO agregar 'Content-Type': 'multipart/form-data' - Angular lo hace automáticamente
    });

    console.log('Subiendo imagen para usuario:', userId);
    console.log('Tamaño de imagen:', image.size, 'bytes');
    console.log('Tipo de imagen:', image.type);
    console.log('URL de la API:', `${this.usersUrl}/${userId}/upload-profile-image`);

    return this.http.post(`${this.usersUrl}/${userId}/upload-profile-image`, formData, { headers: headers });
  }

  /**
   * Obtiene la URL completa de una imagen de perfil
   */
  getProfileImageUrl(imagePath: string | null | undefined): string {
    if (!imagePath) {
      return '/assets/images/default-profile.png'; // Imagen por defecto
    }
    
    // Si la imagen ya es una URL completa, retornarla directamente
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Si es una ruta de storage de Laravel
    if (imagePath.startsWith('profile_images/')) {
      return `http://127.0.0.1:8000/storage/${imagePath}`;
    }
    
    // Para cualquier otra ruta relativa
    return `http://127.0.0.1:8000/${imagePath}`;
  }

  /**
   * Elimina la imagen de perfil de un usuario
   */
  deleteProfileImage(userId: string): Observable<any> {
    const authToken = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    return this.http.delete(`${this.usersUrl}/${userId}/profile-image`, { headers: headers });
  }
}
