import { Component, Input } from '@angular/core';
import { MatSnackBarRef } from '@angular/material/snack-bar';
import { MaterialModule } from '../../../shared/material/material.module';

@Component({
  selector: 'utp-snackbar',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.css'
})
export class SnackbarComponent {
  @Input() message: string = '';
  @Input() icon: string = '';
  @Input() color: string = '';
  @Input() colorAux: string = '';
  snackbarRef!: MatSnackBarRef<any>;

  constructor(public snackBarRef: MatSnackBarRef<SnackbarComponent>) {}

  dismiss() {
    this.snackBarRef.dismiss();
  }
}
