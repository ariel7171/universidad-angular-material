import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DialogService } from '@components/confirm-dialog/confirm-dialog.service';
import { GridComponent } from '@components/grid/grid.component';
import { ModalComponent } from '@components/modal/modal.component';
import { ModalService } from '@components/modal/modal.service';
import { SharingService } from '@shared/services/sharing-service';
import { SnackBarService } from '@shared/services/snack-bar.services';
import { ColumnKeys } from '@shared/types';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Profesor } from '../profesores.interfaces';
import { ProfesoresService } from '../profesores.services';
import { FormFields } from '@shared/form.fields.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-lista-profesores',
  standalone: true,
  imports: [GridComponent],
  template: `
    <section>
      @if (profesores$) {
        <app-grid [displayedColumns]="displayedColumns" (opendEditFormChild)="opendEditForm($event)" (deleteElementChild)="deleteProfesor($event)" />
      }
    </section>
  `,
  styles: ``
})
export class ListaProfesoresComponent implements OnInit {
  
  displayedColumns: ColumnKeys<Profesor> = ['id', 'nombre', 'apellido', 'dni', 'email', 'profesion', 'telefono', 'creatAt', 'updatedAt', 'actions'];
  profesores$!: Observable<Profesor[]>;
  profesorForm!: FormGroup;
  formFields!: FormFields;

  private readonly _profesoresSvc = inject(ProfesoresService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _modalSvc = inject(ModalService);
  private readonly _dialogSvc = inject(DialogService);
  private readonly _snackBarSvc = inject(SnackBarService);
  private readonly _sharingSvc = inject(SharingService);
  private readonly _fb = inject(FormBuilder);
  private unsubscribe$: Subject<void> = new Subject();

  ngOnInit(): void {
    this.buildFormFields();
    this.buildForm();
    this.getAllProfesores();
    this.profesores$ = this._sharingSvc.getlistaTablaObservable();
    this._sharingSvc.clickedValue$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((value) => {
      this.onValueChange(value);
    })
  }

  onValueChange(value: string) {
    if (value === 'profesores') {
      this.openForm();
    }
  }

  ngOnDestroy(): void {
    this._sharingSvc.setclickedValue('');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getAllProfesores() {

    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.unsubscribe$ = new Subject();

    this._profesoresSvc.getAllProfesores()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (profesores) => {
          this._sharingSvc.setlistaTablaObservable(profesores);
        },
        error: (error: HttpErrorResponse) => {
          const statusCode = error.status;
          const errorMessage = error.error?.message || 'Error inesperado';
          this._snackBarSvc.showSnackbar(`Error (${statusCode}): ${errorMessage}`, 'error');
        }
      });
  }

  buildForm() {
    this.profesorForm = this._fb.nonNullable.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      apellido: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      email: ['', [Validators.required, Validators.email]],
      profesion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      telefono: ['', [Validators.required, Validators.pattern(/^\+?[1-9]\d{1,14}$/)]]
    });
  }

  buildFormFields() {
    this.formFields = {
      title: 'Profesores',
      button: 'Profesor',
      fields: [
        { label: 'Nombre', name: 'nombre', type: 'text' },
        { label: 'Apellido', name: 'apellido', type: 'text' },
        { label: 'DNI', name: 'dni', type: 'text' },
        { label: 'Email', name: 'email', type: 'text' },
        { label: 'Profesion', name: 'profesion', type: 'text' },
        { label: 'Telefono', name: 'telefono', type: 'text' }
      ]
    }
  }

  openForm() {
    this.openProfesorModal(false);
  }

  opendEditForm(element: any) {
    this.openProfesorModal(true, element);
  }

  private openProfesorModal(isEditing: boolean, data?: Profesor): void {

    const dialogRef = this._modalSvc.openmodal<ModalComponent, Profesor>(ModalComponent, this.formFields, this.profesorForm, data, isEditing);

    dialogRef.componentInstance.onSubmitChild.subscribe((formGroup: FormGroup) => {
      this.handleFormSubmission(formGroup, isEditing, data);
    });
  }

  private handleFormSubmission(formGroup: FormGroup, isEditing: boolean, data?: Profesor) {

    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.unsubscribe$ = new Subject();

    if (data && isEditing) {
      // Actualizar profesor
      this._profesoresSvc.updateProfesor(data.id.toString(), formGroup.value)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (response) => {
            console.log('Profesor actualizado correctamente', response);
            this._snackBarSvc.showSnackbar('Profesor actualizado correctamente');
            this.getAllProfesores();
          },
          error: (error: HttpErrorResponse) => {
            const statusCode = error.status;
            const errorMessage = error.error?.message || 'Error inesperado';
            this._snackBarSvc.showSnackbar(`Error (${statusCode}): ${errorMessage}`, 'error');
          }
        });
    } else {
      // Crear profesor
      this._profesoresSvc.saveProfesor(formGroup.value)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (response) => {
            console.log('Profesor creado correctamente', response);
            this._snackBarSvc.showSnackbar('Profesor creado correctamente');
            this.getAllProfesores();
          },
          error: (error: HttpErrorResponse) => {
            const statusCode = error.status;
            const errorMessage = error.error?.message || 'Error inesperado';
            this._snackBarSvc.showSnackbar(`Error (${statusCode}): ${errorMessage}`, 'error');
          }
        });
    }
  }

  async deleteProfesor(element: Profesor) {
    const confirmed = await this._dialogSvc.openConfirmDialog({
      title: 'Eliminar',
      message: '¿Estás seguro de que quieres eliminar este profesor?',
    });

    if (confirmed) {

      this.unsubscribe$.next();
      this.unsubscribe$.complete();
      this.unsubscribe$ = new Subject();

      this._profesoresSvc.deleteProfesor(element.id.toString())
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (response) => {
            console.log('Profesor eliminado correctamente', response);
            this._snackBarSvc.showSnackbar('Profesor eliminado correctamente');
            this.getAllProfesores();
          },
          error: (error: HttpErrorResponse) => {
            const statusCode = error.status;
            const errorMessage = error.error?.message || 'Error inesperado';
            this._snackBarSvc.showSnackbar(`Error (${statusCode}): ${errorMessage}`, 'error');
          }
        });
    }
  }
}
