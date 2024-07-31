import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent {
  menuVisible = true;

  constructor(private router: Router, public dialog: MatDialog) {}

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }

  openProfileModal() {
    const dialogRef = this.dialog.open(ProfileModalDialog, {
      width: '400px',
      data: {
        id: '12345',
        email: 'usuario@example.com',
        password: '******',
        name: 'Nombre del Usuario',
        avatar: 'assets/profile.png',
        creationAt: '2024-01-01',
        updateAt: '2024-07-30'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal de perfil fue cerrado');
    });
  }

  logout() {
    this.router.navigate(['/login']);
  }
}

@Component({
  selector: 'profile-modal-dialog',
  template: `
    <h1 mat-dialog-title>Perfil del Usuario</h1>
    <div mat-dialog-content>
      <p><strong>ID:</strong> {{data.id}}</p>
      <p><strong>Email:</strong> {{data.email}}</p>
      <p><strong>Password:</strong> {{data.password}}</p>
      <p><strong>Nombre:</strong> {{data.name}}</p>
      <p><strong>Avatar:</strong></p>
      <img [src]="data.avatar" alt="Avatar" width="100">
      <p><strong>Creado en:</strong> {{data.creationAt}}</p>
      <p><strong>Actualizado en:</strong> {{data.updateAt}}</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onNoClick()">Cerrar</button>
    </div>
  `
})
export class ProfileModalDialog {
  constructor(
    public dialogRef: MatDialogRef<ProfileModalDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
