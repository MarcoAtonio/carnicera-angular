import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent {
  addUserForm: FormGroup;
  hide = true;

  constructor(private fb: FormBuilder) {
    this.addUserForm = this.fb.group({
      avatar: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      role: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]]
    });
  }

  onSubmit() {
    if (this.addUserForm.valid) {
      // Aquí puedes agregar la lógica para agregar el usuario
      console.log(this.addUserForm.value);
    }
  }
}
