import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProfilesService, Profile, NewProfile  } from '../services/profiles.service';

@Component({
  selector: 'app-perfil-view',
  imports: [CommonModule],
  templateUrl: './perfil-view.component.html',
  styleUrl: './perfil-view.component.css'
})
export class PerfilViewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private profilesService = inject(ProfilesService);

  // Señal para almacenar el perfil
  profile = signal<Profile | null>(null);

  ngOnInit(): void {
    // Obtener el ID del perfil de la URL
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.profilesService.getProfileById(id).subscribe({
        next: (profile) => {
          this.profile.set(profile);
        },
        error: (error) => {
          console.error('Error al cargar el perfil:', error);
          // Redirigir si el perfil no se encuentra
          this.router.navigate(['/profiles']);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/profiles']);
  }
}
