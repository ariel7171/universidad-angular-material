import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Profesor } from './profesores.interfaces';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfesoresService {

    private readonly _http = inject(HttpClient);
    private readonly _baseUrl = 'http://localhost:4000/universidad/profesores';

    getAllProfesores(): Observable<Profesor[]> {
        return this._http.get<Profesor[]>(this._baseUrl).pipe(
            catchError((error: HttpErrorResponse) => {
                console.error('Error fetching profesores:', error);
                return throwError(() => error as HttpErrorResponse);
            })
        );
    }

    getProfesorById(id: string): Observable<Profesor> {
        return this._http.get<Profesor>(`${this._baseUrl}/${id}`).pipe(
            catchError((error: HttpErrorResponse) => {
                console.error('Error fetching profesores:', error);
                return throwError(() => error as HttpErrorResponse);
            })
        );
    }

    saveProfesor(profesor: Partial<Profesor>): Observable<Profesor> {
        return this._http.post<Profesor>(this._baseUrl, profesor).pipe(
            catchError((error: HttpErrorResponse) => {
                console.error('Error fetching profesores:', error);
                return throwError(() => error as HttpErrorResponse);
            })
        );
    }

    updateProfesor(id: string, profesor: Partial<Profesor>): Observable<Profesor> {
        console.log(`${this._baseUrl}/${id}`, profesor)
        return this._http.put<Profesor>(`${this._baseUrl}/${id}`, profesor).pipe(
            catchError((error: HttpErrorResponse) => {
                console.error('Error fetching profesores:', error);
                return throwError(() => error as HttpErrorResponse);
            })
        );
    }

    deleteProfesor(id: string): Observable<void> {
        return this._http.delete<void>(`${this._baseUrl}/${id}`).pipe(
            catchError((error: HttpErrorResponse) => {
                console.error('Error deleting profesor:', error);
                return throwError(() => error);
            })
        );
    }
}

