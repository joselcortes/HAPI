import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'src/environments/environments';
import { Centros } from '../dashboard/interfaces/centros';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class CentrosSaludService {
  private url: string
  constructor(private http: HttpClient) {
    this.url = `${env.url}/centro`
  }

  crearCentro(body: Centros, dataimg:File): Observable<any>{
    const formData = new FormData();
    formData.append('archivo', dataimg)
    formData.append('nombre_centro_salud', body.nombre_centro_salud)
    formData.append('comuna_centro_salud', body.comuna_centro_atencion)

    return this.http.post(`${this.url}/guardarCentro`, formData);

  }

  actualizarCentro(datosCentro: any, body: Centros, dataimg:File){
    const formData = new FormData();
    const { id_centro_salud , logo } = datosCentro[0];
    formData.append('archivo', dataimg)
    formData.append('nombre_centro_salud', body.nombre_centro_salud)
    formData.append('comuna_centro_salud', body.comuna_centro_atencion)
    formData.append('logo', logo)

    return this.http.post(`${this.url}/actualizarCentro/${id_centro_salud}`, formData);

  }

  eliminarCentro(idCentro: number, rutaCentros: any): Observable<any>{
    const body = { ruta: rutaCentros}
    return this.http.post(`${this.url}/eliminarCentro/${idCentro}`, body);

  }

  mostrarImagen(ruta:any) {
    const params = new HttpParams().set('ruta', ruta);

    return this.http.get(`${this.url}/obtener-archivo`, { params: params, responseType: 'blob'} )
  }

  listarCentro(){
    return this.http.get(`${this.url}/listarCentro`);
  }

  listarCentroRut(idCentro: any){
    return this.http.get(`${this.url}/listarCentroRut/${idCentro}`);
  }

  listarComunas(){
    return this.http.get(`${env.url}/comuna/listarComunas`)
  }

  listarComunasId(idComuna:string){
    return this.http.get(`${env.url}/comuna/listarComunasId/${idComuna}`)
  }

}
