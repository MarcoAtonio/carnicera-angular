import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditProductComponent } from '../edit-product/edit-product.component';
import Swal from 'sweetalert2';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';

interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  proveedor: string;
  imagen: string;
  created_at: Date;
  updated_at: Date;
}

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'precio', 'categoria','proveedor', 'imagen', 'created_at', 'updated_at', 'acciones'];
  pagedProducts: Product[] = [];
  pageSize = 2;
  currentPage = 0;

  constructor(private dialog: MatDialog, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProductsFromApi();
  }

  loadProductsFromApi(): void {
    this.http.get<Product[]>(`http://127.0.0.1:8000/api/productos`).subscribe(
      data => {
        this.products = data;
        this.paginateProducts();
      },
      error => {
        Swal.fire('Error', 'Hubo un problema al cargar los prouctos', 'error');
      }
    );
  }

  paginateProducts(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedProducts = this.products.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.paginateProducts();
  }

  editProduct(product: Product): void {
    const dialogRef = this.dialog.open(EditProductComponent, {
      width: '400px',
      data: { ...product }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Datos del formulario de edición:', result);
      if (result) {
        result.id = product.id; // Asegurarse de que el ID del usuario está presente
        console.log('Datos a enviar al servidor:', result); 
        this.updateProduct(result);
      }
    });
  }

  updateProduct(product: Product): void {
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const body = new HttpParams()
      .set('nombre', product.nombre)
      .set('descripcion', product.descripcion)
      .set('categoria', product.categoria)
      .set('imagen', product.imagen)
      .set('proveedor', product.proveedor)
      .set('precio', product.precio); // Asegúrate de que este campo existe y tiene el valor correcto
  
    this.http.put<Product>(`http://127.0.0.1:8000/api/productos/${product.id}`, body.toString(), { headers }).subscribe(
      updatedProduct => {
        const index = this.products.findIndex(u => u.id === updatedProduct.id);
        if (index !== -1) {
          this.products[index] = updatedProduct;
          this.paginateProducts();
        }
        Swal.fire('Actualizado', 'El producto ha sido actualizado exitosamente.', 'success');
      },
      error => {
        console.error('Error al actualizar el producto:', error); // Agregar consola de depuración
        Swal.fire('Error', 'Hubo un problema al actualizar el producto', 'error');
      }
    );
  }

  confirmDelete(productId: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Una vez eliminado, no podrás recuperar este producto.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteProduct(productId);
        Swal.fire('¡Eliminado!', 'El producto ha sido eliminado.', 'success');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelado', 'El producto está a salvo :)', 'error');
      }
    });
  }

  deleteProduct(productId: number): void {
    this.http.delete(`http://127.0.0.1:8000/api/productos/${productId}`).subscribe(
      () => {
        this.products = this.products.filter(u => u.id !== productId);
        this.paginateProducts();
      },
      error => {
        Swal.fire('Error', 'Hubo un problema al eliminar el producto', 'error');
      }
    );
  }
}
