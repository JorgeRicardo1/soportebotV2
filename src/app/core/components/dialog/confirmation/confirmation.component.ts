import { Component, Inject } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ThemeService } from '../../../components/navigation/services/theme.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/material/material.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {DialogRef, DIALOG_DATA, DialogModule} from '@angular/cdk/dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { infoEquipo } from '../../../../pages/chat/interfaces/info-equipo'


@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule,CommonModule, MaterialModule, DialogModule],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.css'
})
export class ConfirmationComponent {

  usersForm!: FormGroup;
  utpMedium = false;
  formConfirmation = new FormGroup({
    'placaEquipo' : new FormControl(''),
    'ubicacionEquipo' : new FormControl(''),
    'detallesEquipo' : new FormControl('')
  });

  informacionEquipo : infoEquipo = {
    placa: 0,
    usuario: {
      name: 'Andres',
      code: '123456'
    },
    ubicacion: '',
    detalles: '',
    resumen: '',
    ticket: ''
  }

  constructor(
    protected themeService: ThemeService,
    public dialogRef: MatDialogRef<infoEquipo>,
    @Inject(MAT_DIALOG_DATA) public data: {ticket: string, resumen: string}
  ){

  }

  submitForm(): void {
    if (this.formConfirmation.valid === true ){

      const infoEnviar : infoEquipo = {
        placa : Number(this.formConfirmation.get('placaEquipo')?.value),
        usuario: {
          name: 'Andres',
          code: '123456'
        },
        ubicacion: this.formConfirmation.get('ubicacionEquipo')?.value?.toString(),
        detalles: this.formConfirmation.get('detallesEquipo')?.value?.toString(),
        resumen: this.data.resumen,
        ticket: this.data.ticket

      }
      this.dialogRef.close(infoEnviar);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
