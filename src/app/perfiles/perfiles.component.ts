import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilesService, Profile } from '../services/profiles.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-perfiles',
  imports: [CommonModule, RouterModule],
  templateUrl: './perfiles.component.html',
  styleUrl: './perfiles.component.css'
})
export class PerfilesComponent implements OnInit {
  private profilesService = inject(ProfilesService);

  profiles: Profile[] = []; // Array to store the profiles
  errorMessage: string | null = null; // To handle errors
  activePopoverId: string | null = null; // To track which popover is open

  constructor() { }

  ngOnInit(): void {
    // Call the service to get the profiles when the component initializes
    this.getProfiles();
  }

  getProfiles(): void {
    //Esto le dice al componente que "se suscriba" al resultado que el ProfilesService va a devolver.
    this.profilesService.getProfiles().subscribe({
      next: (data) => {
        this.profiles = data;
        console.log('Perfiles cargados:', this.profiles);
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar los perfiles. Por favor, inténtelo de nuevo más tarde. ' + error.message;
        console.error('There was an error!', error);
      }
    });
  }

  exportExcel(): void {
    this.profilesService.exportExcel().subscribe({
      next: (data) => {
        // Handle the Excel file download
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'perfiles.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error al descargar el archivo Excel:', error);
      }
    });
  }

  exportPDF(): void {
    this.profilesService.exportPDF().subscribe({
      next: (data) => {
        // Handle the PDF file download
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'perfiles.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error al descargar el archivo PDF:', error);
      }
    });
  }

  deleteProfile(profileId: string): void {
    this.profilesService.deleteProfile(profileId).subscribe({
      next: () => {
        console.log('Perfil eliminado con éxito');
        this.getProfiles(); // Refresh the profile list
      },
      error: (error) => {
        console.error('Error al eliminar el perfil:', error);
      }
    });
  }

  /**
   * Toggles the visibility of a popover menu.
   * If the clicked popover is already open, it closes it.
   * Otherwise, it closes any other open popover and opens the clicked one.
   * @param profileId The ID of the profile for which to toggle the popover.
   */
  togglePopover(profileId: string): void {
    if (this.activePopoverId === profileId) {
      this.activePopoverId = null; // Close the popover if it's already open
    } else {
      this.activePopoverId = profileId; // Open the clicked popover
    }
  }

  /**
   * Checks if a specific popover should be visible.
   * @param productId The ID of the product to check.
   * @returns A boolean indicating if the popover is visible.
   */
  isPopoverVisible(productId: string): boolean {
    return this.activePopoverId === productId;
  }
  
}
