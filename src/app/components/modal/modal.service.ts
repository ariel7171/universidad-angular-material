import { ComponentType } from '@angular/cdk/portal';
import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Estudiante } from '@features/estudiantes/estudiantes.interfaces';
import { FormFields } from '@shared/form.fields.interface';

@Injectable({providedIn: 'root'})
export class ModalService {
 
    private readonly _dialog = inject(MatDialog);

    openmodal<CT, T = Estudiante>(componentRef: ComponentType<CT>, formFields: FormFields, fb: FormGroup, data?: T, isEditing: boolean = false): MatDialogRef<CT, any> {
        const config = { formFields, fb, data, isEditing };
        return this._dialog.open(componentRef, {
            data: config,
            width: '600px',
        });
    }

    closemodal(): void {
        this._dialog.closeAll();
    }

}

/*
    openmodal<CT, T = Estudiante>(componentRef: ComponentType<CT>, data?: T, isEditing: boolean = false): void {
        const config = {data, isEditing};
        this._dialog.open(componentRef, {
            data: config,
            width: '600px',
        });
    }
*/