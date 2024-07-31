import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  constructor(private fb: FormBuilder, private router: Router) {
    this.addUserForm = this.fb.group({
      avatar: ['', [Validators.required, Validators.pattern(this.avatarPattern)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8}$/)
      ]],
      name: ['', [Validators.required, Validators.pattern(this.namePattern)]],
      role: ['', [Validators.required, Validators.pattern(this.namePattern)]]
    });
  }

  onSubmit() {
    if (this.addUserForm.valid) {
      console.log(this.addUserForm.value);
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
    }
  }

  restrictInput(event: KeyboardEvent, pattern: RegExp): boolean {
    if (!pattern.test(event.key)) {
      event.preventDefault();
      return false;
    }
    return true;
  }
}
