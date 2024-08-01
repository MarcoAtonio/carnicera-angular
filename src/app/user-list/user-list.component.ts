import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserEditComponent } from '../user-edit/user-edit.component';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { PageEvent } from '@angular/material/paginator';

interface User {
  id: number;
  nombre: string;
  correo: string;
  contra: string;
  rol: string;
  imagen: string; 
  created_at: Date;
  updated_at: Date;
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = ['id', 'nombre', 'correo', 'rol', 'imagen', 'created_at', 'updated_at', 'acciones'];
  pagedUsers: User[] = [];
  pageSize = 2;
  currentPage = 0;

  constructor(private dialog: MatDialog, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsersFromApi();
  }

  loadUsersFromApi(): void {
    this.http.get<User[]>(`http://127.0.0.1:8000/api/usuarios`).subscribe(
      data => {
        this.users = data;
        this.paginateUsers();
      },
      error => {
        Swal.fire('Error', 'Hubo un problema al cargar los usuarios', 'error');
      }
    );
  }

  paginateUsers(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedUsers = this.users.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.paginateUsers();
  }

  editUser(user: User): void {
    const dialogRef = this.dialog.open(UserEditComponent, {
      width: '400px',
      data: { ...user } // Pasar una copia del usuario para evitar modificar el original hasta que se confirme la edición
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Datos del formulario de edición:', result); // Agregar consola de depuración
      if (result) {
        result.id = user.id; // Asegurarse de que el ID del usuario está presente
        console.log('Datos a enviar al servidor:', result); 
        this.updateUser(result);
      }
    });
  }

  updateUser(user: User): void {
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const body = new HttpParams()
      .set('nombre', user.nombre)
      .set('correo', user.correo)
      .set('rol', user.rol)
      .set('imagen', user.imagen)
      .set('contra', user.contra); // Asegúrate de que este campo existe y tiene el valor correcto
  
    this.http.put<User>(`http://127.0.0.1:8000/api/usuarios/${user.id}`, body.toString(), { headers }).subscribe(
      updatedUser => {
        const index = this.users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
          this.paginateUsers();
        }
        Swal.fire('Actualizado', 'El usuario ha sido actualizado exitosamente.', 'success');
      },
      error => {
        console.error('Error al actualizar el usuario:', error); // Agregar consola de depuración
        Swal.fire('Error', 'Hubo un problema al actualizar el usuario', 'error');
      }
    );
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
    this.http.delete(`http://127.0.0.1:8000/api/usuarios/${userId}`).subscribe(
      () => {
        this.users = this.users.filter(u => u.id !== userId);
        this.paginateUsers();
      },
      error => {
        Swal.fire('Error', 'Hubo un problema al eliminar el usuario', 'error');
      }
    );
  }
}
