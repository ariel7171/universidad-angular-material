import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

const MATERIAL_MODULES =[MatButtonModule, MatIconModule, MatDividerModule];

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MATERIAL_MODULES],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false); // Cerrar sin confirmar
  }

  onConfirmClick(): void {
    this.dialogRef.close(true); // Confirmar acción
  }
}
