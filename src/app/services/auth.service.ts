import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

// Define la interfaz para la información del perfil
interface Profile {
  id: string;
  name: string;
  permissions: string[];
}

// Define la interfaz para el usuario con su perfil
interface UserWithProfile {
  id: string;
  name: string;
  profile: Profile;
}

// Definimos la interfaz para la respuesta del backend
interface AuthResponse {
  token: string;
  message: string;
  // user?: {
  //   id: string;
  //   name: string;
  // };
  user?: UserWithProfile;
  permissions?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private userPermissions = new BehaviorSubject<string[]>([]);
  public permissions$ = this.userPermissions.asObservable();
  
  private authUrl = 'http://127.0.0.1:8000/api/login'; 

  // Nuevo: BehaviorSubject para gestionar el estado de la sesión
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor() {
    // AÑADIDO: Carga el estado del localStorage al iniciar el servicio
    this.loadStateFromLocalStorage();
  }

  private loadStateFromLocalStorage(): void {
    const token = localStorage.getItem('auth_token');
    const permissions = localStorage.getItem('userPermissions');

    if (token && permissions) {
      const parsedPermissions: string[] = JSON.parse(permissions);
      this.userPermissions.next(parsedPermissions);
      this.isLoggedInSubject.next(true);
    } else {
      this.userPermissions.next([]);
      this.isLoggedInSubject.next(false);
    }
  }

  /**
   * Checks if an authentication token exists in localStorage.
   * @returns A boolean indicating if the token exists.
   */
  private hasToken(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  /**
   * Realiza una petición de login al backend.
   * @param email El email.
   * @param password La contraseña.
   * @returns Un Observable con la respuesta de la autenticación.
   */
  login(email: string, password: string): Observable<AuthResponse> {
    const body = { email, password };

    return this.http.post<AuthResponse>(this.authUrl, body).pipe(
      tap(response => {
        console.log('Login exitoso. Respuesta del backend:', response);
        localStorage.setItem('auth_token', response.token); 

        //Guardado de los permisos en localStorage
        const permissions = response.user?.profile?.permissions || [];
        localStorage.setItem('userPermissions', JSON.stringify(permissions));
        this.userPermissions.next(permissions);
        
        if(response.user) {
          localStorage.setItem('userId', response.user.id);
          localStorage.setItem('userName', response.user.name);
        }
        // Notificamos a todos los suscriptores que el usuario ha iniciado sesión
        this.isLoggedInSubject.next(true);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error al iniciar sesión:', error);
        // En caso de error, aseguramos que el estado de la sesión es false
        this.isLoggedInSubject.next(false);
        if (error.status === 401) {
          return throwError(() => new Error('Usuario o contraseña incorrectos.'));
        } else {
          return throwError(() => new Error('Error al conectar con el servidor. Por favor, inténtelo de nuevo más tarde.'));
        }
      })
    );
  }

  hasPermission(permission: string): boolean {
    return this.userPermissions.getValue().includes(permission);
  }

  /**
   * Verifica si el usuario ha iniciado sesión.
   * @returns Verdadero si la sesión está activa, de lo contrario falso.
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  /**
   * Obtiene la información del usuario logueado.
   * @returns Un objeto con el id y el nombre del usuario.
   */
  getUserInfo() {
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    return { id: userId, name: userName };
  }

  /**
   * Clears the session.
   */
  logout(): void {
    localStorage.clear();
    this.userPermissions.next([]);
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
  }
}
