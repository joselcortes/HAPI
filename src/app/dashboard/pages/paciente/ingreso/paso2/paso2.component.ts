import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Formulario2Datos, Formulario3Datos, Formulario4Datos } from 'src/app/dashboard/interfaces/formularios';
import { ConfirmEventType, ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Paso2FormularioService } from 'src/app/servicios/paso2-formulario.service';
import { ComposicionFormularioService } from 'src/app/servicios/composicion-formulario.service';
import { PacientesService } from 'src/app/servicios/datos.paciente.service';
import { Paso3FormularioService } from 'src/app/servicios/paso3-formulario.service';
import { Paso4FormularioService } from 'src/app/servicios/paso4-formulario.service';

@Component({
   selector: 'app-paso2',
   templateUrl: './paso2.component.html',
   styleUrls: ['./paso2.component.css']
})

export class Paso2Component implements OnInit {
   form!: FormGroup;
   textoElementosDisforiaControl!: FormControl;
   checkHabilitarCampoDisforiaControl!: FormControl;
   valorControlRangoAutopercepcion!: FormControl;
   datosFormulario2!: Formulario2Datos;
   generoSeleccionado!: string;
   orientacionSexualSeleccionada!: string;
   informacionPaciente!: any;
   apoyoFamiliarValor!: any;
   areaPsiquica!: any;
   historialDrogas!: any;
   ficha!: any;
   antecedentes!: any
   confirmarGuardar = 'custom-confirm';

   constructor(
      private router: Router,
      private formularioService: Paso2FormularioService,
      public fb: FormBuilder,
      private confirmationService: ConfirmationService,
      private toast: MessageService,
      private composicionFormulario: ComposicionFormularioService,
      public pacientesService: PacientesService,
      private paso3formulario: Paso3FormularioService,
      private paso4formulario: Paso4FormularioService
   ) {
      this.form = this.fb.group({
         generoSeleccionado: ['', ''],
         orientacionSexualSeleccionada: ['', ''],
         inicioTransicion: ['', ''],
         tiempoLatencia: ['', ''],
         valorRangoAutopercepción: ['50', ''],
         usoBinder: ['', ''],
         usoTucking: ['', ''],
         usoPacking: ['', ''],
         usoOtro: ['', ''],
         usoNinguno: ['', ''],
         apoyoFamiliar: [null],
         textoElementosDisforia: [{ value: '', disabled: true }],
         checkHabilitarCampoDisforia: [false]
      })

      this.activarDesactivarTextosCondicionales();

   }

   guardarInformacionPacienteFormulario2() {
      const formValues = this.form.value;
      formValues.tiempoLatencia = this.form.value.tiempoLatencia;
      formValues.inicioTransicion = this.form.value.inicioTransicion;
      formValues.generoSeleccionado = this.form.value.generoSeleccionado;
      formValues.orientacionSexualSeleccionada = this.form.value.orientacionSexualSeleccionada
      this.formularioService.setDataFormulario2(formValues);
      this.router.navigate(['paciente/area-psiquica']);
   }

   ngOnInit() {
      const usuarioEncontrado = localStorage.getItem('paso2');
      const isEjecutado = usuarioEncontrado === 'true' ? true : false;
      const savedData = this.formularioService.getDataFormulario2();
      if (!isEjecutado) {
         this.form.patchValue(savedData);
      } else {
         this.registrosBaseDeDatos();
      }
      this.valorControlRangoAutopercepcion = this.form.get('valorRangoAutopercepción') as FormControl;
   }

   prevPage() {
      const valoresFormulario = this.form.value;
      this.formularioService.setDataFormulario2(valoresFormulario)
      this.router.navigate(['paciente/informacion-personal']);
   }

