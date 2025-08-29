import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-modal.component.html',
  styleUrl: './error-modal.component.css'
})
export class ErrorModalComponent {
  // Input: La señal que contiene el mensaje de error a mostrar.
  @Input() set errorMessage(value: string | null) {
    this.errorMessageSignal.set(value);
    // Controlamos la visibilidad del modal basado en si hay un mensaje de error.
    this.isShowing.set(!!value);
  }

  // Output: Emite un evento para notificar al componente padre que se debe cerrar el modal.
  @Output() closeModal = new EventEmitter<void>();

  // Señal interna para el mensaje de error.
  public errorMessageSignal = signal<string | null>(null);
  // Señal para controlar la visibilidad del modal.
  public isShowing = signal<boolean>(false);

  // Método que emite el evento para cerrar el modal.
  onClose(): void {
    this.closeModal.emit();
  }
}
