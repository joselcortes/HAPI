import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PacientesService } from 'src/app/servicios/datos.paciente.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Formulario1Datos, Formulario2Datos, Formulario3Datos, Formulario4Datos } from 'src/app/dashboard/interfaces/formularios';
import { FormularioService } from 'src/app/servicios/formulario.service';
import { DatosUsuariosService } from 'src/app/servicios/apis.service';
import { ConfirmEventType, ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Paso1FormularioService } from 'src/app/servicios/paso1-formulario.service';
import { FuncionalidadElementosService } from 'src/app/servicios/funcionalidad-elementos.service';
import { ComposicionFormularioService } from 'src/app/servicios/composicion-formulario.service';
import { Paso2FormularioService } from 'src/app/servicios/paso2-formulario.service';
import { Paso3FormularioService } from 'src/app/servicios/paso3-formulario.service';
import { Paso4FormularioService } from 'src/app/servicios/paso4-formulario.service';

@Component({
   selector: 'app-paso1',
   templateUrl: './paso1.component.html',
   styleUrls: ['./paso1.component.css']
})
export class Paso1Component implements OnInit {
   form!: FormGroup;
   cargandoDatos = false
   datos!: Formulario1Datos;
   historiaGenero: any;
   areaPsiquica: any;
   historialDrogas: any;
   antecedentes: any;
   ficha: any;
   confirmarGuardar = 'custom-confirm';
   informacionPaciente: any;
   idFicha!: number;
   comprobacion: boolean = false;
   rutPaciente!:any;
   validarRutSiguiente:boolean = false;

   constructor(
      private router: Router,
      public fb: FormBuilder,
      private formularioService: Paso1FormularioService,
      private toast: MessageService,
      public ApiUsuarios: DatosUsuariosService,
      public pacientesService: PacientesService,
      private confirmationService: ConfirmationService,
      private messageService: MessageService,
      private serviceCerrarModal: FuncionalidadElementosService,
      private composicionFormulario: ComposicionFormularioService,
      private ser: FormularioService,
      private paso2formulario: Paso2FormularioService,
      private paso3formulario: Paso3FormularioService,
      private paso4formulario: Paso4FormularioService,
      private aRouter: ActivatedRoute
   ) {

      this.idFicha = parseInt(localStorage.getItem("idFicha") as string);
      this.rutPaciente = aRouter.snapshot.paramMap.get('rut');

      this.form = this.fb.group({
         runPasaportePaciente: ['', ''],
         nombresPaciente: ['', ''],
         apellidoPaternoPaciente: ['', ''],
         apellidoMaternoPaciente: ['', ''],
         fechaNacimientoPaciente: ['', ''],
         edadPaciente: ['', ''],
         nombreSocialPaciente: ['', ''],
         pronombrePaciente: ['', ''],
         domicilioPaciente: ['', ''],
         numeroTelefonicoPaciente: ['', ''],
         runPasaporteResponsable: ['', ''],
         nombresResponsable: ['', ''],
         apellidoPaternoResponsable: ['', ''],
         apellidoMaternoResponsable: ['', ''],
         fechaNacimientoResponsable: ['', ''],
         edadResponsable: ['', ''],
         domicilioResponsable: ['', ''],
         numeroTelefonicoResponsable: ['', ''],
         runPasaporteAcompaniante: ['', ''],
         nombresAcompaniante: ['', ''],
         apellidoPaternoAcompaniante: ['', ''],
         apellidoMaternoAcompaniante: ['', ''],
         parentescoAcompaniante: ['', ''],
         numeroTelefonicoAcompaniante: ['', ''],
      })
      this.calcularEdadPaciente();
      this.calcularEdadResponsable();

      const limpiarValores = localStorage.getItem('limpiarValoresFormulario1');

      if (limpiarValores === 'true') {
      this.form.reset()
      }
   }

