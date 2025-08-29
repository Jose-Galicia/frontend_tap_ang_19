import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // El guardia ahora se suscribe al Observable de AuthService
  return authService.isLoggedIn$.pipe(
    map(isLoggedIn => {
      if (isLoggedIn) {
        // Si el usuario está logueado, permite el acceso a la ruta
        return true;
      } else {
        // Si no está logueado, redirige a la página de login
        console.log('Acceso denegado. Redirigiendo a la página de login...');
        router.navigate(['/login']);
        return false;
      }
    })
  );
};
