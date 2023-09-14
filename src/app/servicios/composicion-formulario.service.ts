import { Injectable } from '@angular/core';
import { Paso1FormularioService } from './paso1-formulario.service';
import { Paso2FormularioService } from './paso2-formulario.service';
import { Paso3FormularioService } from './paso3-formulario.service';
import { Paso4FormularioService } from './paso4-formulario.service';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { LoginService } from './login.service';
import { PacientesService } from './datos.paciente.service';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { Console } from 'console';

@Injectable({
  providedIn: 'root'
})
export class ComposicionFormularioService {
  private paso1Formulario: Paso1FormularioService;
  private paso2Formulario: Paso2FormularioService;
  private paso3Formulario: Paso3FormularioService;
  private paso4Formulario: Paso4FormularioService;

  idUsuario!: number;

  constructor(
    paso1Formulario: Paso1FormularioService,
    paso2Formulario: Paso2FormularioService,
    paso3Formulario: Paso3FormularioService,
    paso4Formulario: Paso4FormularioService,
    private datosUsuarioService: PacientesService,
    private loginService: LoginService,
    private servicio: HttpClient
  ) {
    this.paso1Formulario = paso1Formulario;
    this.paso2Formulario = paso2Formulario;
    this.paso3Formulario = paso3Formulario;
    this.paso4Formulario = paso4Formulario;
  }

  servidor: string = 'http://localhost:3003';

  // TOMA TODOS LOS REGISTROS DE TODOS LOS PASOS DE LOS FORMULARIOS Y LOS ENVIA A LA BASE DE DATOS
  idFicha!: number;
  idPaciente!: number;
  idAntecedente!: number;
  idDieta!: number;
  idInvolucrado!: number;
  idAcompanante!: number;
  idAreaPsiquica!: number;
  idDrogas!: number;
  idGenero!: number;
  idPrendas!: number;

