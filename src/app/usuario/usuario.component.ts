import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent {
  user: any;
  menuVisible = true;

  constructor(private router: Router, public dialog: MatDialog) {}

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }

  openProfileModal() {
    const dialogRef = this.dialog.open(ProfileModalDialog, {
      width: '400px',
      data: this.user
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal de perfil fue cerrado');
    });
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    this.getUserInfo();
  }

  getUserInfo(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    } else {
      alert('No has iniciado sesion');
      this.router.navigate(['/login']);
    }
  }
}

@Component({
  selector: 'profile-modal-dialog',
  template: `
    <h1 mat-dialog-title>Información del Usuario</h1>
    <div mat-dialog-content>
      <div class="profile-modal-content">
        <img [src]="user.imagen" alt="Avatar" class="profile-avatar">
        <p><strong>ID:</strong> {{user.id}}</p>
        <p><strong>Correo:</strong> {{user.correo}}</p>
        <p><strong>Nombre:</strong> {{user.nombre}}</p>
        <p><strong>Rol:</strong> {{user.rol}}</p>
        <p><strong>Creado el:</strong> {{user.created_at}}</p>
        <p><strong>Editado el:</strong> {{user.updated_at}}</p>
      </div>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onNoClick()">Cerrar</button>
    </div>
  `,
  styles: [`
    .profile-modal-content {
      text-align: center;
    }
    .profile-avatar {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      margin-bottom: 20px;
    }
  `]
})
export class ProfileModalDialog {
  constructor(
    public dialogRef: MatDialogRef<ProfileModalDialog>,
    @Inject(MAT_DIALOG_DATA) public user: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
