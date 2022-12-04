import { AuthService } from '../../core/service/auth.service';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Login } from '../../core/model/login.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  addressForm = this.fb.group({
    company: null,
    firstName: [null, Validators.required],
    lastName: [null, Validators.required],
    address: [null, Validators.required],
    address2: null,

  });

  mostrarLogin: boolean = true;
  hasUnitNumber = false;
  hide = true;
  email = new FormControl('', [Validators.required, Validators.email]);

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Um email válido é necessário';
    }

    return this.email.hasError('email') ? 'Não é um email válido' : '';
  }
  constructor(private fb: FormBuilder, private authService: AuthService) { }

  onSubmit() {
    const login: Login = {
      login: 'admin',
      password: 'Admin67!'
}
    this.authService.login(login).subscribe(el => {console.log(el)})

  }
}
