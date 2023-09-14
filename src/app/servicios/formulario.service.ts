import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Formulario1Datos, Formulario2Datos, Formulario3Datos, Formulario4Datos, Formulario5Datos } from '../dashboard/interfaces/formularios';
import { RecopilacionInformacion } from '../dashboard/interfaces/ingreso_paciente';
import { env } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})

export class FormularioService{

  constructor(private servicio: HttpClient) { }
  servidor: string = `${env.url}`;

  finalizarFormulario(idFicha: number){

    return this.servicio.get(`${this.servidor}/form/finalizar/?idFicha=${idFicha}`);

  }
}
