import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Formulario1Datos } from '../dashboard/interfaces/formularios';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class Paso1FormularioService {

  constructor(private servicio: HttpClient) { }
  servidor: string = 'http://localhost:3003';

  dataFormulario1!: Formulario1Datos;
  setDataFormulario1(datos: Formulario1Datos) {
    this.dataFormulario1 = datos;
  }

  getDataFormulario1() {
    return this.dataFormulario1;
  }

  reiniciarFormulario1(){
    this.dataFormulario1 = {};
  }

}
