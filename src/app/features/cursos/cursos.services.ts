import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Curso } from './cursos.interface';

@Injectable({providedIn: 'root'})
export class CursosService {
    
    private readonly _http = inject(HttpClient);
    private readonly baseUrl = 'http://localhost:4000/universidad/cursos';

    getAllCursos(): Observable<Curso[]> {
        return this._http.get<Curso[]>(this.baseUrl).pipe(
            catchError((error: HttpErrorResponse) => {
                console.error('Error fetching cursos:', error);
                return throwError(() => error as HttpErrorResponse); 
            })
        );
    }

    getCursoById(id: string): Observable<Curso> {
        return this._http.get<Curso>(`${this.baseUrl}/${id}`).pipe(
            catchError((error: HttpErrorResponse) => {
                console.error('Error fetching cursos:', error);
                return throwError(() => error as HttpErrorResponse);
            })
        );
    }

    saveCurso(curso: Partial<Curso>): Observable<Curso> {
        return this._http.post<Curso>(this.baseUrl, curso).pipe(
            catchError((error: HttpErrorResponse) => {
                console.error('Error fetching cursos:', error);
                return throwError(() => error as HttpErrorResponse);
            })
        );
    }

    updateCurso(id: string, curso: Partial<Curso>): Observable<Curso> {
        console.log(`${this.baseUrl}/${id}`, curso)
        return this._http.put<Curso>(`${this.baseUrl}/${id}`, curso).pipe(
            catchError((error: HttpErrorResponse) => {
                console.error('Error fetching cursos:', error);
                return throwError(() => error as HttpErrorResponse);
            })
        );
    }

    deleteCurso(id: string): Observable<void> {
        return this._http.delete<void>(`${this.baseUrl}/${id}`).pipe(
            catchError((error: HttpErrorResponse) => {
                console.error('Error deleting curso:', error);
                return throwError(() => error);
            })
        );
    }
}