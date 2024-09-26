import { HttpErrorResponse } from "@angular/common/http";
import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DialogService } from "@components/confirm-dialog/confirm-dialog.service";
import { GridComponent } from "@components/grid/grid.component";
import { ModalComponent } from "@components/modal/modal.component";
import { ModalService } from "@components/modal/modal.service";
import { ToolbarComponent } from "@components/toolbar/toolbar.component";
import { FormFields } from "@shared/form.fields.interface";
import { SharingService } from "@shared/services/sharing-service";
import { SnackBarService } from "@shared/services/snack-bar.services";
import { ColumnKeys } from "@shared/types";
import { Observable, Subject, takeUntil } from "rxjs";
import { Inscripcion } from "../inscripciones.interface";
import { InscripcionesService } from "../inscripciones.services";



@Component({
  selector: 'app-lista-inscripciones',
  standalone: true,
  imports: [GridComponent, ToolbarComponent],
  template: `
      <section>
        @if (inscripciones$) {
          <app-grid [displayedColumns]="displayedColumns" (opendEditFormChild)="opendEditForm($event)" (deleteElementChild)="deleteInscripcion($event)" />
        }
      </section>
    `,
  styles: ``
})

export class ListaInscripcionesComponent implements OnInit {

  displayedColumns: ColumnKeys<Inscripcion> = ['estudiante_id', 'curso_id', 'nota', 'creatAt', 'updatedAt', 'actions'];
  inscripciones$!: Observable<Inscripcion[]>;
  inscripcionForm!: FormGroup;
  formFields!: FormFields;

  private readonly _inscripcionesSvc = inject(InscripcionesService);
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
    this.getAllInscripciones();
    this.inscripciones$ = this._sharingSvc.getlistaTablaObservable();
    this._sharingSvc.clickedValue$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((value) => {
      this.onValueChange(value);
    })
  }

  onValueChange(value: string) {
    if (value === 'inscripciones') {
      this.openForm();
    }
  }

  ngOnDestroy(): void {
    this._sharingSvc.setclickedValue('');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getAllInscripciones() {

    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.unsubscribe$ = new Subject();

    this._inscripcionesSvc.getAllInscripciones()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (inscripciones) => {
          this._sharingSvc.setlistaTablaObservable(inscripciones);
        },
        error: (error: HttpErrorResponse) => {
          const statusCode = error.status;
          const errorMessage = error.error?.message || 'Error inesperado';
          this._snackBarSvc.showSnackbar(`Error (${statusCode}): ${errorMessage}`, 'error');
        }
      });
  }

  buildForm() {
    this.inscripcionForm = this._fb.nonNullable.group({
      estudiante_id: ['', Validators.required],
      curso_id: ['', Validators.required],
      nota: ['', Validators.required]
    });
  }

  buildFormFields() {
    this.formFields = {
      title: 'Inscripciones',
      button: 'Inscripcion',
      fields: [
        { label: 'Estudiante', name: 'estudiante_id', type: 'number' },
        { label: 'Curso', name: 'curso_id', type: 'number' },
        { label: 'Nota', name: 'nota', type: 'number' }
      ]
    }
  }

  openForm() {
    this.openInscripcionModal(false);
  }

  opendEditForm(element: any) {
    this.openInscripcionModal(true, element);
  }

  private openInscripcionModal(isEditing: boolean, data?: Inscripcion): void {

    const dialogRef = this._modalSvc.openmodal<ModalComponent, Inscripcion>(ModalComponent, this.formFields, this.inscripcionForm, data, isEditing);

    dialogRef.componentInstance.onSubmitChild.subscribe((formGroup: FormGroup) => {
      this.handleFormSubmission(formGroup, isEditing, data);
    });
  }

  private handleFormSubmission(formGroup: FormGroup, isEditing: boolean, data?: Inscripcion) {

    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.unsubscribe$ = new Subject();

    if (data && isEditing) {
      // Actualizar inscripcion
      this._inscripcionesSvc.updateInscripcion(formGroup.value)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (response) => {
            console.log('Inscripcion actualizado correctamente', response);
            this._snackBarSvc.showSnackbar('Inscripcion actualizado correctamente');
            this.getAllInscripciones();
          },
          error: (error: HttpErrorResponse) => {
            const statusCode = error.status;
            const errorMessage = error.error?.message || 'Error inesperado';
            this._snackBarSvc.showSnackbar(`Error (${statusCode}): ${errorMessage}`, 'error');
          }
        });
    } else {
      // Crear inscripcion
      this._inscripcionesSvc.saveInscripcion(formGroup.value)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (response) => {
            console.log('Inscripcion creado correctamente', response);
            this._snackBarSvc.showSnackbar('Inscripcion creado correctamente');
            this.getAllInscripciones();
          },
          error: (error: HttpErrorResponse) => {
            const statusCode = error.status;
            const errorMessage = error.error?.message || 'Error inesperado';
            this._snackBarSvc.showSnackbar(`Error (${statusCode}): ${errorMessage}`, 'error');
          }
        });
    }
  }

  async deleteInscripcion(element: Inscripcion) {
    const confirmed = await this._dialogSvc.openConfirmDialog({
      title: 'Eliminar',
      message: '¿Estás seguro de que quieres eliminar este inscripcion?',
    });

    if (confirmed) {

      this.unsubscribe$.next();
      this.unsubscribe$.complete();
      this.unsubscribe$ = new Subject();

      this._inscripcionesSvc.deleteInscripcion(element)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (response) => {
            console.log('Inscripcion eliminado correctamente', response);
            this._snackBarSvc.showSnackbar('Inscripcion eliminado correctamente');
            this.getAllInscripciones();
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
