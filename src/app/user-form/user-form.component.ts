import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService, User } from '../services/users.service';
import {ProfilesService, Profile } from '../services/profiles.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent implements OnInit {
  console = console;
  // Inyección de servicios y dependencias
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private usersService = inject(UsersService);
  private profilesService = inject(ProfilesService);

  // Señales para los campos del formulario
  nombre = signal<string>('');
  email = signal<string>('');
  created_at = signal<Date | null>(null);
  updated_at = signal<Date | null>(null);
  password = signal<string>('');
  profileId = signal<string | null>(null);
  profiles = signal<Profile[]>([]);

  // Señal para el ID del producto (null si es nuevo)
  userId = signal<string | null>(null);
  isEditing = signal<boolean>(false);

  // Edicion de producto
  ngOnInit(): void {
    // Cargar los perfiles disponibles desde la API
    this.profilesService.getProfiles().subscribe({
      next: (data: Profile[]) => {
        console.log('=== PERFILES DISPONIBLES ===');
        data.forEach((profile, index) => {
          console.log(`Perfil ${index}:`, {
            _id: profile._id,
            name: profile.name,
            hasUndefinedId: profile._id === 'undefined',
            isIdValid: profile._id && profile._id !== 'undefined'
          });
        });

        this.profiles.set(data);
      },
      error: (error) => {
        console.error('Error al cargar los perfiles:', error);
      }
    });

    // Suscribirse a los parámetros de la ruta para detectar el modo de edición
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        // Modo edición
        this.userId.set(id);
        this.isEditing.set(true);
        this.loadUser(this.userId());
      }
    });
  }

  debugAndSetProfileId(event: any): void {
    console.log('=== DEBUG SELECT ===');
    console.log('Event received:', event);
    console.log('Event type:', typeof event);
    console.log('Current profileId signal before:', this.profileId());
    
    // También debug del elemento DOM
    const selectElement = document.querySelector('[name="profileId"]') as HTMLSelectElement;
    if (selectElement) {
      console.log('DOM Select value:', selectElement.value);
      console.log('DOM Select selectedIndex:', selectElement.selectedIndex);
    }
    
    this.profileId.set(event);
    console.log('Current profileId signal after:', this.profileId());
  }

  // Método para cargar los datos del usuario en modo de edición
  loadUser(id: string | null): void {
    if (id !== null) {
      // Petición get
      this.usersService.getUserById(id).subscribe({
        next: (user) => {
          // debugger;
          this.nombre.set(user.name);
          this.email.set(user.email);
          this.created_at.set(new Date(user.created_at)); // Conversión de string a Date
          this.updated_at.set(new Date(user.updated_at)); // Conversión de string a Date

          // Asigna el profileId si está disponible en el objeto de usuario
          if (user.profileId) {
            this.profileId.set(user.profileId);
          }
        },
        error: (error) => {
          console.error('Error al cargar el usuario:', error);
          this.router.navigate(['/users']);
        }
      });
    }
  }

  // Método para manejar el envío del formulario (agregar o editar)
  onSubmit(): void {
    const userPayload = {
      name: this.nombre(),
      email: this.email(),
      password: this.password(),
      profileId: this.profileId(), // Usa la señal, si es nula, usa el valor por defecto
    };
    // debugger;
    if (this.isEditing()) {
      // Lógica para actualizar el producto existente
      // Se crea un objeto solo con los campos necesarios para la actualización
      const userToUpdate = { ...userPayload, id: this.userId() || '' };

      // Lógica para editar un usuario, va a users.service.ts
      this.usersService.updateUser(userToUpdate as User).subscribe({
        next: () => {
          console.log('Usuario actualizado con éxito');
          this.router.navigate(['/users']);
        },
        error: (error) => {
          console.error('Error al actualizar el usuario:', error);
        }
      });
    } else {
      // Lógica para agregar un nuevo usuario
      // Se crea un objeto solo con los campos necesarios para la creación
      const newUser = { ...userPayload, id: '' };
      // Lógica para agregar un nuevo usuario, va a users.service.ts
      this.usersService.addUser(newUser as User).subscribe({
        next: () => {
          console.log('Usuario agregado con éxito');
          this.router.navigate(['/users']);
        },
        error: (error) => {
          console.error('Error al agregar el usuario:', error);
        }
      });
    }
  }
}
