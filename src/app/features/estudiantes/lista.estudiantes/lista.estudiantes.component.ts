import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { GridComponent } from '@components/grid/grid.component';
import { Estudiante } from '../estudiantes.interfaces';
import { ColumnKeys } from '@shared/types';
import { EstudiantesService } from '../estudiantes.services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModalService } from '@components/modal/modal.service';
import { ModalComponent } from '@components/modal/modal.component';
import { DialogService } from '@components/confirm-dialog/confirm-dialog.service';
import { SnackBarService } from '@shared/services/snack-bar.services';
import { SharingService } from '@shared/services/sharing-service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ToolbarComponent } from "@components/toolbar/toolbar.component";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormFields } from '@shared/form.fields.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-lista-estudiantes',
  standalone: true,
  imports: [GridComponent, ToolbarComponent],
  template: `
    <section>
      @if (estudiantes$) {
        <app-grid [displayedColumns]="displayedColumns" (opendEditFormChild)="opendEditForm($event)" (deleteElementChild)="deleteEstudiante($event)" />
      }
    </section>
  `,
  styles: ``
})

export class ListaEstudiantesComponent implements OnInit {

  displayedColumns: ColumnKeys<Estudiante> = ['id', 'nombre', 'apellido', 'dni', 'email', 'creatAt', 'updatedAt', 'actions'];
  estudiantes$!: Observable<Estudiante[]>;
  estudianteForm!: FormGroup;
  formFields!: FormFields;

  private readonly _estudiantesSvc = inject(EstudiantesService);
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
    this.getAllEstudiantes();
    this.estudiantes$ = this._sharingSvc.getlistaTablaObservable();
    this._sharingSvc.clickedValue$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((value) => {
      this.onValueChange(value);
    })
  }

  onValueChange(value: string) {
    if (value === 'estudiantes') {
      this.openForm();
    }
  }

  ngOnDestroy(): void {
    this._sharingSvc.setclickedValue('');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getAllEstudiantes() {

    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.unsubscribe$ = new Subject();

    this._estudiantesSvc.getAllEstudiantes()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (estudiantes) => {
          this._sharingSvc.setlistaTablaObservable(estudiantes);
        },
        error: (error: HttpErrorResponse) => {
          const statusCode = error.status;
          const errorMessage = error.error?.message || 'Error inesperado';
          this._snackBarSvc.showSnackbar(`Error (${statusCode}): ${errorMessage}`, 'error');
        }
      });
  }

  buildForm() {
    this.estudianteForm = this._fb.nonNullable.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      apellido: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  buildFormFields() {
    this.formFields = {
      title: 'Estudiantes',
      button: 'Estudiante',
      fields: [
        { label: 'Nombre', name: 'nombre', type: 'text' },
        { label: 'Apellido', name: 'apellido', type: 'text' },
        { label: 'DNI', name: 'dni', type: 'text' },
        { label: 'Email', name: 'email', type: 'text' }
      ]
    }
  }

  openForm() {
    this.openEstudianteModal(false);
  }

  opendEditForm(element: any) {
    this.openEstudianteModal(true, element);
  }

  private openEstudianteModal(isEditing: boolean, data?: Estudiante): void {

    const dialogRef = this._modalSvc.openmodal<ModalComponent, Estudiante>(ModalComponent, this.formFields, this.estudianteForm, data, isEditing);

    dialogRef.componentInstance.onSubmitChild.subscribe((formGroup: FormGroup) => {
      this.handleFormSubmission(formGroup, isEditing, data);
    });
  }

  private handleFormSubmission(formGroup: FormGroup, isEditing: boolean, data?: Estudiante) {

    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.unsubscribe$ = new Subject();

    if (data && isEditing) {
      // Actualizar estudiante
      this._estudiantesSvc.updateEstudiante(data.id.toString(), formGroup.value)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (response) => {
            console.log('Estudiante actualizado correctamente', response);
            this._snackBarSvc.showSnackbar('Estudiante actualizado correctamente');
            this.getAllEstudiantes();
          },
          error: (error: HttpErrorResponse) => {
            const statusCode = error.status;
            const errorMessage = error.error?.message || 'Error inesperado';
            this._snackBarSvc.showSnackbar(`Error (${statusCode}): ${errorMessage}`, 'error');
          }
        });
    } else {
      // Crear estudiante
      this._estudiantesSvc.saveEstudiante(formGroup.value)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (response) => {
            console.log('Estudiante creado correctamente', response);
            this._snackBarSvc.showSnackbar('Estudiante creado correctamente');
            this.getAllEstudiantes();
          },
          error: (error: HttpErrorResponse) => {
            const statusCode = error.status;
            const errorMessage = error.error?.message || 'Error inesperado';
            this._snackBarSvc.showSnackbar(`Error (${statusCode}): ${errorMessage}`, 'error');
          }
        });
    }
  }

  async deleteEstudiante(element: Estudiante) {
    const confirmed = await this._dialogSvc.openConfirmDialog({
      title: 'Eliminar',
      message: '¿Estás seguro de que quieres eliminar este estudiante?',
    });

    if (confirmed) {

      this.unsubscribe$.next();
      this.unsubscribe$.complete();
      this.unsubscribe$ = new Subject();

      this._estudiantesSvc.deleteEstudiante(element.id.toString())
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (response) => {
            console.log('Estudiante eliminado correctamente', response);
            this._snackBarSvc.showSnackbar('Estudiante eliminado correctamente');
            this.getAllEstudiantes();
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