   validacionesCamposVacios(){
    if (this.form.value.runPasaportePaciente === null) {
      this.toast.add({ severity: 'error', summary: 'Error', detail: 'NINGÚN RUN INGRESADO.' });
    }
    else if(this.form.value.nombresPaciente === null) {
      this.toast.add({ severity: 'error', summary: 'Error', detail: 'El campo de nombre no puede estar vacio' });
    }
    else if(this.form.value.apellidoPaternoPaciente === null) {
      this.toast.add({ severity: 'error', summary: 'Error', detail: 'El campo de apellido paterno no puede estar vacio' });
    }
    else if (this.form.value.runPasaportePaciente === this.form.value.runPasaporteResponsable && this.form.value.runPasaportePaciente != '') {
        this.toast.add({ severity: 'error', summary: 'Error', detail: 'PACIENTE Y RESPONSABLE TIENEN MISMO RUN.' });
    } else if (this.form.value.runPasaportePaciente === this.form.value.runPasaporteAcompaniante && this.form.value.runPasaportePaciente != '') {
        this.toast.add({ severity: 'error', summary: 'Error', detail: 'PACIENTE Y ACOMPAÑANTE TIENEN MISMO RUN.' });
    }else if(this.form.value.fechaNacimientoPaciente === null){
      this.toast.add({ severity: 'error', summary: 'Error', detail: 'El campo de fecha de nacimiento no puede estar vacio' });
    }else{
      return true;
    }
    return false
   }
   guardarInformacionPacienteFormulario1() {
    if (!this.validarRun(this.form.value.runPasaportePaciente)) {
      this.toast.add({ severity: 'error', summary: 'Error', detail: 'RUN INGRESADO NO VÁLIDO' });
      return;
    }
    if( this.validacionesCamposVacios() === true){
         const formValues = this.form.value;
         this.formularioService.setDataFormulario1(formValues);
         this.router.navigate(['paciente/identidad-genero']);
      }
   }

   ngOnInit() {
      this.agregarGuionSeparadorRut();
      //ASIGNA LOS VALORES A LOS INPUTS
      this.datos = this.formularioService.getDataFormulario1();
      if (this.datos != undefined) {
         for (const control in this.form.controls) {
            if (this.form.controls.hasOwnProperty(control) && this.datos.hasOwnProperty(control)) {
               if (control === 'fechaNacimientoPaciente' || control === 'fechaNacimientoResponsable') {
                  const fecha = this.datos[control as keyof Formulario1Datos];
                  if (control === 'fechaNacimientoPaciente') {
                     this.form.controls['fechaNacimientoPaciente'].setValue(fecha);
                  }
                  if (control === 'fechaNacimientoResponsable') {
                     this.form.controls['fechaNacimientoResponsable'].setValue(fecha);
                  }

               } else {
                  this.form.controls[control].setValue(this.datos[control as keyof Formulario1Datos]);
               }
            }
         }
         this.calcularEdadPaciente();
         this.calcularEdadResponsable();
      }

   }

