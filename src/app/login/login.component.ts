import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  hide = true;
  dialogRef!: MatDialogRef<any>;  // Aquí se usa el modificador !

  @ViewChild('registerUserTemplate') registerUserTemplate!: TemplateRef<any>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });

    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-Z\\s]*$')]],
      correo: ['', [Validators.required, Validators.email]],
      contra: ['', [
        Validators.required,
        Validators.maxLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8}$/)
      ]],
      rol: ['', [Validators.required, Validators.pattern('^[a-zA-Z\\s]*$')]],
      imagen: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

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

  openRegisterDialog(): void {
    this.dialogRef = this.dialog.open(this.registerUserTemplate, {
      width: '400px'
    });

    this.dialogRef.afterClosed().subscribe(result => {
      console.log('El modal de registro fue cerrado');
    });
  }

  onRegisterSubmit(): void {
    if (this.registerForm.valid) {
      this.http.post('http://127.0.0.1:8000/api/usuarios', this.registerForm.value).subscribe(
        (response) => {
          Swal.fire({
            title: 'Usuario registrado',
            text: 'El usuario ha sido registrado exitosamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
          this.dialogRef.close();
        },
        (error) => {
          Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al registrar el usuario. Por favor, intenta nuevamente.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      );
    }
  }
}
