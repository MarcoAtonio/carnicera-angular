import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent {
  editUserForm: FormGroup;
  hide = true;

  constructor(
    public dialogRef: MatDialogRef<UserEditComponent>,
    @Inject(MAT_DIALOG_DATA) public user: any,
    private fb: FormBuilder
  ) {
    this.editUserForm = this.fb.group({
      id: [user.id],
      imagen: [user.imagen, Validators.required],
      correo: [user.correo, [Validators.required, Validators.email]],
      contra: [user.contra, [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      nombre: [user.nombre, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      rol: [user.rol, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.editUserForm.valid) {
      console.log('Formulario de edición válido, enviando datos:', this.editUserForm.value); // Agregar consola de depuración
      this.dialogRef.close(this.editUserForm.value);
    } else {
      console.error('Formulario de edición inválido'); // Agregar consola de depuración
    }
  }
}
