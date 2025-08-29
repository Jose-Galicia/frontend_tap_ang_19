import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService, Product } from '../services/products.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  private productsService = inject(ProductsService);

  products: Product[] = []; // Array to store the products
  errorMessage: string | null = null; // To handle errors
  activePopoverId: string | null = null; // To track which popover is open

  constructor() { }

  ngOnInit(): void {
    // Call the service to get the products when the component initializes
    this.getProducts();
  }

  getProducts(): void {
    //Esto le dice al componente que "se suscriba" al resultado que el ProductsService va a devolver.
    this.productsService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        console.log('Productos cargados:', this.products);
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar los productos. Por favor, inténtelo de nuevo más tarde. ' + error.message;
        console.error('There was an error!', error);
      }
    });
  }

  exportExcel(): void {
    this.productsService.exportExcel().subscribe({
      next: (data) => {
        // Handle the Excel file download
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'productos.xlsx';
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
    this.productsService.exportPDF().subscribe({
      next: (data) => {
        // Handle the PDF file download
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'productos.pdf';
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

  deleteProduct(productId: string): void {
    this.productsService.deleteProduct(productId).subscribe({
      next: () => {
        console.log('Producto eliminado con éxito');
        this.getProducts(); // Refresh the product list
      },
      error: (error) => {
        console.error('Error al eliminar el producto:', error);
      }
    });
  }

  /**
   * Toggles the visibility of a popover menu.
   * If the clicked popover is already open, it closes it.
   * Otherwise, it closes any other open popover and opens the clicked one.
   * @param productId The ID of the product for which to toggle the popover.
   */
  togglePopover(productId: string): void {
    if (this.activePopoverId === productId) {
      this.activePopoverId = null; // Close the popover if it's already open
    } else {
      this.activePopoverId = productId; // Open the clicked popover
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