   registrosBaseDeDatos() {
    try {
      this.pacientesService.dataPacientePorRunTotal(this.form.value.runPasaportePaciente).subscribe({
        next: (datos) => {
          localStorage.setItem('usuarioEncontrado', 'true');
          this.informacionPaciente = datos;

          localStorage.setItem("idFicha", this.informacionPaciente.ficha.id_ficha_tecnica);

          this.historiaGenero = this.informacionPaciente.historiaGenero;
          this.areaPsiquica = this.informacionPaciente.areaPsiquica;
          this.historialDrogas = this.informacionPaciente.historialDrogas;
          this.antecedentes = this.informacionPaciente.antecedentes;
          this.ficha = this.informacionPaciente.ficha;

          this.form.controls['runPasaportePaciente'].setValue(this.informacionPaciente.paciente.rut_paciente);
          this.form.controls['nombresPaciente'].setValue(this.informacionPaciente.paciente.nombre_paciente);
          this.form.controls['apellidoPaternoPaciente'].setValue(this.informacionPaciente.paciente.apellido_paterno_paciente);
          this.form.controls['apellidoMaternoPaciente'].setValue(this.informacionPaciente.paciente.apellido_materno_paciente);
          this.form.controls['fechaNacimientoPaciente'].setValue(this.informacionPaciente.paciente.fecha_nacimiento_paciente?.slice(0, 10));
          this.form.controls['nombreSocialPaciente'].setValue(this.informacionPaciente.paciente.nombre_social);
          this.form.controls['pronombrePaciente'].setValue(this.informacionPaciente.paciente.pronombre);
          this.form.controls['domicilioPaciente'].setValue(this.informacionPaciente.paciente.domicilio_paciente);
          this.form.controls['numeroTelefonicoPaciente'].setValue(this.informacionPaciente.paciente.telefono_paciente);
          this.form.controls['runPasaporteResponsable'].setValue(this.informacionPaciente.involucrado.rut_persona_involucrada);
          this.form.controls['nombresResponsable'].setValue(this.informacionPaciente.involucrado.nombres_persona_involucrada);
          this.form.controls['apellidoPaternoResponsable'].setValue(this.informacionPaciente.involucrado.apellido_paterno_persona_involucrada);
          this.form.controls['apellidoMaternoResponsable'].setValue(this.informacionPaciente.involucrado.apellido_materno_persona_involucrada);
          this.form.controls['fechaNacimientoResponsable'].setValue(this.informacionPaciente.involucrado.fecha_nacimiento_persona_involucrada?.slice(0, 10));
          this.form.controls['domicilioResponsable'].setValue(this.informacionPaciente.involucrado.domicilio_persona_involucrada);
          this.form.controls['numeroTelefonicoResponsable'].setValue(this.informacionPaciente.involucrado.telefono_persona_involucrada);
          this.form.controls['runPasaporteAcompaniante'].setValue(this.informacionPaciente.acompanante.rut_persona_involucrada);
          this.form.controls['nombresAcompaniante'].setValue(this.informacionPaciente.acompanante.nombres_persona_involucrada);
          this.form.controls['apellidoPaternoAcompaniante'].setValue(this.informacionPaciente.acompanante.apellido_paterno_persona_involucrada);
          this.form.controls['apellidoMaternoAcompaniante'].setValue(this.informacionPaciente.acompanante.apellido_materno_persona_involucrada);
          this.form.controls['parentescoAcompaniante'].setValue(this.informacionPaciente.acompanante.parentesco_persona_involucrada);
          this.form.controls['numeroTelefonicoAcompaniante'].setValue(this.informacionPaciente.acompanante.telefono_persona_involucrada);
          //SE CALCULA LA EDAD EN RIGOR AL VALOR DEVUELTO DESDE LA DB
          this.form.controls['edadPaciente'].setValue(this.calcularEdadPacienteBaseDato());
          this.form.controls['edadResponsable'].setValue(this.calcularEdadResponsableBaseDato());

          /*SE ASIGNAN VALORES EN EL LOCALSTORAGE, PARA INDICAR QUE EL USUARIO SE ENCUENTRA
          Y QUE LOS CAMPOS DE LAS OTRAS VISTAS TAMBIEN SE RELLENEN*/
          this.formularioService.setDataFormulario1(this.form.value);
          localStorage.setItem('usuarioEncontrado', 'true');
          localStorage.setItem('rutPaciente', `${this.form.value.runPasaportePaciente}`)
          localStorage.setItem('paso1', 'true');
          localStorage.setItem('paso2', 'true');
          localStorage.setItem('paso3', 'true');
          localStorage.setItem('paso4', 'true');

          /*SE ASIGNAN DE INMEDIATO LOS DATOS DE LAS OTRAS VISTAS DEL FORMULARIO POR SI SE QUIERE GUARDAR DESDE AQUI*/
          const datosForm2: Formulario2Datos = {};
          datosForm2.generoSeleccionado = this.historiaGenero.identidad_genero;
          datosForm2.orientacionSexualSeleccionada = this.historiaGenero.orientacion_sexual;
          datosForm2.inicioTransicion = this.historiaGenero.inicio_transicion_sexual;
          datosForm2.tiempoLatencia = this.historiaGenero.tiempo_latencia;
          datosForm2.valorRangoAutopercepción = this.historiaGenero.autopercepcion;
          datosForm2.usoBinder = this.informacionPaciente.dataPrenda[0].fk_prenda_disconformidad !== null ? true : false;
          datosForm2.usoTucking = this.informacionPaciente.dataPrenda[1].fk_prenda_disconformidad !== null ? true : false;
          datosForm2.usoPacking = this.informacionPaciente.dataPrenda[2].fk_prenda_disconformidad !== null ? true : false;
          datosForm2.usoOtro = this.informacionPaciente.dataPrenda[3].fk_prenda_disconformidad !== null ? true : false;
          datosForm2.usoNinguno = this.informacionPaciente.dataPrenda[4].fk_prenda_disconformidad !== null ? true : false;
          datosForm2.apoyoFamiliar = this.historiaGenero.apoyo_nucleo_familiar;
          datosForm2.textoElementosDisforia = this.historiaGenero.detalles_diforia;
          datosForm2.checkHabilitarCampoDisforia = this.historiaGenero.presencia_disforia;
          this.paso2formulario.setDataFormulario2(datosForm2);

          const datosForm3: Formulario3Datos = {};
          datosForm3.textoFarmacos = this.areaPsiquica.detalles_farmacos;
          datosForm3.checkHabilitarCampoFarmaco = this.areaPsiquica.utilizacion_farmaco;
          datosForm3.textoApoyoEscolaridad = this.ficha.detalles_apoyo_es;
          datosForm3.checkHabilitarCampoApoyoEscolaridad = this.ficha.apoyo_escolar;
          datosForm3.textoDrogas = this.historialDrogas.detalles_uso_droga;
          datosForm3.checkHabilitarCampoDrogas = this.historialDrogas.uso_droga;
          datosForm3.alimentacionSeleccionada = this.informacionPaciente.habitosAlimenticios.detalle_habito_alimenticio;
          datosForm3.controlEquipoSaludMental = this.areaPsiquica.control_equipo_salud_mental;
          datosForm3.psicoterapia = this.areaPsiquica.psicoterapia
          datosForm3.evaluacionPsiquiatrica = this.areaPsiquica.evaluacion_psiquica
          datosForm3.diagnosticosPsiquiatricos = this.areaPsiquica.diagnostico_psiquiatrico
          this.paso3formulario.setDataFormulario3(datosForm3);

          const datosForm4: Formulario4Datos = {};
          datosForm4.textoAntecedentesPerinatales = this.antecedentes.detalles_antecedentes_perinatales;
          datosForm4.textoAntecedentesMorbidosHospitalizaciones = this.antecedentes.detalles_antecedentes_hospitalizaciones;
          datosForm4.textoAntecedentesQuirurgicos = this.antecedentes.detalles_antecedentes_quirurgicos;
          datosForm4.textoAlergiasFocos = this.antecedentes.detalles_antecedentes_alergicos;
          datosForm4.textoInmunizacionesSegunPNI = this.antecedentes.detalles_antecedentes_pni;
          datosForm4.textoFuncionalidadGenital = this.antecedentes.detalles_funcionalidad_genital;
          datosForm4.textoAntecedentesFamiliares = this.antecedentes.detalles_antecedentes_familia;
          datosForm4.textoJudializacion = this.ficha.detalles_judicializacion;
          datosForm4.checkHabilitarJudializacion = this.ficha.judicializacion;
          this.paso4formulario.setDataFormulario4(datosForm4);
       },
       error:(error) => {
         console.log('errrrrr',error);
          // CONSULTA LA API SI EL USUARIO NO ESTA REGISTRADO
          this.consultaApiPaciente();
       },
       complete(){}
      });
    } catch (error) {
      console.log(error);
    }

   }

