import { Component, EventEmitter, inject, Output, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { GridComponent } from "../grid/grid.component";
import { HomeComponent } from "@features/home/home.component";
import { ListaEstudiantesComponent } from "@features/estudiantes/lista.estudiantes/lista.estudiantes.component";
import { CommonModule } from '@angular/common';
import { ListaProfesoresComponent } from '@features/profesores/lista.profesores/lista.profesores.component';
import { SharingService } from '@shared/services/sharing-service';
import { ListaCursosComponent } from "@features/cursos/lista.cursos/lista.cursos.component";
import { ListaInscripcionesComponent } from "../../features/inscripciones/lista.inscripciones/lista.inscripciones.component";

const MATERIAL_MODULES = [MatToolbarModule, MatIconModule, MatButtonModule, MatButtonToggleModule];

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [MATERIAL_MODULES, GridComponent, HomeComponent, ListaEstudiantesComponent, ListaProfesoresComponent, CommonModule, ListaCursosComponent, ListaInscripcionesComponent],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
  private readonly _sharingSvc = inject(SharingService);

  selectedValue: string = 'home'; 

  //onNewEstudianteEvent = output<void>();
  
  emitClick(): void {
    //this.onNewEstudianteEvent.emit();
    this._sharingSvc.setclickedValue(this.selectedValue);
  }

  onToggleChange(value: string) {
    this.selectedValue = value;
  }

}


/*
<mat-toolbar color="primary">
    <a mat-button routerLink="/" >
      <mat-icon>home</mat-icon>
      <span>Home</span>
    </a>
  
    <a mat-button routerLink="/estudiantes" >
      <mat-icon>list_alt</mat-icon>
      <span>Estudiantes</span>
    </a>
    <span class="spacer"></span>
    <a mat-button (click)="emitClick()">
      <mat-icon>add_box</mat-icon>
      <span>Nuevo</span>
    </a>
  </mat-toolbar>
*/