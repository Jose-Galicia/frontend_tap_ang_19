import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HasPermissionDirective } from '../has-permission.directive';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, HasPermissionDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  // Propiedad para almacenar el ID y el nombre del usuario
  userInfo: {
    id: string | null;
    name: string | null;
  } = {
    id: null,
    name: null
  };

  constructor() {
    //Manda a llamar al servicio de autenticación para obtener la información del usuario, esto ocurre cuando el usuario inicio sesion
    this.userInfo = this.authService.getUserInfo();
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // onLogout(): void {
  //   // Clear the session and navigate back to the login page
  //   sessionStorage.removeItem('isLoggedIn');
  //   this.router.navigate(['/login']);
  // }
}