   async consultaApiPaciente() {
      if (!this.form.value.runPasaportePaciente) {
         this.toast.add({ severity: 'error', summary: 'Error', detail: 'NINGÚN RUN INGRESADO' });
         return;
      }

      if (!this.validarRun(this.form.value.runPasaportePaciente)) {
         this.toast.add({ severity: 'error', summary: 'Error', detail: 'RUN INGRESADO NO VÁLIDO' });
         return;
      }

      this.cargandoDatos = true;
      let timer: any;
      timer = setTimeout(() => {
         this.toast.add({ severity: 'warn', summary: 'Error', detail: 'EL USUARIO NO SE ENCUENTRA' });
         this.cargandoDatos = false;
         this.limpiarValoresFormularioPaciente();
      }, 10000);

      const rut = this.form.value.runPasaportePaciente;
      const separador = rut.split('-');
      const numero = separador[0];
      const digitoVerificador = separador[1];

      try {
         const datos = await this.ApiUsuarios.obtenerPacienteAPI(this.form.value.runPasaportePaciente).toPromise() ||
            await this.ApiUsuarios.obtenerPacienteFonasa({ rut: numero, identificador: digitoVerificador }).toPromise();

         clearTimeout(timer);

         if (datos) {
            const controls = this.form.controls;
            controls['nombresPaciente'].setValue(datos.nombre);
            controls['apellidoPaternoPaciente'].setValue(datos.apellido_paterno);
            controls['apellidoMaternoPaciente'].setValue(datos.apellido_materno);
            controls['numeroTelefonicoPaciente'].setValue(datos.telefono);
            controls['fechaNacimientoPaciente'].setValue(datos.fecha_nacimiento);
            controls['nombreSocialPaciente'].setValue('');
            controls['pronombrePaciente'].setValue('');
            controls['domicilioPaciente'].setValue('');
            controls['numeroTelefonicoPaciente'].setValue('');
            this.calcularEdadPaciente();
         } else {
            this.toast.add({ severity: 'warn', summary: 'Algo Fallo', detail: 'El usuario no se encuentra' });
            this.limpiarValoresFormularioPaciente();
         }
      } catch (error) {
         this.toast.add({ severity: 'error', summary: 'Error', detail: 'Error al consultar la API' });
         this.limpiarValoresFormularioPaciente();
      } finally {
         this.cargandoDatos = false;
      }
   }

