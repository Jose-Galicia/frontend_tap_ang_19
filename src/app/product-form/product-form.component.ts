import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService, Product } from '../services/products.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit {
  // Inyección de servicios y dependencias
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productsService = inject(ProductsService);

  // Señales para los campos del formulario
  nombre = signal<string>('');
  marca = signal<string>('');
  precio = signal<number | null>(null);

  // Señal para el ID del producto (null si es nuevo)
  productId = signal<string | null>(null);
  isEditing = signal<boolean>(false);

  // Edicion de producto
  ngOnInit(): void {
    // Suscribirse a los parámetros de la ruta para detectar el modo de edición
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        // Modo edición
        this.productId.set(id);
        this.isEditing.set(true);
        this.loadProduct(this.productId());
      }
    });
  }

  // Método para cargar los datos del producto en modo de edición
  loadProduct(id: string | null): void {
    if (id !== null) {
      // Petición get
      this.productsService.getProductById(id).subscribe({
        next: (product) => {
          this.nombre.set(product.nombre);
          this.marca.set(product.marca);
          this.precio.set(product.precio);
        },
        error: (error) => {
          console.error('Error al cargar el producto:', error);
          this.router.navigate(['/products']);
        }
      });
    }
  }

  // Método para manejar el envío del formulario (agregar o editar)
  onSubmit(form: NgForm): void {
    if (!form.valid) {
      console.error('Formulario no válido');
      return;
    }

    if (this.isEditing()) {
      // Lógica para actualizar el producto existente
      // Se crea un objeto solo con los campos necesarios para la actualización
      const productToUpdate = {
        id: this.productId() || '',
        nombre: this.nombre(),
        marca: this.marca(),
        precio: this.precio() as number,
      };
      // Lógica para editar un producto, va a products.service.ts
      this.productsService.updateProduct(productToUpdate as Product).subscribe({
        next: () => {
          console.log('Producto actualizado con éxito');
          this.router.navigate(['/products']);
        },
        error: (error) => {
          console.error('Error al actualizar el producto:', error);
        }
      });
    } else {
      // Lógica para agregar un nuevo producto
      // Se crea un objeto solo con los campos necesarios para la creación
      const newProduct = {
        nombre: this.nombre(),
        marca: this.marca(),
        precio: this.precio() as number,
      };
      // Lógica para agregar un nuevo producto, va a products.service.ts
      this.productsService.addProduct(newProduct as Product).subscribe({
        next: () => {
          console.log('Producto agregado con éxito');
          this.router.navigate(['/products']);
        },
        error: (error) => {
          console.error('Error al agregar el producto:', error);
        }
      });
    }
  }
}
