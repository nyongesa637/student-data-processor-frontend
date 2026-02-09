import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(private snackBar: MatSnackBar) {}

  success(message: string, duration = 4000) {
    this.snackBar.open(message, 'Close', {
      duration,
      panelClass: ['toast-neutral'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  error(message: string, duration = 5000) {
    this.snackBar.open(message, 'Close', {
      duration,
      panelClass: ['toast-neutral'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  info(message: string, duration = 4000) {
    this.snackBar.open(message, 'Close', {
      duration,
      panelClass: ['toast-neutral'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  warning(message: string, duration = 4000) {
    this.snackBar.open(message, 'Close', {
      duration,
      panelClass: ['toast-neutral'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}
