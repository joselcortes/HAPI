import { env } from 'src/environments/environments';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Fonasa } from '../dashboard/interfaces/apis';

@Injectable({
  providedIn: 'root'
})
export class DatosUsuariosService {

  constructor( private http: HttpClient ) { }
  private urlTest : string = "https://apifenix.hospitaldeovalle.cl";

  obtenerPacienteAPI(termino: string): Observable<any> {
    const authHeaders = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Basic " + btoa("admin:Cb7A506a"),
      "Access-Control-Allow-Origin": `${this.urlTest}/api/paciente`,
      "Access-Control-Allow-Credentials": "true"
    });

    const url = `${this.urlTest}/api/paciente/${termino}`;
    const body = {
      "termino": termino,
    };

    return this.http.get(url, { headers: authHeaders })
      .pipe(
        catchError(error => {
          console.log('Error api');
          return of(false);
        })
    );
  }

  //API FONASA
  // servidor: string = 'http://127.0.0.1:3002';
  servidor: string = `${env.url}`;
  obtenerPacienteFonasa = (run: any): Observable<Fonasa> => {
    console.log('En fonasa');
    const token = localStorage.getItem('token');
    const body = {
      run: run.rut,
      dverificador: run.identificador,
    };
    return this.http.post<Fonasa>(`${this.servidor}/fonasa/obtener`,body);
  }

}
