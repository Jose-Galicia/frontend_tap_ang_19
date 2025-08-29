import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

//Interface para los productos, estructura de datos que espero recibir del back
export interface Product {
  id: string;
  codigo: string;
  nombre: string;
  marca: string;
  precio: number;
  created_at: string;
  updated_at: string;
  fecha_creacion: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private http = inject(HttpClient);
  private productsUrl = 'http://127.0.0.1:8000/api/productos'; 

  constructor() { }

  /**
   * Fetches the list of products from the backend API.
   * @returns An Observable with the list of products.
   */
  getProducts(): Observable<Product[]> {
    // Get the authentication token from local storage
    const authToken = localStorage.getItem('auth_token');

    // Create the headers with the authorization token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    // Make the HTTP request with the headers
    return this.http.get<Product[]>(this.productsUrl, { headers: headers });
  }

  getProductById(id: string): Observable<Product> {
    const authToken = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    return this.http.get<Product>(`${this.productsUrl}/${id}`, { headers: headers });
  }

  exportExcel(): Observable<Blob> {
    const authToken = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    return this.http.get(`${this.productsUrl}/excel`, { headers: headers, responseType: 'blob' });
  }

  exportPDF(): Observable<Blob> {
    const authToken = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    return this.http.get(`${this.productsUrl}/pdf`, { headers: headers, responseType: 'blob' });
  }

  addProduct(product: Product): Observable<Product> {
    const authToken = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    return this.http.post<Product>(this.productsUrl, product, { headers: headers });
  }

  updateProduct(product: Product): Observable<Product> {
    const authToken = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    return this.http.put<Product>(`${this.productsUrl}/${product.id}`, product, { headers: headers });
  }

  deleteProduct(id: string): Observable<void> {
    const authToken = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    return this.http.delete<void>(`${this.productsUrl}/${id}`, { headers: headers });
  }
}
