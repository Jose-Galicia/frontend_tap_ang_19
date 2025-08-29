import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend_tap_ang_19';
  private router = inject(Router);

  // Propiedad para rastrear si la página actual es la de login
  isLoginPage = false;

  constructor() {
    // Escucha los eventos del router
    this.router.events.pipe(
      // Filtra solo los eventos de NavigationEnd para saber cuándo la navegación ha terminado
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Actualiza la propiedad 'isLoginPage' en cada cambio de URL
      this.isLoginPage = event.urlAfterRedirects === '/login';
    });
  }
}
