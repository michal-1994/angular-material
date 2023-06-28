import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs/internal/Subject';

@Injectable()
export class UIService {
  loadingStateChanged = new Subject<boolean>();

  constructor(private snackbar: MatSnackBar) {}

  showSnackBar(message: string, action: string | null, duration: number) {
    this.snackbar.open(message, action ? action : undefined, {
      duration: duration,
    });
  }
}
