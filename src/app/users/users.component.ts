import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService, Product } from '../services/products.service';
import { RouterModule } from '@angular/router';
import { User, UsersService } from '../services/users.service';

import { ErrorModalComponent } from '../error-modal/error-modal.component'; // Importamos el modal
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-users',
  imports: [CommonModule, RouterModule, ErrorModalComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  private usersService = inject(UsersService);

  users: User[] = []; // Array to store the users
  errorMessage = signal<string | null>(null);
  activePopoverId: string | null = null; // To track which popover is open

  constructor() { }

  //Esto se ejecuta al abrir la vista
  ngOnInit(): void {
    // Call the service to get the users when the component initializes
    this.getUsers();
  }

  getUsers(): void {
    //Esto le dice al componente que "se suscriba" al resultado que el UsersService va a devolver.
    this.usersService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        console.log('Usuarios cargados:', this.users);
      },
      error: (error) => {
        this.errorMessage.set('Error al cargar los usuarios. Por favor, inténtelo de nuevo más tarde. ' + error.message);
        console.error('There was an error!', error);
      }
    });
  }

  exportExcel(): void {
    this.usersService.exportExcel().subscribe({
      next: (data) => {
        // Handle the Excel file download
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'usuarios.xlsx';
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
    this.usersService.exportPDF().subscribe({
      next: (data) => {
        // Handle the PDF file download
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'usuarios.pdf';
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

  deleteUser(userId: string): void {
    this.usersService.deleteUser(userId).subscribe({
      next: () => {
        console.log('Usuario eliminado con éxito');
        this.getUsers(); // Refresh the user list
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al eliminar el usuario:', error);
        // Aquí es donde se establece el mensaje para mostrar el modal
        // Accedemos al mensaje del error del servicio (error.message)
        this.errorMessage.set(error.message || 'No se puede eliminar el usuario actual');
      }
    });
  }

  // Método para cerrar el modal
  onCloseModal(): void {
    this.errorMessage.set(null);
  }

  /**
   * Toggles the visibility of a popover menu.
   * If the clicked popover is already open, it closes it.
   * Otherwise, it closes any other open popover and opens the clicked one.
   * @param userId The ID of the User for which to toggle the popover.
   */
  togglePopover(userId: string): void {
    if (this.activePopoverId === userId) {
      this.activePopoverId = null; // Close the popover if it's already open
    } else {
      this.activePopoverId = userId; // Open the clicked popover
    }
  }

  /**
   * Checks if a specific popover should be visible.
   * @param userId The ID of the User to check.
   * @returns A boolean indicating if the popover is visible.
   */
  isPopoverVisible(userId: string): boolean {
    return this.activePopoverId === userId;
  }
  
}
