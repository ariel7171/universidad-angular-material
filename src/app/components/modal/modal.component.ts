import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ModalService } from './modal.service';
import { MatButtonModule } from '@angular/material/button';
import { NgFor } from '@angular/common';
import { GeneralFields } from '@shared/services/general.fields.interface';

const MATERIAL_MODULES = [MatLabel, MatFormField, MatInput, MatDialogModule, MatButtonModule];

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [ReactiveFormsModule, MATERIAL_MODULES, NgFor],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent implements OnInit {

  entityForm!: FormGroup;
  fields!: GeneralFields[];
  entity!: string;
  button!: string;

  private readonly _matDialog = inject(MAT_DIALOG_DATA);
  private readonly _modalSvc = inject(ModalService);

  @Output() onSubmitChild = new EventEmitter<FormGroup>();

  ngOnInit(): void {
    this.button = this._matDialog.formFields.button;
    this.entity = this._matDialog.formFields.title;
    this.fields = this._matDialog.formFields.fields;
    this.entityForm = this._matDialog.fb;
    
    if (this._matDialog.isEditing) {
      this.entityForm.patchValue(this._matDialog.data);
    }else{
      this.entityForm.reset();
    }
  }
 
  onSubmit(): void {
    this.onSubmitChild.emit(this.entityForm);
    this._modalSvc.closemodal();
  }

  getTitle(): string {
    return this._matDialog.isEditing ? `Editar ${this.button}` : `Guardar ${this.button}`;
  }

//   buildForm() {
//     const formGroup: { [key: string]: any } = {};
//     this.fields.forEach(field => {
//       switch (field.toLocaleLowerCase()) {
//         case 'nombre':
//         case 'apellido':
//           formGroup[field] = ['', Validators.required];
//           break;
//         case 'dni':
//           formGroup[field] = ['', [Validators.required, Validators.pattern('[0-9]{8}')]];
//           break;
//         case 'email':
//           formGroup[field] = ['', [Validators.required, Validators.email]];
//           break;
//         default:
//           formGroup[field] = ['', Validators.required];
//           break;
//       }
//     });
//     this.estudianteForm = this._fb.nonNullable.group(formGroup);
// }

}