  composicionFormularioIngresar(valor?:string, idFicha?:number): Observable<any> {
    this.loginService.dataUsuario$.subscribe(result => {
      this.idUsuario = result.id_profesional_salud;
    });
    const datosFormulario1 = this.paso1Formulario.getDataFormulario1();
    const datosFormulario2 = this.paso2Formulario.datosModificadosEnvioFormulario2();
    const datosFormulario3 = this.paso3Formulario.datosModificadosEnvioFormulario3();
    const datosFormulario4 = this.paso4Formulario.getDataFormulario4();

    const prendasDisconformidad = this.prendasDisconformidad(
      datosFormulario2?.usoBinder,
      datosFormulario2?.usoTucking,
      datosFormulario2?.usoPacking,
      datosFormulario2?.usoOtro,
      datosFormulario2?.usoNinguno);

    const runPasaporte = datosFormulario1.runPasaportePaciente || '';
    this.datosUsuarioService.dataPacientePorRunTotal(runPasaporte).subscribe(data => {
      this.idFicha = data.ficha.id_ficha_tecnica || null;
      this.idPaciente = data.paciente.id_paciente || null;
      this.idAntecedente = data.antecedentes.id_historia_clinica || null;
      this.idDieta = data.habitosAlimenticios.id_habito_alimenticio || null;
      this.idInvolucrado = data.involucrado.id_persona_involucrada_transicion || null;
      this.idAcompanante = data.acompanante.id_persona_involucrada_transicion || null;
      this.idAreaPsiquica = data.areaPsiquica.id_area_psiquica || null;
      this.idDrogas = data.historialDrogas.id_historial_droga || null;
      this.idGenero = data.historiaGenero.id_historia_identidad_genero || null;
      this.idPrendas = data.dataPrenda || null
    },
    (error) => {
      console.log('');
    }
  );

    const data = {
      fichas: {
        apoyoEscolar: datosFormulario3?.checkHabilitarCampoApoyoEscolaridad,
        judicializacion: datosFormulario4?.checkHabilitarJudializacion,
        detallesApoyo: datosFormulario3?.textoApoyoEscolaridad,
        detallesJudicializacion: datosFormulario4?.textoJudializacion,
        idFicha: this.idFicha
      },
      paciente: {
        rutPaciente: datosFormulario1?.runPasaportePaciente,
        nombrePaciente: datosFormulario1?.nombresPaciente,
        apellidoPaternoPa: datosFormulario1?.apellidoPaternoPaciente,
        apellidoMaternoPa: datosFormulario1?.apellidoMaternoPaciente,
        fechaNacimientoPa: datosFormulario1?.fechaNacimientoPaciente,
        domicilioPaciente: datosFormulario1?.domicilioPaciente,
        telefonoPaciente: datosFormulario1?.numeroTelefonicoPaciente,
        pronombre: datosFormulario1?.pronombrePaciente,
        nombreSocial: datosFormulario1?.nombreSocialPaciente,
        idPaciente: this.idPaciente
      },
      antecedentes: {
        antecedentePerinatales: datosFormulario4?.textoAntecedentesPerinatales,
        antecedenteHospitalizaciones: datosFormulario4?.textoAntecedentesMorbidosHospitalizaciones,
        antecedentesQuirurgicos: datosFormulario4?.textoAntecedentesQuirurgicos,
        antecedentesAlergicos: datosFormulario4?.textoAlergiasFocos,
        antecedentesPni: datosFormulario4?.textoInmunizacionesSegunPNI,
        funcionalidadGenital: datosFormulario4?.textoFuncionalidadGenital,
        antecedentesFamilia: datosFormulario4?.textoAntecedentesFamiliares,
        idAntecedente: this.idAntecedente
      },
      habitos: {
        dieta: datosFormulario3?.alimentacionSeleccionada,
        idDieta: this.idDieta
      },
      involucrado: {
        rutInvolucrado: datosFormulario1?.runPasaporteResponsable,
        nombreInvolucrado: datosFormulario1?.nombresResponsable,
        apellidoPInvolucrado: datosFormulario1?.apellidoPaternoResponsable,
        apellidoMInvolucrado: datosFormulario1?.apellidoMaternoResponsable,
        parentescoInvolucrado: null,
        telefonoInvolucrado: datosFormulario1?.numeroTelefonicoResponsable,
        domicilioInvolucrado: datosFormulario1?.domicilioResponsable,
        fechaNacimiento: datosFormulario1?.fechaNacimientoResponsable,
        idInvolucrado: this.idInvolucrado
      },
      acompanante: {
        rutInvolucrado: datosFormulario1?.runPasaporteAcompaniante,
        nombreInvolucrado: datosFormulario1?.nombresAcompaniante,
        apellidoPInvolucrado: datosFormulario1?.apellidoPaternoAcompaniante,
        apellidoMInvolucrado: datosFormulario1?.apellidoMaternoAcompaniante,
        parentescoInvolucrado: datosFormulario1?.parentescoAcompaniante,
        telefonoInvolucrado: datosFormulario1?.numeroTelefonicoAcompaniante,
        domicilioInvolucrado: null,
        fechaNacimiento: null,
        idAcompanante: this.idAcompanante
      },
      areaPsiquica: {
        controlEquipoSaludMental: datosFormulario3?.controlEquipoSaludMental,
        psicoterapia: datosFormulario3?.psicoterapia,
        evaluacionPsiquica: datosFormulario3?.evaluacionPsiquiatrica,
        diagnosticoPsiquiatrico: datosFormulario3?.diagnosticosPsiquiatricos,
        utilizacionFarmaco: datosFormulario3?.checkHabilitarCampoFarmaco,
        detallesFarmacos: datosFormulario3?.textoFarmacos,
        idAreaPsiquica: this.idAreaPsiquica
      },
      historialDrogas: {
        usoDrogas: datosFormulario3?.checkHabilitarCampoDrogas,
        detallesDrogas: datosFormulario3?.textoDrogas,
        idDrogas: this.idDrogas
      },
      genero: {
        identidadGenero: datosFormulario2?.generoSeleccionado,
        orientacionSexual: datosFormulario2?.orientacionSexualSeleccionada,
        autoPercepcion: datosFormulario2?.valorRangoAutopercepción,
        inicioTransicioSexual: datosFormulario2?.inicioTransicion,
        tiempoLatencia: datosFormulario2?.tiempoLatencia,
        apoyoFamiliar: datosFormulario2?.apoyoFamiliar,
        usoPrenda: true,
        presenciaDisforia: datosFormulario2?.checkHabilitarCampoDisforia,
        detallesDiforia: datosFormulario2?.textoElementosDisforia,
        idGenero: this.idGenero
      },
      prendas: {
        prenda: prendasDisconformidad,
        idPrenda: null
      }
    };
    if(valor === "finalizar"){
      return this.servicio.post(`${this.servidor}/api/v1/form/guardaryfinalizar/${this.idUsuario}/?nivel=2&idFicha=${idFicha}`, data);
    }
    return this.servicio.post(`${this.servidor}/api/v1/form/ingresar/${this.idUsuario}/?nivel=2`, data);
  }

prendasDisconformidad(
  binder: boolean | undefined,
  tucking: boolean | undefined,
  packing: boolean | undefined,
  usoOtro: boolean | undefined,
  usoNinguno: boolean | undefined
): number[] {
  let arrayPrendas: any[] = [];

  if (binder === true) {
    arrayPrendas.push(1);
  }else{
    arrayPrendas.push(undefined);
  }
  if (tucking === true) {
    arrayPrendas.push(2);
  }else{
    arrayPrendas.push(undefined);
  }
  if (packing === true) {
    arrayPrendas.push(3);
  }else{
    arrayPrendas.push(undefined);
  }
  if (usoOtro === true) {
    arrayPrendas.push(4);
  }else{
    arrayPrendas.push(undefined);
  }
  if (usoNinguno === true) {
    arrayPrendas.push(5);
  }else{
    arrayPrendas.push(undefined);
  }
  return arrayPrendas;
}


