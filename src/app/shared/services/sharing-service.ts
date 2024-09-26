import { inject, Injectable } from '@angular/core';
import { Estudiante } from '@features/estudiantes/estudiantes.interfaces';
import { EstudiantesService } from '@features/estudiantes/estudiantes.services';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class SharingService<T> {
    //private estudiantesServices = inject(EstudiantesService);
    private listaTablaObservable = new BehaviorSubject<T[]>([]);
    private clickedValue = new BehaviorSubject<string>('');
    clickedValue$ = this.clickedValue.asObservable();

     getlistaTablaObservable(): Observable<T[]> {
        // this.estudiantesServices.getAllEstudiantes().subscribe(estudiantes => {
        //   this.listaEstudiantesObservable.next(estudiantes);
        // });
        return this.listaTablaObservable.asObservable();
      }
    
    setlistaTablaObservable(listaTabla: T[]): void {
        // this.estudiantesServices.getAllEstudiantes().subscribe(estudiantes => {
        //     this.listaEstudiantesObservable.next(estudiantes);
        //   });
          this.listaTablaObservable.next(listaTabla);
    }

    getclickedValue(): Observable<string> {
        return this.clickedValue$
      }
    
    setclickedValue(value: string): void {
        this.clickedValue.next(value);
    }
    
}