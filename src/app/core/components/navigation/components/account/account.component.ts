import { Component } from '@angular/core';
import { MaterialModule } from '../../../../../shared/material/material.module';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'utp-account',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {
  userName: string = 'usuario';
  userRole: string = 'Role';
  userDependencia: string = 'Dependencia';

  defaultImage = 'https://media2.utp.edu.co/imagenes/Logo-UTP-Azul.png';
  image: any = this.defaultImage;

  constructor(
    protected themeService: ThemeService
  ){


  }



}
