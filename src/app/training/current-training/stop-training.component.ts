import { Component } from '@angular/core';

@Component({
  template: `<h1 mat-dialog-title>Are you sure?</h1>
    <mat-dialog-actions>
      <button mat-button [mat-dialog-close]="true">Yes</button>
      <button mat-button [mat-dialog-close]="false">No</button>
    </mat-dialog-actions>`,
})
export class StopTrainingComponent {}
