import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Formulario4Datos } from '../dashboard/interfaces/formularios';
import { Observable } from 'rxjs/internal/Observable';
import { env } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class Paso4FormularioService {

  constructor(private servicio: HttpClient) { }
  servidor: string = `${env.url}`;

  dataFormulario4!: Formulario4Datos;
  setDataFormulario4(datos: Formulario4Datos) {
    this.dataFormulario4 = datos;
  }

  getDataFormulario4() {
    return this.dataFormulario4;
  }

  reiniciarFormulario4(){
    this.dataFormulario4= {};
  }

  guardarRegistrosPaso4EnBaseDeDatos(data: Formulario4Datos): Observable<any>{
    const datos:string = '';
    return this.servicio.post(`${this.servidor}/form/paso1/${1}`, datos);
  }

}
