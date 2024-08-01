import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent {
  editProductForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditProductComponent>,
    @Inject(MAT_DIALOG_DATA) public product: any,
    private fb: FormBuilder
  ) {
    this.editProductForm = this.fb.group({
      id: [product.id, Validators.required],
      nombre: [product.nombre, Validators.required],
      descripcion: [product.descripcion, Validators.required],
      proveedor: [product.proveedor, Validators.required],
      precio: [product.precio, [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')]],
      categoria: [product.categoria, Validators.required],
      imagen: [product.imagen, Validators.required]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.editProductForm.valid) {
      console.log('Formulario de edición válido, enviando datos:', this.editProductForm.value);
      this.dialogRef.close(this.editProductForm.value);
    }else {
      console.error('Formulario de edición inválido'); // Agregar consola de depuración
    }
  }
}