   insertarRegistros() {
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

   activarDesactivarTextosCondicionales(){
      this.form.get('checkHabilitarCampoDisforia')?.valueChanges.subscribe((value: boolean) => {
         if (value) {
            this.form.get('textoElementosDisforia')?.enable();
         } else {
            this.form.get('textoElementosDisforia')?.disable();
         }
      });
   }

   guardar() {
      const formValues = this.form.value;
      formValues.tiempoLatencia = this.form.value.tiempoLatencia;
      formValues.inicioTransicion = this.form.value.inicioTransicion;
      this.formularioService.setDataFormulario2(formValues);
      if (localStorage.getItem('paso2')) {
         this.composicionFormulario.composicionFormularioActualizar("").subscribe(
            () => {
               this.toast.add({ severity: 'success', summary: 'Registros Ingresados', detail: 'Los Registros Fueron Ingresados Con Éxito!' });
               this.formularioService.reiniciarFormulario2();
               setTimeout(() => {
                  localStorage.removeItem('usuarioEncontrado');
                  localStorage.removeItem('rutPaciente');
                  this.formularioService.reiniciarFormulario2();
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
                  this.formularioService.reiniciarFormulario2();
                  window.location.reload();
               }, 2500);
            },
            (error) => {
               this.toast.add({ severity: 'error', summary: 'Error Al Ingresar Registros', detail: 'Por Favor, Inténtelo De Nuevo.' });
            }
         );
      }
   }

   registrosBaseDeDatos() {
      const rutPaciente = localStorage.getItem('rutPaciente') ?? '';
      this.pacientesService.dataPacientePorRunTotal(rutPaciente).subscribe((datosPorRut) => {
         this.informacionPaciente = datosPorRut;
         this.areaPsiquica = this.informacionPaciente.areaPsiquica;
         this.historialDrogas = this.informacionPaciente.historialDrogas;
         this.antecedentes = this.informacionPaciente.antecedentes;
         this.ficha = this.informacionPaciente.ficha;

         this.form.controls['generoSeleccionado'].setValue(this.informacionPaciente.historiaGenero.identidad_genero)
         this.form.controls['orientacionSexualSeleccionada'].setValue(this.informacionPaciente.historiaGenero.orientacion_sexual);
         this.form.controls['inicioTransicion'].setValue(this.informacionPaciente.historiaGenero.inicio_transicion_sexual?.slice(0, 10));
         this.form.controls['tiempoLatencia'].setValue(this.informacionPaciente.historiaGenero.tiempo_latencia?.slice(0, 10));
         this.form.controls['valorRangoAutopercepción'].setValue(this.informacionPaciente.historiaGenero.autopercepcion);
         this.form.controls['usoBinder'].setValue(this.informacionPaciente.dataPrenda[0].fk_prenda_disconformidad !== null ? true : false);
         this.form.controls['usoTucking'].setValue(this.informacionPaciente.dataPrenda[1].fk_prenda_disconformidad !== null ? true : false);
         this.form.controls['usoPacking'].setValue(this.informacionPaciente.dataPrenda[2].fk_prenda_disconformidad !== null ? true : false);
         this.form.controls['usoOtro'].setValue(this.informacionPaciente.dataPrenda[3].fk_prenda_disconformidad !== null ? true : false);
         this.form.controls['usoNinguno'].setValue(this.informacionPaciente.dataPrenda[4].fk_prenda_disconformidad !== null ? true : false);
         this.form.controls['textoElementosDisforia'].setValue(this.informacionPaciente.historiaGenero.detalles_diforia);
         this.form.controls['checkHabilitarCampoDisforia'].setValue(this.informacionPaciente.historiaGenero.presencia_disforia === 1 ? 1 : 0);

         const apoyoFamiliar = this.informacionPaciente.historiaGenero.apoyo_nucleo_familiar;
         this.apoyoFamiliarValor = apoyoFamiliar === 1 ? 'si' : 'no';
         this.form.patchValue({
            apoyoFamiliar: this.apoyoFamiliarValor
         });

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
         (error) => {
            console.log('');
         }
      );
   }

}