   async consultaApiResponsable() {
      if (!this.form.value.runPasaporteResponsable) {
         this.toast.add({ severity: 'error', summary: 'Error', detail: 'Ningún rut ingresado' });
         return;
      }
      if (!this.validarRun(this.form.value.runPasaporteResponsable)) {
         this.toast.add({ severity: 'error', summary: 'Error', detail: 'Run ingresado no válido' });
         return;
      }
      this.cargandoDatos = true;
      let timer: any;
      timer = setTimeout(() => {
         this.toast.add({ severity: 'warn', summary: 'Error', detail: 'El usuario no se encuentra' });
         this.limpiarValoresFormularioResponsable();
         this.cargandoDatos = false;
      }, 10000);

      const rut = this.form.value.runPasaporteResponsable;
      const separador = rut.split('-');
      const numero = separador[0]
      const digitoVerificador = separador[1];

      try {
         const data = await this.ApiUsuarios.obtenerPacienteAPI(this.form.value.runPasaporteResponsable).toPromise() || await this.ApiUsuarios.obtenerPacienteFonasa({ rut: numero, identificador: digitoVerificador }).toPromise();
         clearTimeout(timer);
         if (data) {
            this.form.controls['nombresResponsable'].setValue(data.nombre);
            this.form.controls['apellidoPaternoResponsable'].setValue(data.apellido_paterno);
            this.form.controls['apellidoMaternoResponsable'].setValue(data.apellido_materno);
            this.form.controls['numeroTelefonicoResponsable'].setValue(data.telefono);
            this.form.controls['fechaNacimientoResponsable'].setValue(data.fecha_nacimiento);
            this.form.controls['domicilioResponsable'].setValue(data.direccion);
            this.calcularEdadResponsable();
         } else {
            this.toast.add({ severity: 'warn', summary: 'Error', detail: 'El usuario no se encuentra' });
            this.limpiarValoresFormularioResponsable();
         }
      } catch (error) {
         this.toast.add({ severity: 'error', summary: 'Error', detail: 'Error al consultar la API' });
         this.limpiarValoresFormularioResponsable();
      } finally {
         this.cargandoDatos = false;
      }
   }

   async consultaApiAcompaniante() {
      if (!this.form.value.runPasaporteAcompaniante) {
         this.toast.add({ severity: 'error', summary: 'Error', detail: 'Ningún rut ingresado' });
         return;
      }
      if (!this.validarRun(this.form.value.runPasaporteAcompaniante)) {
         this.toast.add({ severity: 'error', summary: 'Error', detail: 'Run ingresado no válido' });
         return;
      }
      this.cargandoDatos = true;

      let timer: any;
      timer = setTimeout(() => {
         this.toast.add({ severity: 'warn', summary: 'Error', detail: 'El usuario no se encuentra' });
         this.limpiarValoresFormularioAcompaniante();
         this.cargandoDatos = false;
      }, 10000);

      const rut = this.form.value.runPasaporteAcompaniante;
      const separador = rut.split('-');
      const numero = separador[0]
      const digitoVerificador = separador[1];

      try {
         const dataAcompaniante = await this.ApiUsuarios.obtenerPacienteAPI(this.form.value.runPasaporteAcompaniante).toPromise() || await this.ApiUsuarios.obtenerPacienteFonasa({ rut: numero, identificador: digitoVerificador }).toPromise();
         clearTimeout(timer);
         if (dataAcompaniante) {
            this.form.controls['nombresAcompaniante'].setValue(dataAcompaniante.nombre);
            this.form.controls['apellidoPaternoAcompaniante'].setValue(dataAcompaniante.apellido_paterno);
            this.form.controls['apellidoMaternoAcompaniante'].setValue(dataAcompaniante.apellido_materno);
         } else {
            this.toast.add({ severity: 'warn', summary: 'Algo Fallo', detail: 'El usuario no se encuentra' });
            this.limpiarValoresFormularioAcompaniante();
         }
      } catch (error) {
         this.toast.add({ severity: 'error', summary: 'Error', detail: 'Error al consultar la API' });
         this.limpiarValoresFormularioAcompaniante();
      } finally {
         this.cargandoDatos = false;
      }
   }

