import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@Injectable({providedIn: 'root'})
export class DialogService {  
    constructor(private dialog: MatDialog) {}  
  
    openConfirmDialog(data: any): Promise<boolean> {  
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {  
        width: '430px',  
        data: data,  
      });  
  
      return dialogRef.afterClosed().toPromise();  
    }  
  }