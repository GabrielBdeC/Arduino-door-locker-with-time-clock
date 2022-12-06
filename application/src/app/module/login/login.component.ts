import { AuthService } from '../../core/service/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Login } from '../../core/model/login.model';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public hide = true;

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      login: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  get userLogin(): any {
    return this.loginForm.get('login');
  }

  get userPass(): any {
    return this.loginForm.get('password');
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  onSubmit() {
    if (this.loginForm.valid) {
      const userLogin = this.loginForm.get('login')?.value;
      const userPass = this.loginForm.get('password')?.value;

      if (userLogin && userPass) {
        const login: Login = {
          login: userLogin,
          password: userPass,
        };

        this.authService.login(login).subscribe(
          (el) => {
            console.log(el);
            this.router.navigate(['/door_locker_user']);
          },
          (error) => {
            if ((error.status == 400)) {
              this.snackBar.open('Senha incorreta!', '', {
                duration: 2000,
                panelClass: ['error-snackbar'],
              });
            } else if ((error.status == 404)) {
              this.snackBar.open('Usuário não encontrado!', '', {
                duration: 2000,
                panelClass: ['error-snackbar'],
              });
            } else {
              this.snackBar.open(
                'Erro desconhecido, favor contatar o administrador.',
                '',
                {
                  duration: 2000,
                  panelClass: ['error-snackbar'],
                }
              );
            }
          }
        );
      }
    }
  }
}
