import { ChangeDetectorRef, Component } from '@angular/core';
import { MaterialModule } from '../../../../../shared/material/material.module';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../../../../auth/auth.service';
import { Subscription } from 'rxjs';
import { LoginService } from '../../../../../pages/login/services/login.service';
import { UserInformation } from '../../../../../shared/interfaces/user-information.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'utp-account',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
})
export class AccountComponent {
  userName: string = 'usuario';
  userRole: string = 'Role';
  userDependencia: string = 'Dependencia';

  defaultImage = 'https://media2.utp.edu.co/imagenes/Logo-UTP-Azul.png';
  image: any = this.defaultImage;

  private subscription = new Subscription();

  constructor(
    private router: Router,
    protected themeService: ThemeService,
    private loginService: LoginService,
    private authService: AuthService
  ) {
    const storedImage = sessionStorage.getItem('userImage');
    if (storedImage) {
      this.image = storedImage;
    }

    const userInfo = localStorage.getItem('InfoUsuario');
    const parsedUserInfo = userInfo ? JSON.parse(userInfo) : null;

    console.log('información usuario', localStorage);

    // Si userInfo es un array, tomamos el primer elemento
    // this.userInformation = Array.isArray(parsedUserInfo)
    //   ? parsedUserInfo[0]
    //   : parsedUserInfo;
  }

  logOut(): void {
    // Llamar al servicio de autenticación para cerrar sesión
    this.authService.logOut();

    // Eliminar cualquier información del usuario almacenada
    sessionStorage.removeItem('userImage');
    localStorage.removeItem('InfoUsuario');

    // Redirigir al usuario a la pantalla de inicio de sesión
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe(); // Desuscribe de todos los observables

    if (this.image) {
      URL.revokeObjectURL(this.image);
    }
  }
}