   limpiarValoresFormularioPaciente() {
      const controls = this.form.controls;
      controls['nombresPaciente'].setValue('');
      controls['apellidoPaternoPaciente'].setValue('');
      controls['apellidoMaternoPaciente'].setValue('');
      controls['numeroTelefonicoPaciente'].setValue('');
      controls['fechaNacimientoPaciente'].setValue('');
      controls['nombreSocialPaciente'].setValue('');
      controls['pronombrePaciente'].setValue('');
      controls['domicilioPaciente'].setValue('');
      controls['numeroTelefonicoPaciente'].setValue('');
   }

   limpiarValoresFormularioResponsable() {
      this.form.controls['nombresResponsable'].setValue('');
      this.form.controls['apellidoPaternoResponsable'].setValue('');
      this.form.controls['apellidoMaternoResponsable'].setValue('');
      this.form.controls['domicilioResponsable'].setValue('');
      this.form.controls['numeroTelefonicoResponsable'].setValue('');
      this.form.controls['fechaNacimientoResponsable'].setValue('');
      this.form.controls['edadResponsable'].setValue('');
   }

   limpiarValoresFormularioAcompaniante() {
      this.form.controls['nombresAcompaniante'].setValue('');
      this.form.controls['apellidoPaternoAcompaniante'].setValue('');
      this.form.controls['apellidoMaternoAcompaniante'].setValue('');
      this.form.controls['parentescoAcompaniante'].setValue('');
      this.form.controls['numeroTelefonicoAcompaniante'].setValue('');
   }

   /*SE OCUPAN METODOS DISTINTOS PARA CALCULAR LA EDAD, LOS 2 PRIMEROS PERMITEN CALCULAR LA EDAD EN RIGOR
   AL VALOR DEVUELTO DE LA BASE DE DATOS, LOS OTROS 2 LA CALCULAN A PARTIR DE LOS DATOS BUSCADOS EN LAS API EXTERNAS*/
   calcularEdadPacienteBaseDato() {
      const fechaNacimientoPacienteControl = this.form.controls['fechaNacimientoPaciente'];
      const fechaNacimiento = fechaNacimientoPacienteControl.value;

      if (fechaNacimiento) {
         const partesFecha = fechaNacimiento.split('/');
         const fechaFormateada: string = `${partesFecha[2]}-${partesFecha[1]}-${partesFecha[0]}`;

         const fechaActual = new Date();
         const fechaNacimientoCalculada = new Date(fechaFormateada);

         let edad = fechaActual.getFullYear() - fechaNacimientoCalculada.getFullYear();
         const meses = fechaActual.getMonth() - fechaNacimientoCalculada.getMonth();
         const dias = fechaActual.getDate() - fechaNacimientoCalculada.getDate();

         if (meses < 0 || (meses === 0 && dias < 0)) {
            edad--;
         }
         return edad;
      }
      return undefined;
   }

