import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  success(message: string, action: string = 'OK', duration: number = 3000): void {
    this.snackBar.open(message, action, {
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['studio-snackbar-success']
    });
  }

  error(message: string, action: string = 'Close', duration: number = 4000): void {
    this.snackBar.open(message, action, {
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['studio-snackbar-error']
    });
  }

  info(message: string, action: string = 'OK', duration: number = 3000): void {
    this.snackBar.open(message, action, {
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['studio-snackbar-info']
    });
  }
}
