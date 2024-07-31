import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserEditComponent } from '../user-edit/user-edit.component';
import Swal from 'sweetalert2';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string; 
  creationAt: string;
  updateAt: string;
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [
    { id: 1, name: 'User One', email: 'userone@example.com', role: 'Admin', avatar: 'https://cdn.icon-icons.com/icons2/1736/PNG/512/4043260-avatar-male-man-portrait_113269.png', creationAt: '2024-01-01', updateAt: '2024-07-30' },
    { id: 2, name: 'User Two', email: 'usertwo@example.com', role: 'User', avatar: 'https://cdn.icon-icons.com/icons2/1736/PNG/512/4043260-avatar-male-man-portrait_113269.png', creationAt: '2024-01-01', updateAt: '2024-07-30' }
  ];
  displayedColumns: string[] = ['id', 'name', 'email', 'role', 'avatar', 'creationAt', 'updateAt', 'actions'];

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  editUser(user: User): void {
    const dialogRef = this.dialog.open(UserEditComponent, {
      width: '400px',
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
          this.users[index] = result;
        }
      }
    });
  }

  confirmDelete(userId: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Una vez eliminado, no podrás recuperar este usuario.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteUser(userId);
        Swal.fire('¡Eliminado!', 'El usuario ha sido eliminado.', 'success');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelado', 'El usuario está a salvo :)', 'error');
      }
    });
  }

  deleteUser(userId: number): void {
    this.users = this.users.filter(u => u.id !== userId);
  }
}
