import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Formulario2Datos } from '../dashboard/interfaces/formularios';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class Paso2FormularioService {

  constructor(private servicio: HttpClient) { }
  servidor: string = 'http://localhost:3003';

  dataFormulario2!: Formulario2Datos;
  setDataFormulario2(datos: Formulario2Datos) {
    this.dataFormulario2 = datos;
  }
  getDataFormulario2() {
    return this.dataFormulario2;
  }

  datosModificadosEnvioFormulario2() {
    if (this.dataFormulario2) {
      //const generoSeleccionado = this.dataFormulario2.generoSeleccionado !== null ? this.dataFormulario2.generoSeleccionado : '**';
      //const orientacionSexualSeleccionada = this.dataFormulario2.orientacionSexualSeleccionada !== null ? this.dataFormulario2.orientacionSexualSeleccionada : '**';
      const apoyoFamiliar = this.asignacionValores0Y1CamposSiYNo(this.dataFormulario2.apoyoFamiliar);
      this.dataFormulario2.apoyoFamiliar = typeof apoyoFamiliar === 'number' ? !!apoyoFamiliar : apoyoFamiliar;
    }
    return this.dataFormulario2;
  }

  reiniciarFormulario2() {
    this.dataFormulario2 = {};
  }

  asignacionValores0Y1CamposSiYNo(valor: boolean | undefined) {
    return typeof valor === 'boolean' ? (valor ? 1 : 0) : (valor === 'si' ? 1 : 0);
  }


}





