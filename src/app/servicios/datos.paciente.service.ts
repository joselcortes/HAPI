import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { of } from 'rxjs';
import { env } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})

export class PacientesService {

  constructor(private servicio: HttpClient) { }

  servidor: string = `${env.url}`;
  obtenerInformacionPacientesTabla(): Observable<any> {
    return this.servicio.get(`${this.servidor}/tabla/listar`);
  }

  obtenerInformacionPacientesHistorialGenero(): Observable<any> {
    return this.servicio.get(`${this.servidor}/tabla/listarAntiguo`)
  }

  obtenerInformacionCompletaPaciente(run: string): Observable<any> {
    return this.servicio.get(`${this.servidor}/form/listar/${run}`)
      .pipe(
        map((response: any) => {
          if (response && response.length > 0) {
            return response;
          } else {
            return of(null);
          }
        })
      );
  }

  estadisticaInicio(): Observable<any> {
    return this.servicio.get(`${this.servidor}/main/estadisticas`);
  }

  estadisticasFecha(): Observable<any>{
    return this.servicio.get(`${this.servidor}/main/estadisticasTabla`)
  }

  dataPacientePorRunTotal(run: string): Observable<any> {
    return this.servicio.get(`${this.servidor}/form/listarPorRut/${run}`)
  }

  fichaActiva(run: string): Observable<any> {
    return this.servicio.get(`${this.servidor}/fichas/activa/${run}`)
  }

  fichaInactiva(run: string): Observable<any> {
    return this.servicio.get(`${this.servidor}/fichas/inactivas/${run}`)
  }

  datosTotalesFicha(id: number) {
    return this.servicio.get(`${this.servidor}/fichas/listar/${id}`)
  }

  dataPanelEpisodio(run:string){
    return this.servicio.get(`${this.servidor}/fichas/dataPanel/${run}`)
  }

  dataPacienteAtencion(run: string): Observable<any>{
    return this.servicio.get(`${this.servidor}/fichas/dataPacienteAtencion/${run}`)
  }



}
