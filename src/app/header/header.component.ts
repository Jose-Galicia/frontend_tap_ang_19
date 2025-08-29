import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { HasPermissionDirective } from '../has-permission.directive';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, HasPermissionDirective],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Expone el método isLoggedIn del servicio para usarlo en el template
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  // Lógica para cerrar sesión
  // onLogout(): void {
  //   // Aquí podrías llamar a un método en el servicio para limpiar el token
  //   sessionStorage.removeItem('isLoggedIn');
  //   this.router.navigate(['/login']);
  // }
  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
