import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent {
  addUserForm: FormGroup;
  hide = true;
  avatarPattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
  namePattern = /^[a-zA-Z]+$/;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.addUserForm = this.fb.group({
      imagen: ['', [Validators.required, Validators.pattern(this.avatarPattern)]],
      correo: ['', [Validators.required, Validators.email]],
      contra: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8}$/)
      ]],
      nombre: ['', [Validators.required, Validators.pattern(this.namePattern)]],
      rol: ['', [Validators.required, Validators.pattern(this.namePattern)]]
    });
  }

  onSubmit() {
    if (this.addUserForm.valid) {
      const formData = new FormData();
      formData.append('imagen', this.addUserForm.get('imagen')!.value);
      formData.append('correo', this.addUserForm.get('correo')!.value);
      formData.append('contra', this.addUserForm.get('contra')!.value);
      formData.append('nombre', this.addUserForm.get('nombre')!.value);
      formData.append('rol', this.addUserForm.get('rol')!.value);

      const headers = new HttpHeaders();

      this.http.post('http://127.0.0.1:8000/api/usuarios', formData, { headers }).subscribe(
        response => {
          Swal.fire({
            title: 'Usuario registrado',
            text: 'El usuario ha sido registrado exitosamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/dashboard/usuarios/listado']);
            }
          });
        },
        error => {
          console.error('Error al registrar el usuario:', error);
          Swal.fire('Error', 'Hubo un problema al registrar el usuario', 'error');
        }
      );
    } else {
      console.error('Formulario de registro inválido:', this.addUserForm.errors);
    }
  }

  restrictInput(event: KeyboardEvent, pattern: RegExp): boolean {
    if (!pattern.test(event.key)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  onNoClick(): void {
    this.router.navigate(['/dashboard/usuarios/listado']);
  }
}