   calcularEdadResponsableBaseDato() {
      const fechaNacimientoPacienteControl = this.form.controls['fechaNacimientoResponsable'];
      const fechaNacimiento = fechaNacimientoPacienteControl.value;

      if (fechaNacimiento) {
         const partesFecha = fechaNacimiento.split('/');
         const fechaFormateada: string = `${partesFecha[2]}-${partesFecha[1]}-${partesFecha[0]}`;

         const fechaActual = new Date();
         const fechaNacimientoCalculada = new Date(fechaFormateada);

         let edad = fechaActual.getFullYear() - fechaNacimientoCalculada.getFullYear();
         const meses = fechaActual.getMonth() - fechaNacimientoCalculada.getMonth();
         const dias = fechaActual.getDate() - fechaNacimientoCalculada.getDate();

         if (meses < 0 || (meses === 0 && dias < 0)) {
            edad--;
         }
         return edad;
      }
      return undefined;
   }

   calcularEdadPaciente() {
      const fechaNacimientoPacienteControl = this.form.get('fechaNacimientoPaciente');
      fechaNacimientoPacienteControl?.valueChanges.subscribe(value => {
         if (value) {
            const fechaActual = new Date();
            const fechaNacimiento = new Date(value);

            let edadPaciente = fechaActual.getFullYear() - fechaNacimiento.getFullYear();
            const mesActual = fechaActual.getMonth();
            const diaActual = fechaActual.getDate();
            const mesNacimiento = fechaNacimiento.getMonth();
            const diaNacimiento = fechaNacimiento.getDate();

            if (mesActual < mesNacimiento || (mesActual === mesNacimiento && diaActual < diaNacimiento)) {
               edadPaciente--;
            }
            this.form.controls['edadPaciente'].setValue(edadPaciente);
         }
      });
   }

   calcularEdadResponsable() {
      const fechaNacimientoResponsableControl = this.form.get('fechaNacimientoResponsable');
      fechaNacimientoResponsableControl?.valueChanges.subscribe(value => {
         if (value) {
            const fechaActual = new Date();
            const fechaNacimiento = new Date(value);

            let edadResponsable = fechaActual.getFullYear() - fechaNacimiento.getFullYear();
            const mesActual = fechaActual.getMonth();
            const diaActual = fechaActual.getDate();
            const mesNacimiento = fechaNacimiento.getMonth();
            const diaNacimiento = fechaNacimiento.getDate();

            if (mesActual < mesNacimiento || (mesActual === mesNacimiento && diaActual < diaNacimiento)) {
               edadResponsable--;
            }
            this.form.controls['edadResponsable'].setValue(edadResponsable);
         }
      });
   }

   agregarGuionSeparadorRut() {
      const runPasaportePacienteControl = this.form.get('runPasaportePaciente');
      if (runPasaportePacienteControl) {
         runPasaportePacienteControl.valueChanges.subscribe(value => {
            const rut = value?.replace(/[^0-9kK]+/g, '');
            if (rut) {
               const rutFormatted = rut.slice(0, -1) + '-' + rut.slice(-1);
               runPasaportePacienteControl.setValue(rutFormatted, { emitEvent: false });
            }
         });
      }

      const runPasaporteResponsableControl = this.form.get('runPasaporteResponsable');
      if (runPasaporteResponsableControl) {
         runPasaporteResponsableControl.valueChanges.subscribe(value => {
            const rut = value?.replace(/[^0-9kK]+/g, '');
            if (rut) {
               const rutFormatted = rut.slice(0, -1) + '-' + rut.slice(-1);
               runPasaporteResponsableControl.setValue(rutFormatted, { emitEvent: false });
            }
         });
      }

      const runPasaporteAcompanianteControl = this.form.get('runPasaporteAcompaniante');
      if (runPasaporteAcompanianteControl) {
         runPasaporteAcompanianteControl.valueChanges.subscribe(value => {
            const rut = value?.replace(/[^0-9kK]+/g, '');
            if (rut) {
               const rutFormatted = rut.slice(0, -1) + '-' + rut.slice(-1);
               runPasaporteAcompanianteControl.setValue(rutFormatted, { emitEvent: false });
            }
         });
      }
   }

   fechaFormatoDiaMesAnio(date: string): string {
      const fecha = new Date(date);
      let dia = fecha.getDate() + 1;
      const mes = fecha.getMonth() + 1;
      const año = fecha.getFullYear();
      const ultimoDiaDelMes = new Date(año, mes, 0).getDate();
      if (dia > ultimoDiaDelMes) {
         dia = ultimoDiaDelMes;
      }
      const fechaFormateada = `${dia}/${mes}/${año}`;
      return fechaFormateada;
   }

