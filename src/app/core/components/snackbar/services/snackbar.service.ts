import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import {
  SnackbarAuxColor,
  SnackbarIcon,
  SnackbarPrimaryColor,
  SnackbarType,
} from '../models/snackbar-type';
import { SnackbarComponent } from '../snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) {}

  openCustomSnackbar(
    message: string,
    type: SnackbarType,
  ): MatSnackBarRef<SnackbarComponent> | null {
    if (!message) {
      return null;
    }

    const snackbarRef: MatSnackBarRef<SnackbarComponent> =
      this.snackBar.openFromComponent(SnackbarComponent, {
        duration: 3000,
        verticalPosition: 'top',
        panelClass: ['custom-snackbar', 'shadow'],
      });

    snackbarRef.instance.message = message;
    snackbarRef.instance.icon = SnackbarIcon[type];
    snackbarRef.instance.color = SnackbarPrimaryColor[type];
    snackbarRef.instance.colorAux = SnackbarAuxColor[type];

    snackbarRef.instance.snackbarRef = snackbarRef;

    return snackbarRef;
  }
}
