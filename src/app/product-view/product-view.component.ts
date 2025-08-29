import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductsService, Product } from '../services/products.service';

@Component({
  selector: 'app-product-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.css']
})
export class ProductViewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productsService = inject(ProductsService);
  
  // Señal para almacenar el producto
  product = signal<Product | null>(null);

  ngOnInit(): void {
    // Obtener el ID del producto de la URL
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productsService.getProductById(id).subscribe({
        next: (product) => {
          this.product.set(product);
        },
        error: (error) => {
          console.error('Error al cargar el producto:', error);
          // Redirigir si el producto no se encuentra
          this.router.navigate(['/products']);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