  composicionFormularioActualizar(valor?:string, idFicha?:number): Observable<any> {
    this.loginService.dataUsuario$.subscribe(result => {
      this.idUsuario = result.id_profesional_salud;
    });

    const datosFormulario1 = this.paso1Formulario.getDataFormulario1();
    const datosFormulario2 = this.paso2Formulario.datosModificadosEnvioFormulario2();
    const datosFormulario3 = this.paso3Formulario.datosModificadosEnvioFormulario3();
    const datosFormulario4 = this.paso4Formulario.getDataFormulario4();

    const prendasDisconformidad = datosFormulario2 ? this.prendasDisconformidad(datosFormulario2.usoBinder, datosFormulario2.usoTucking, datosFormulario2.usoPacking, datosFormulario2.usoOtro, datosFormulario2.usoNinguno) : null;
    const runPasaporte = datosFormulario1.runPasaportePaciente || '';

    return this.datosUsuarioService.dataPacientePorRunTotal(runPasaporte).pipe(
      switchMap(data => {
        const idFicha = data.ficha.id_ficha_tecnica || null;
        const idPaciente = data.paciente.id_paciente || null;
        const idAntecedente = data.antecedentes.id_historia_clinica || null;
        const idDieta = data.habitosAlimenticios.id_habito_alimenticio || null;
        const idInvolucrado = data.involucrado.id_persona_involucrada_transicion || null;
        const idAcompanante = data.acompanante.id_persona_involucrada_transicion || null;
        const idAreaPsiquica = data.areaPsiquica.id_area_psiquica || null;
        const idDrogas = data.historialDrogas.id_historial_droga || null;
        const idGenero = data.historiaGenero.id_historia_identidad_genero || null;
        const idPrenda = [[data.dataPrenda[0].id_prenda_n_n],[data.dataPrenda[1].id_prenda_n_n],[data.dataPrenda[2].id_prenda_n_n],[data.dataPrenda[3].id_prenda_n_n],[data.dataPrenda[4].id_prenda_n_n]]

        const dataToSend = {
          fichas: {
            apoyoEscolar: datosFormulario3?.checkHabilitarCampoApoyoEscolaridad,
            judicializacion: datosFormulario4.checkHabilitarJudializacion,
            detallesApoyo: datosFormulario3?.textoApoyoEscolaridad,
            detallesJudicializacion: datosFormulario4.textoJudializacion,
            idFicha: idFicha
          },
          paciente: {
            rutPaciente: datosFormulario1?.runPasaportePaciente,
            nombrePaciente: datosFormulario1?.nombresPaciente,
            apellidoPaternoPa: datosFormulario1?.apellidoPaternoPaciente,
            apellidoMaternoPa: datosFormulario1?.apellidoMaternoPaciente,
            fechaNacimientoPa: datosFormulario1?.fechaNacimientoPaciente,
            domicilioPaciente: datosFormulario1?.domicilioPaciente,
            telefonoPaciente: datosFormulario1?.numeroTelefonicoPaciente,
            pronombre: datosFormulario1?.pronombrePaciente,
            nombreSocial: datosFormulario1?.nombreSocialPaciente,
            idPaciente: idPaciente
          },
          antecedentes: {
            antecedentePerinatales: datosFormulario4?.textoAntecedentesPerinatales,
            antecedenteHospitalizaciones: datosFormulario4?.textoAntecedentesMorbidosHospitalizaciones,
            antecedentesQuirurgicos: datosFormulario4?.textoAntecedentesQuirurgicos,
            antecedentesAlergicos: datosFormulario4?.textoAlergiasFocos,
            antecedentesPni: datosFormulario4?.textoInmunizacionesSegunPNI,
            funcionalidadGenital: datosFormulario4?.textoFuncionalidadGenital,
            antecedentesFamilia: datosFormulario4?.textoAntecedentesFamiliares,
            idAntecedente: idAntecedente
          },
          habitos: {
            dieta: datosFormulario3?.alimentacionSeleccionada,
            idDieta: idDieta
          },
          involucrado: {
            rutInvolucrado: datosFormulario1?.runPasaporteResponsable,
            nombreInvolucrado: datosFormulario1?.nombresResponsable,
            apellidoPInvolucrado: datosFormulario1?.apellidoPaternoResponsable,
            apellidoMInvolucrado: datosFormulario1?.apellidoMaternoResponsable,
            parentescoInvolucrado: null,
            telefonoInvolucrado: datosFormulario1?.numeroTelefonicoResponsable,
            domicilioInvolucrado: datosFormulario1?.domicilioResponsable,
            fechaNacimiento: datosFormulario1?.fechaNacimientoResponsable,
            idInvolucrado: idInvolucrado
          },
          acompanante: {
            rutInvolucrado: datosFormulario1?.runPasaporteAcompaniante,
            nombreInvolucrado: datosFormulario1?.nombresAcompaniante,
            apellidoPInvolucrado: datosFormulario1?.apellidoPaternoAcompaniante,
            apellidoMInvolucrado: datosFormulario1?.apellidoMaternoAcompaniante,
            parentescoInvolucrado: datosFormulario1?.parentescoAcompaniante,
            telefonoInvolucrado: datosFormulario1?.numeroTelefonicoAcompaniante,
            domicilioInvolucrado: null,
            fechaNacimiento: null,
            idAcompanante: idAcompanante
          },
          areaPsiquica: {
            controlEquipoSaludMental: datosFormulario3?.controlEquipoSaludMental,
            psicoterapia: datosFormulario3?.psicoterapia,
            evaluacionPsiquica: datosFormulario3?.evaluacionPsiquiatrica,
            diagnosticoPsiquiatrico: datosFormulario3?.diagnosticosPsiquiatricos,
            utilizacionFarmaco: datosFormulario3?.checkHabilitarCampoFarmaco,
            detallesFarmacos: datosFormulario3?.textoFarmacos,
            idAreaPsiquica: idAreaPsiquica
          },
          historialDrogas: {
            usoDrogas: datosFormulario3?.checkHabilitarCampoDrogas,
            detallesDrogas: datosFormulario3?.textoDrogas,
            idDrogas: idDrogas
          },
          genero: {
            identidadGenero: datosFormulario2?.generoSeleccionado,
            orientacionSexual: datosFormulario2?.orientacionSexualSeleccionada,
            autoPercepcion: datosFormulario2?.valorRangoAutopercepción,
            inicioTransicioSexual: datosFormulario2?.inicioTransicion,
            tiempoLatencia: datosFormulario2?.tiempoLatencia,
            apoyoFamiliar: datosFormulario2?.apoyoFamiliar,
            usoPrenda: true,
            presenciaDisforia: datosFormulario2?.checkHabilitarCampoDisforia,
            detallesDiforia: datosFormulario2?.textoElementosDisforia,
            idGenero: idGenero
          },
          prendas: {
            prenda: prendasDisconformidad,
            idPrenda: idPrenda
          }
        };
        if(valor === "finalizar"){
          return this.servicio.post(`${this.servidor}/api/v1/form/guardaryfinalizar/${this.idUsuario}/?nivel=2&idFicha=${idFicha}`, dataToSend);
        }
        return this.servicio.post(`${this.servidor}/api/v1/form/ingresar/${this.idUsuario}/?nivel=2`, dataToSend);

      })
    );
  }



}

