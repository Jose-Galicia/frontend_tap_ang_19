// src/app/perfil-form/perfil-form.component.ts

import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfilesService, Profile, NewProfile  } from '../services/profiles.service';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-perfil-form',
  standalone: true, // Agregado para componentes que importan sus dependencias
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil-form.component.html',
  styleUrl: './perfil-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerfilFormComponent implements OnInit {
  // Inyección de servicios y dependencias
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private profilesService = inject(ProfilesService);

  // Señales para los campos del formulario de PERFILES
  profileId = signal<string | null>(null);
  name = signal<string>('');
  permissions = signal<string[]>([]);

  isEditing = signal<boolean>(false);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.profileId.set(id);
        this.isEditing.set(true);
        this.loadProfile(this.profileId());
      }
    });
  }

  loadProfile(id: string | null): void {
    if (id !== null) {
      this.profilesService.getProfileById(id).subscribe({
        next: (profile) => {
          // Asigna los valores a las señales
          this.name.set(profile.name);
          this.permissions.set(profile.permissions);
        },
        error: (error) => {
          console.error('Error al cargar el perfil:', error);
          this.router.navigate(['/profiles']);
        }
      });
    }
  }

  onSubmit(form: NgForm): void {
    if (!form.valid) {
      console.error('Formulario no válido');
      return;
    }

    if (this.isEditing()) {
      //permission necesita ir dentro de un array
      let rawPermissions = this.permissions();
      let arrayPermissions: string[] = Array.isArray(rawPermissions)
        ? rawPermissions
        : [rawPermissions];
      const profileToUpdate: Partial<Profile> = {
        name: this.name(),
        permissions: arrayPermissions,
      };
      
      this.profilesService.updateProfile(this.profileId()!, profileToUpdate).subscribe({
        next: () => {
          console.log('Perfil actualizado con éxito');
          this.router.navigate(['/profiles']);
        },
        error: (error) => {
          console.error('Error al actualizar el perfil:', error);
        }
      });
    } else {
      //permission necesita ir dentro de un array
      let rawPermissions = this.permissions();
      let arrayPermissions: string[] = Array.isArray(rawPermissions)
        ? rawPermissions
        : [rawPermissions];

      const newProfile: NewProfile = {
        name: this.name(),
        permissions: arrayPermissions,
      };
      // debugger;
      this.profilesService.addProfile(newProfile).subscribe({
        next: () => {
          console.log('Perfil agregado con éxito');
          this.router.navigate(['/profiles']);
        },
        error: (error) => {
          console.error('Error al agregar el perfil:', error);
        }
      });
    }
  }
}