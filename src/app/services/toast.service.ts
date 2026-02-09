import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(private snackBar: MatSnackBar) {}

  success(message: string, duration = 4000) {
    this.snackBar.open(message, 'Close', {
      duration,
      panelClass: ['toast-success'],
      horizontalPosition: 'right',
      verticalPosition: 'bottom'
    });
  }

  error(message: string, duration = 5000) {
    this.snackBar.open(message, 'Close', {
      duration,
      panelClass: ['toast-error'],
      horizontalPosition: 'right',
      verticalPosition: 'bottom'
    });
  }

  info(message: string, duration = 4000) {
    this.snackBar.open(message, 'Close', {
      duration,
      panelClass: ['toast-info'],
      horizontalPosition: 'right',
      verticalPosition: 'bottom'
    });
  }

  warning(message: string, duration = 4000) {
    this.snackBar.open(message, 'Close', {
      duration,
      panelClass: ['toast-warning'],
      horizontalPosition: 'right',
      verticalPosition: 'bottom'
    });
  }
}
