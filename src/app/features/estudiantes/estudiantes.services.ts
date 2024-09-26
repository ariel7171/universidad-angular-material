import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { Estudiante } from "./estudiantes.interfaces";

@Injectable({ providedIn: 'root' })
export class EstudiantesService {

    private readonly _http = inject(HttpClient);
    private readonly baseUrl = 'http://localhost:4000/universidad/estudiantes';

    getAllEstudiantes(): Observable<Estudiante[]> {
        return this._http.get<Estudiante[]>(this.baseUrl).pipe(
            catchError((error: HttpErrorResponse) => {
                console.error('Error fetching estudiantes:', error);
                return throwError(() => error as HttpErrorResponse);
            })
        );
    }

    getEstudianteById(id: string): Observable<Estudiante> {
        return this._http.get<Estudiante>(`${this.baseUrl}/${id}`).pipe(
            catchError((error: HttpErrorResponse) => {
                console.error('Error fetching estudiantes:', error);
                return throwError(() => error as HttpErrorResponse);
            })
        );
    }

    saveEstudiante(estudiante: Partial<Estudiante>): Observable<Estudiante> {
        console.log(this.baseUrl, estudiante)
        return this._http.post<Estudiante>(this.baseUrl, estudiante).pipe(
            catchError((error: HttpErrorResponse) => {
                console.error('Error fetching estudiantes:', error);
                return throwError(() => error as HttpErrorResponse);
            })
        );
    }

    updateEstudiante(id: string, estudiante: Partial<Estudiante>): Observable<Estudiante> {
        console.log(`${this.baseUrl}/${id}`, estudiante)
        return this._http.put<Estudiante>(`${this.baseUrl}/${id}`, estudiante).pipe(
            catchError((error: HttpErrorResponse) => {
                console.error('Error fetching estudiantes:', error);
                return throwError(() => error as HttpErrorResponse);
            })
        );
    }

    deleteEstudiante(id: string): Observable<void> {
        return this._http.delete<void>(`${this.baseUrl}/${id}`).pipe(
            catchError((error: HttpErrorResponse) => {
                console.error('Error deleting estudiante:', error);
                return throwError(() => error);
            })
        );
    }
}

