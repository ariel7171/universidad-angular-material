import { inject, Injectable } from '@angular/core';  
import { MatSnackBar } from '@angular/material/snack-bar';  

@Injectable({ providedIn: 'root' })  
export class SnackBarService {  
    private readonly _snackBar = inject(MatSnackBar);  

    showSnackbar(message: string, type: 'success' | 'error' = 'success', action: string = ''): void {  
        let panelClass = type === 'error' ? 'snackbar-error' : 'snackbar-success';  
        
        this._snackBar.open(message, action, {  
            duration: 3000,  
            verticalPosition: 'top',  
            horizontalPosition: 'right',  
            panelClass: [panelClass]
        });  
    }  
}