import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {
  addProductForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.addProductForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z\\s]*$')]],
      description: ['', [Validators.required, Validators.pattern('^[a-zA-Z\\s]*$')]],
      price: ['', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]],
      category: ['', [Validators.required, Validators.pattern('^[a-zA-Z\\s]*$')]],
      image: ['', [Validators.required, Validators.pattern('^(https?:\\/\\/)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)*\\/?$')]]
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
      // Logic to handle form submission
      console.log(this.addProductForm.value);
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
    }
  }
}