   validarRun(run: string): boolean {
      let runValido: boolean = false;
      if (run && /^(\d{1,3}(\d{3})*)\-?([\dkK])$/.test(run.toLowerCase())) {
         let runLimpio = run.replace(/\./g, '').replace('-', '') ?? '';
         let digitoVerificador = runLimpio.charAt(runLimpio.length - 1);
         let runSinDigito = parseInt(runLimpio.substring(0, runLimpio.length - 1));
         let factor = 2;
         let suma = 0;
         for (let i = runSinDigito.toString().length - 1; i >= 0; i--) {
            factor = factor > 7 ? 2 : factor;
            suma += parseInt(runSinDigito.toString().charAt(i)) * factor;
            factor++;
         }
         let digitoCalculado = 11 - (suma % 11);
         runValido = (digitoCalculado === 11 && digitoVerificador === '0') ||
            (digitoCalculado === 10 && (digitoVerificador === 'K' || digitoVerificador === 'k')) ||
            (digitoCalculado === parseInt(digitoVerificador));
      }
      return runValido;
   }

   insertarRegistros() {
    if (!this.validarRun(this.form.value.runPasaportePaciente)) {
      this.toast.add({ severity: 'error', summary: 'Error', detail: 'RUN INGRESADO NO VÁLIDO' });
      return;
    }
      if(this.validacionesCamposVacios()){
        this.confirmationService.confirm({
          message: '¿Desea guardar la consulta?',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
             this.guardar();
          },
          reject: (type: ConfirmEventType) => {
             return 0;
          }
       });
      }
   }

   guardar() {
      const formValues = this.form.value;
      this.formularioService.setDataFormulario1(formValues);

      if (this.form.value.runPasaportePaciente != '' && this.form.value.runPasaportePaciente != '-') {
         if (localStorage.getItem('usuarioEncontrado')) {
            this.composicionFormulario.composicionFormularioActualizar("").subscribe(
               () => {
                  this.toast.add({ severity: 'success', summary: 'Registros Ingresados', detail: 'Los Registros Fueron Ingresados Con Éxito!' });
                  setTimeout(() => {
                     localStorage.removeItem('usuarioEncontrado');
                     localStorage.removeItem('rutPaciente');
                     this.formularioService.reiniciarFormulario1();
                     window.location.reload();
                  }, 2500);
               },
               (error) => {
                  this.toast.add({ severity: 'error', summary: 'Error Al Ingresar Registros', detail: 'Por Favor, Inténtelo De Nuevo.' });
               }
            );
         } else {
            this.composicionFormulario.composicionFormularioIngresar().subscribe(
               () => {
                  this.toast.add({ severity: 'success', summary: 'Registros Ingresados', detail: 'Los Registros Fueron Ingresados Con Éxito!' });
                  setTimeout(() => {
                     localStorage.removeItem('usuarioEncontrado');
                     localStorage.removeItem('rutPaciente');
                     this.formularioService.reiniciarFormulario1();
                     window.location.reload();
                  }, 2500);
               },
               (error) => {
                  this.toast.add({ severity: 'error', summary: 'Error Al Ingresar Registros', detail: 'Por Favor, Inténtelo De Nuevo.' });
               }
            );
         }
      } else {
         this.toast.add({ severity: 'error', summary: 'Ningún Run Ingresado', detail: 'Por Favor, Inténtelo De Nuevo.' });
      }
   }


   ventanaConfirmacionGuardar() {
      if (this.form.value.runPasaportePaciente != '' && this.form.value.runPasaportePaciente != '-') {
         let confirmed = false;
         this.confirmationService.confirm({
            message: '¿Esta seguro que decea terminar el episodio actual?',
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
               if (!confirmed) {
                  confirmed = true;
                  this.insertarRegistros();
               }
            },
            reject: (type: any) => {
               if (!confirmed) {
                  confirmed = true;
                  switch (type) {
                     case ConfirmEventType.REJECT:
                        this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Episodio NO Finalizado' });
                        break;
                     case ConfirmEventType.CANCEL:
                        break;
                  }
               }
            }
         });
      } else {
         this.toast.add({ severity: 'error', summary: 'Ningún Run Ingresado', detail: 'Por Favor, Inténtelo De Nuevo.' });
      }
   }
}
