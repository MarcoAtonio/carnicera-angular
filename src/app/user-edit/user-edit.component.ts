import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent {
  editUserForm: FormGroup;
  hide = true;

  constructor(
    public dialogRef: MatDialogRef<UserEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.editUserForm = this.fb.group({
      avatar: [data.avatar],
      email: [data.email, [Validators.required, Validators.email]],
      password: [data.password, [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      name: [data.name, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      role: [data.role, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.editUserForm.valid) {
      this.dialogRef.close(this.editUserForm.value);
    }
  }
}
