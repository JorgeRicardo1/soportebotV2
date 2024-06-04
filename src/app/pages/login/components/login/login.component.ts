import { Component } from '@angular/core';
import { MaterialModule } from '../../../../shared/material/material.module';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { GetLogin } from '../../interfaces/get-login.interface';
import { Router } from '@angular/router';
import { AuthService } from '../../../../auth/auth.service';
import { LoginService } from '../../services/login.service';
import { SnackbarService } from '../../../../core/components/snackbar/services/snackbar.service';
import { SnackbarType } from '../../../../core/components/snackbar/models/snackbar-type';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  logInForm!: FormGroup;
  private subscription = new Subscription();
  className = 'logInFormComponent';
  showPassword: boolean = false;
  visibilityIcon: string = 'visibility_off';
  tokenVerification!: GetLogin | null;

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private loginService: LoginService,
    private snackbarService: SnackbarService
  ) {

  }

  ngOnInit(): void {
    this.logInForm = this.buildForm();
  }

  buildForm(): FormGroup {
    return this.formBuilder.group({
      id: [''],
      username: ['', [Validators.required]],
      password: [''],
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    this.showPassword
      ? (this.visibilityIcon = 'visibility')
      : (this.visibilityIcon = 'visibility_off');
  }

  passwordVisibility(): string {
    return this.showPassword ? 'text' : 'password';
  }

  // onSubmit() {
  //   if (this.logInForm.invalid) {
  //     // formulario no valido
  //     return;
  //   }
  //   try {
  //     console.log("sirvo");
  //     this.router.navigate(['/chat']);
  //   } catch (error) {
  //     console.error(`${this.className} => onSubmit`, error);
  //   }
  // }

  onSubmit() {
    if (this.logInForm.invalid) {
      // formulario no valido
      return;
    }
    try {
      const loginSubscription = this.loginService
        .login(this.logInForm.value)
        .subscribe(
          (token) => {
            this.tokenVerification = token;
            if (token?.token) {
              this.authService.saveToken(token.token);
              this.router.navigate(['./chat']); // Cambiado a ruta absoluta
            }
            else{
              this.snackbarService.openCustomSnackbar(
                'Usuario o contraseña incorrecta',
                SnackbarType.error,
              );
            }
          },
          (error) => {
            console.error(`${this.className} => onSubmit`, error);
            // Manejo adicional de errores si es necesario
          },
        );
      this.subscription.add(loginSubscription); // Añadir a la matriz en lugar de sobrescribir
    } catch (error) {
      console.error(`${this.className} => onSubmit`, error);
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
