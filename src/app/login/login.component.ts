    import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { Router } from '@angular/router';
    import { FormsModule } from '@angular/forms';
    import { AuthService } from '../services/auth.service';
    import { Subscription } from 'rxjs'; // Importamos Subscription

    @Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
    })
    export class LoginComponent implements OnInit, OnDestroy {
    // Signals for email, password, and error message
    email = signal<string>('');
    password = signal<string>('');
    errorMessage = signal<string | null>(null);

    // Inyectar el servicio de router y el de autenticación
    private router = inject(Router);
    private authService = inject(AuthService);
    private authSubscription!: Subscription; // Variable para gestionar la suscripción

    ngOnInit(): void {
        // Suscribirse al estado de la sesión.
        // Esto asegura que la navegación ocurre solo cuando el login es exitoso
        this.authSubscription = this.authService.isLoggedIn$.subscribe(isLoggedIn => {
        if (isLoggedIn) {
            this.router.navigate(['/inicio']);
        }
        });
    }

    ngOnDestroy(): void {
        // Es crucial desuscribirse para evitar fugas de memoria
        if (this.authSubscription) {
        this.authSubscription.unsubscribe();
        }
    }

    /**
     * Handles the login event when the form is submitted.
     * Calls the authentication service to log in.
     */
    onLogin(): void {
        // Call the login method of the service, which handles the HTTP request
        this.authService.login(this.email(), this.password()).subscribe({
        next: (response) => {
            this.errorMessage.set(null);
            console.log('Login successful:', response);
            // La navegación ahora se maneja en la suscripción del ngOnInit
        },
        error: (error) => {
            // On failed login, display error message
            this.errorMessage.set(error.message || 'Error de conexión');
            console.error('Login failed:', error);
        }
        });
    }
    }
