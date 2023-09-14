import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Formulario3Datos } from '../dashboard/interfaces/formularios';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class Paso3FormularioService {

  constructor(private servicio: HttpClient) { }
  servidor: string = 'http://localhost:3003';

  dataFormulario3!: Formulario3Datos;
  setDataFormulario3(datos: Formulario3Datos) {
    this.dataFormulario3 = datos;
  }

  getDataFormulario3() {
    return this.dataFormulario3;
  }

  datosModificadosEnvioFormulario3(){
    if (this.dataFormulario3) {
      const equipoControlSaludMental = this.asignacionValores0Y1CamposSiYNo(this.dataFormulario3.controlEquipoSaludMental);
      this.dataFormulario3.controlEquipoSaludMental = typeof equipoControlSaludMental === 'number' ? !!equipoControlSaludMental : equipoControlSaludMental;
      const psicoterapia = this.asignacionValores0Y1CamposSiYNo(this.dataFormulario3.psicoterapia);
      this.dataFormulario3.psicoterapia = typeof psicoterapia === 'number' ? !!psicoterapia : psicoterapia;
      const evaluacionPsiquiatrica = this.asignacionValores0Y1CamposSiYNo(this.dataFormulario3.evaluacionPsiquiatrica);
      this.dataFormulario3.evaluacionPsiquiatrica = typeof evaluacionPsiquiatrica === 'number' ? !!evaluacionPsiquiatrica : evaluacionPsiquiatrica;
      const diagnosticosPsiquiatricos = this.asignacionValores0Y1CamposSiYNo(this.dataFormulario3.diagnosticosPsiquiatricos);
      this.dataFormulario3.diagnosticosPsiquiatricos = typeof diagnosticosPsiquiatricos === 'number' ? !!diagnosticosPsiquiatricos : diagnosticosPsiquiatricos;
    }
    return this.dataFormulario3;
  }
  reiniciarFormulario3(){
    this.dataFormulario3 = {};
  }

  asignacionValores0Y1CamposSiYNo(valor: boolean | undefined) {
    return typeof valor === 'boolean' ? (valor ? 1 : 0) : (valor === 'si' ? 1 : 0);
  }

}
