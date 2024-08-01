import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {
  addProductForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.addProductForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-Z\\s]*$')]],
      descripcion: ['', [Validators.required, Validators.pattern('^[a-zA-Z\\s]*$')]],
      precio: ['', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]],
      categoria: ['', [Validators.required, Validators.pattern('^[a-zA-Z\\s]*$')]],
      proveedor: ['', [Validators.required, Validators.pattern('^[a-zA-Z\\s]*$')]],
      imagen: ['', [Validators.required, Validators.pattern('^(https?:\\/\\/)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)*\\/?$')]]
    });
  }

  ngOnInit(): void {}

  restrictInput(event: KeyboardEvent, pattern: string): void {
    const inputChar = String.fromCharCode(event.charCode);
    if (!new RegExp(pattern).test(inputChar)) {
      event.preventDefault();
    }
  }

  onSubmit(): void {
    if (this.addProductForm.valid) {
      const formData = new FormData();
      formData.append('nombre', this.addProductForm.get('nombre')!.value);
      formData.append('descripcion', this.addProductForm.get('descripcion')!.value);
      formData.append('precio', this.addProductForm.get('precio')!.value);
      formData.append('categoria', this.addProductForm.get('categoria')!.value);
      formData.append('proveedor', this.addProductForm.get('proveedor')!.value);
      formData.append('imagen', this.addProductForm.get('imagen')!.value);

      const headers = new HttpHeaders();

      this.http.post('http://127.0.0.1:8000/api/productos', formData, { headers }).subscribe(
        response => {
          Swal.fire({
            title: 'Producto registrado',
            text: 'El producto ha sido registrado exitosamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/dashboard/productos/listado']);
            }
          });
        },
        error => {
          console.error('Error al registrar el producto:', error);
          Swal.fire('Error', 'Hubo un problema al registrar el producto', 'error');
        }
      );
    } else {
      console.error('Formulario de registro inválido:', this.addProductForm.errors);
    }
  }
}
