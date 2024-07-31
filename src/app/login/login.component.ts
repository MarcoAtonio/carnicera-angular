import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  hide = true;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      // Aquí puedes agregar la lógica de autenticación
      console.log(this.loginForm.value);

      // Simulación de autenticación
      const validUser = this.loginForm.value.username === 'usuario@example.com';
      const validPassword = this.loginForm.value.password === 'Hola123!';

      if (validUser && validPassword) {
        Swal.fire({
          title: 'Usuario Correcto',
          text: 'Has iniciado sesión exitosamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/dashboard']);
          }
        });
      } else {
        Swal.fire({
          title: 'Usuario Incorrecto',
          text: 'El nombre de usuario o la contraseña son incorrectos.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    }
  }
}
