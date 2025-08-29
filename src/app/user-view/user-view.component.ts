import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { UsersService, User } from '../services/users.service';

@Component({
  selector: 'app-user-view',
  standalone: true,
  imports: [CommonModule, DatePipe], // <-- Se agregó DatePipe aquí
  templateUrl: './user-view.component.html',
  styleUrl: './user-view.component.css'
})
export class UserViewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private usersService = inject(UsersService);

  // Señal para almacenar el usuario
  user = signal<User | null>(null);

  ngOnInit(): void {
    // Obtener el ID del usuario de la URL
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.usersService.getUserById(id).subscribe({
        next: (user) => {
          this.user.set(user);
        },
        error: (error) => {
          console.error('Error al cargar el usuario:', error);
          // Redirigir si el usuario no se encuentra
          this.router.navigate(['/users']);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }
}
