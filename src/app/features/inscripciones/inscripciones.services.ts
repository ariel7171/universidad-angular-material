import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Inscripcion } from './inscripciones.interface';

@Injectable({providedIn: 'root'})

export class InscripcionesService {
   
    private readonly _http = inject(HttpClient);
    private readonly baseUrl = 'http://localhost:4000/universidad/inscripciones';

    getAllInscripciones(): Observable<Inscripcion[]> {
        return this._http.get<Inscripcion[]>(this.baseUrl).pipe(
            catchError((error: HttpErrorResponse) => {
                console.error('Error fetching inscripciones:', error);
                return throwError(() => error as HttpErrorResponse);
            })
        );
    }

    getInscripcionById(id: string): Observable<Inscripcion> {
        return this._http.get<Inscripcion>(`${this.baseUrl}/${id}`).pipe(
            catchError((error: HttpErrorResponse) => {
                console.error('Error fetching inscripciones:', error);
                return throwError(() => error as HttpErrorResponse);
            })
        );
    }

    saveInscripcion(inscripcion: Partial<Inscripcion>): Observable<Inscripcion> {
        console.log(this.baseUrl, inscripcion)
        return this._http.post<Inscripcion>(this.baseUrl, inscripcion).pipe(
            catchError((error: HttpErrorResponse) => {
                console.error('Error fetching inscripciones:', error);
                return throwError(() => error as HttpErrorResponse);
            })
        );
    }

    updateInscripcion(inscripcion: Partial<Inscripcion>): Observable<Inscripcion> {
        console.log(this.baseUrl, inscripcion)
        return this._http.put<Inscripcion>(this.baseUrl, inscripcion).pipe(
            catchError((error: HttpErrorResponse) => {
                console.error('Error fetching inscripciones:', error);
                return throwError(() => error as HttpErrorResponse);
            })
        );
    }

    deleteInscripcion(inscripcion: Partial<Inscripcion>): Observable<Inscripcion> {
        //console.log(this.baseUrl, {body: inscripcion})
        return this._http.delete<Inscripcion>(`${this.baseUrl}/${inscripcion.estudiante_id}/${inscripcion.curso_id}`).pipe(
            catchError((error: HttpErrorResponse) => {
                console.error('Error deleting inscripcion:', error);
                return throwError(() => error);
            })
        );
    }
}