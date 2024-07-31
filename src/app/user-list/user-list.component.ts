import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserEditComponent } from '../user-edit/user-edit.component';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
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
    { id: 1, name: 'User One', email: 'userone@example.com', role: 'Admin', creationAt: '2024-01-01', updateAt: '2024-07-30' },
    { id: 2, name: 'User Two', email: 'usertwo@example.com', role: 'User', creationAt: '2024-01-01', updateAt: '2024-07-30' }
  ];
  displayedColumns: string[] = ['id', 'name', 'email', 'role', 'creationAt', 'updateAt', 'actions'];

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
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      this.deleteUser(userId);
    }
  }

  deleteUser(userId: number): void {
    this.users = this.users.filter(u => u.id !== userId);
  }
}
