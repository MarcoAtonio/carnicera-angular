import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hide = true;
  users: any;

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }
  ngOnInit(): void {

  }

  onSubmit() {
    if (this.loginForm.valid) {
      const email = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;

      this.http.get('http://127.0.0.1:8000/api/usuarios/')
        .subscribe((users: any) => {
          const user = users.find((u: any) => u.correo === email && u.contra === password);
          if (user) {
            Swal.fire({
              title: 'Inicio de sesión exitoso',
              text: 'Has iniciado sesión exitosamente.',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            }).then((result) => {
              if (result.isConfirmed) {
                localStorage.setItem('user', JSON.stringify(user));
                this.router.navigate(['/dashboard']);
              }
            });
          } else {
            Swal.fire({
              title: 'Credenciales incorrectas',
              text: 'El nombre de usuario o la contraseña son incorrectos.',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }
        }, error => {
          Swal.fire({
            title: 'Error',
            text: 'Hubo un error al intentar iniciar sesión. Por favor, intenta nuevamente más tarde.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        });
    }
  }
}
