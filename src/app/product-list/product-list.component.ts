import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditProductComponent } from '../edit-product/edit-product.component';
import Swal from 'sweetalert2';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
  creationAt: string;
  updateAt: string;
}

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [
    { id: 1, name: 'Product One', description: 'Description One', price: '10.00', category: 'Category One', image: 'https://via.placeholder.com/50', creationAt: '2024-01-01', updateAt: '2024-07-30' },
    { id: 2, name: 'Product Two', description: 'Description Two', price: '20.00', category: 'Category Two', image: 'https://via.placeholder.com/50', creationAt: '2024-01-01', updateAt: '2024-07-30' }
  ];
  displayedColumns: string[] = ['id', 'name', 'description', 'price', 'category', 'image', 'creationAt', 'updateAt', 'actions'];

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  editProduct(product: Product): void {
    const dialogRef = this.dialog.open(EditProductComponent, {
      width: '400px',
      data: product
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.products.findIndex(p => p.id === product.id);
        if (index !== -1) {
          this.products[index] = result;
        }
      }
    });
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
    this.products = this.products.filter(p => p.id !== productId);
  }
}
