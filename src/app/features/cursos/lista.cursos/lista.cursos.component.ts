import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ToolbarComponent } from "@components/toolbar/toolbar.component";
import { GridComponent } from '@components/grid/grid.component';
import { Curso } from '../cursos.interface';
import { ColumnKeys } from '@shared/types';
import { Observable, Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormFields } from '@shared/form.fields.interface';
import { CursosService } from '../cursos.services';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DialogService } from '@components/confirm-dialog/confirm-dialog.service';
import { ModalComponent } from '@components/modal/modal.component';
import { ModalService } from '@components/modal/modal.service';
import { SharingService } from '@shared/services/sharing-service';
import { SnackBarService } from '@shared/services/snack-bar.services';

@Component({
  selector: 'app-lista-cursos',
  standalone: true,
  imports: [GridComponent, ToolbarComponent],
  template: `
    <section>
      @if (cursos$) {
        <app-grid [displayedColumns]="displayedColumns" (opendEditFormChild)="opendEditForm($event)" (deleteElementChild)="deleteCurso($event)" />
      }
    </section>
  `,
  styles: ``
})
export class ListaCursosComponent implements OnInit {

  displayedColumns: ColumnKeys<Curso> = ['id', 'nombre', 'descripcion', 'profesor_id', 'creatAt', 'updatedAt', 'actions'];
  cursos$!: Observable<Curso[]>;
  cursoForm!: FormGroup;
  formFields!: FormFields;

  private readonly _cursosSvc = inject(CursosService);
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
    this.getAllCursos();
    this.cursos$ = this._sharingSvc.getlistaTablaObservable();
    this._sharingSvc.clickedValue$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((value) => {
      this.onValueChange(value);
    })
  }

  onValueChange(value: string) {
    if (value === 'cursos') {
      this.openForm();
    }
  }

  ngOnDestroy(): void {
    this._sharingSvc.setclickedValue('');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getAllCursos() {

    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.unsubscribe$ = new Subject();

    this._cursosSvc.getAllCursos()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (cursos) => {
          this._sharingSvc.setlistaTablaObservable(cursos);
        },
        error: (error: HttpErrorResponse) => {
          const statusCode = error.status;
          const errorMessage = error.error?.message || 'Error inesperado';
          this._snackBarSvc.showSnackbar(`Error (${statusCode}): ${errorMessage}`, 'error');
        }
      });
  }

  buildForm() {
    this.cursoForm = this._fb.nonNullable.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      descripcion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      profesor_id: ['', Validators.required]
    });
  }

  buildFormFields() {
    this.formFields = {
      title: 'Cursos',
      button: 'Curso',
      fields: [
        { label: 'Nombre', name: 'nombre', type: 'text' },
        { label: 'Descripcion', name: 'descripcion', type: 'text' },
        { label: 'Profesor', name: 'profesor_id', type: 'number' }
      ]
    }
  }

  openForm() {
    this.openCursoModal(false);
  }

  opendEditForm(element: any) {
    this.openCursoModal(true, element);
  }

  private openCursoModal(isEditing: boolean, data?: Curso): void {

    const dialogRef = this._modalSvc.openmodal<ModalComponent, Curso>(ModalComponent, this.formFields, this.cursoForm, data, isEditing);

    dialogRef.componentInstance.onSubmitChild.subscribe((formGroup: FormGroup) => {
      this.handleFormSubmission(formGroup, isEditing, data);
    });
  }

  private handleFormSubmission(formGroup: FormGroup, isEditing: boolean, data?: Curso) {

    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.unsubscribe$ = new Subject();

    if (data && isEditing) {
      // Actualizar curso
      this._cursosSvc.updateCurso(data.id.toString(), formGroup.value)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (response) => {
            console.log('Curso actualizado correctamente', response);
            this._snackBarSvc.showSnackbar('Curso actualizado correctamente');
            this.getAllCursos();
          },
          error: (error: HttpErrorResponse) => {
            const statusCode = error.status;
            const errorMessage = error.error?.message || 'Error inesperado';
            this._snackBarSvc.showSnackbar(`Error (${statusCode}): ${errorMessage}`, 'error');
          }
        });
    } else {
      // Crear curso
      this._cursosSvc.saveCurso(formGroup.value)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (response) => {
            console.log('Curso creado correctamente', response);
            this._snackBarSvc.showSnackbar('Curso creado correctamente');
            this.getAllCursos();
          },
          error: (error: HttpErrorResponse) => {
            const statusCode = error.status;
            const errorMessage = error.error?.message || 'Error inesperado';
            this._snackBarSvc.showSnackbar(`Error (${statusCode}): ${errorMessage}`, 'error');
          }
        });
    }
  }

  async deleteCurso(element: Curso) {
    const confirmed = await this._dialogSvc.openConfirmDialog({
      title: 'Eliminar',
      message: '¿Estás seguro de que quieres eliminar este curso?',
    });

    if (confirmed) {

      this.unsubscribe$.next();
      this.unsubscribe$.complete();
      this.unsubscribe$ = new Subject();

      this._cursosSvc.deleteCurso(element.id.toString())
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (response) => {
            console.log('Curso eliminado correctamente', response);
            this._snackBarSvc.showSnackbar('Curso eliminado correctamente');
            this.getAllCursos();
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
