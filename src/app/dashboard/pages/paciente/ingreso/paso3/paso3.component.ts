import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Formulario3Datos, Formulario4Datos } from 'src/app/dashboard/interfaces/formularios';
import { FormularioService } from 'src/app/servicios/formulario.service';
import { ConfirmEventType, ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Paso3FormularioService } from 'src/app/servicios/paso3-formulario.service';
import { ComposicionFormularioService } from 'src/app/servicios/composicion-formulario.service';
import { FuncionalidadElementosService } from 'src/app/servicios/funcionalidad-elementos.service';
import { PacientesService } from 'src/app/servicios/datos.paciente.service';
import { Paso4FormularioService } from 'src/app/servicios/paso4-formulario.service';

@Component({
   selector: 'app-paso3',
   templateUrl: './paso3.component.html',
   styleUrls: ['./paso3.component.css']
})
export class Paso3Component implements OnInit {

   form!: FormGroup;
   datosFormulario3!: Formulario3Datos;
   controlEquipoSaludMental: string = '';
   psicoterapia: string = '';
   evaluacionPsiquiatrica: string = '';
   diagnosticosPsiquiatricos: string = '';
   informacionPaciente!: any;
   ficha!: any;
   antecedentes!: any;

   //VARIABLES PARA ACTIVAR O DESACTIVAR CAMPO FARMACOS, DROGAS, APOYO ESCOLARIDAD
   textoFarmacos!: FormControl;
   checkHabilitarCampoFarmacos!: FormControl;
   textoApoyoEscolaridad!: FormControl;
   checkHabilitarCampoEscolaridad!: FormControl;
   textoDrogas!: FormControl;
   checkHabilitarCampoDrogas!: FormControl;
   idFicha!: number;

   constructor(
      private ser: FormularioService,
      private router: Router,
      private formularioService: Paso3FormularioService,
      public fb: FormBuilder,
      private confirmationService: ConfirmationService,
      private composicionFormulario: ComposicionFormularioService,
      private toast: MessageService,
      public pacientesService: PacientesService,
      private paso4formulario: Paso4FormularioService
   ) {
      this.idFicha = parseInt(localStorage.getItem("idFicha") as string);
      this.form = this.fb.group({
         textoFarmacos: [{ value: '', disabled: true }],
         checkHabilitarCampoFarmaco: [false],
         textoApoyoEscolaridad: [{ value: '', disabled: true }],
         checkHabilitarCampoApoyoEscolaridad: [false],
         textoDrogas: [{ value: '', disabled: true }],
         checkHabilitarCampoDrogas: [false],
         alimentacionSeleccionada: ['', ''],
         controlEquipoSaludMental: [],
         psicoterapia: [],
         evaluacionPsiquiatrica: [],
         diagnosticosPsiquiatricos: [],
      })

      this.activarDesactivarTextosCondicionales();

   }

   guardarInformacionPacienteFormulario3() {
      const formValues = this.form.value;
      this.formularioService.setDataFormulario3(formValues);
      this.router.navigate(['paciente/historia-clinica']);
   }

   ngOnInit() {
      localStorage.setItem('paso2', JSON.stringify(false));
      const usuarioEncontrado = localStorage.getItem('paso3');
      const isEjecutado = usuarioEncontrado === 'true' ? true : false;
      const savedData = this.formularioService.getDataFormulario3();
      if (!isEjecutado) {
         this.form.patchValue(savedData);
      } else {
         this.registrosBaseDeDatos();
      }
   }

   prevPage() {
      const valoresFormulario = this.form.value;
      this.formularioService.setDataFormulario3(valoresFormulario)
      this.router.navigate(['paciente/identidad-genero']);
   }

   /*AL RETROCEDER DE STEP, LOS CAMPOS DE TEXTOS CONDICIONALES SE BLOQUEAN,
   ESTE CODIGO EVITA QUE ESO PASE*/
   activarDesactivarTextosCondicionales(){
      this.form.get('checkHabilitarCampoFarmaco')?.valueChanges.subscribe((value: boolean) => {
         if (value) {
           this.form.get('textoFarmacos')?.enable();
         } else {
           this.form.get('textoFarmacos')?.disable();
         }
       });

       this.form.get('checkHabilitarCampoApoyoEscolaridad')?.valueChanges.subscribe((value: boolean) => {
         if (value) {
           this.form.get('textoApoyoEscolaridad')?.enable();
         } else {
           this.form.get('textoApoyoEscolaridad')?.disable();
         }
       });

       this.form.get('checkHabilitarCampoDrogas')?.valueChanges.subscribe((value: boolean) => {
         if (value) {
           this.form.get('textoDrogas')?.enable();
         } else {
           this.form.get('textoDrogas')?.disable();
         }
       });
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

   guardar() {
      const formValues = this.form.value;
      this.formularioService.setDataFormulario3(formValues);

      if (localStorage.getItem('usuarioEncontrado')) {
         this.composicionFormulario.composicionFormularioActualizar("").subscribe(
            () => {
               this.toast.add({ severity: 'success', summary: 'Registros Ingresados', detail: 'Los Registros Fueron Ingresados Con Éxito!' });
               this.formularioService.reiniciarFormulario3();
               setTimeout(() => {
                  localStorage.removeItem('usuarioEncontrado');
                  localStorage.removeItem('rutPaciente');
                  this.formularioService.reiniciarFormulario3();
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
                  this.formularioService.reiniciarFormulario3();
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
         this.antecedentes = this.informacionPaciente.antecedentes;
         this.ficha = this.informacionPaciente.ficha;

         this.form.controls['textoFarmacos'].setValue(this.informacionPaciente.areaPsiquica.detalles_farmacos);
         this.form.controls['checkHabilitarCampoFarmaco'].setValue(this.informacionPaciente.areaPsiquica.utilizacion_farmaco === 1 ? 1 : 0);
         this.form.controls['textoApoyoEscolaridad'].setValue(this.informacionPaciente.ficha.detalles_apoyo_es);
         this.form.controls['checkHabilitarCampoApoyoEscolaridad'].setValue(this.informacionPaciente.ficha.apoyo_escolar === 1 ? 1 : 0);
         this.form.controls['textoDrogas'].setValue(this.informacionPaciente.historialDrogas.detalles_uso_droga);
         this.form.controls['checkHabilitarCampoDrogas'].setValue(this.informacionPaciente.historialDrogas.uso_droga === 1 ? 1 : 0);
         this.form.controls['alimentacionSeleccionada'].setValue(this.informacionPaciente.habitosAlimenticios.detalle_habito_alimenticio);
         this.mantenerValoresRadioButtons();
         this.formularioService.setDataFormulario3(this.form.value);

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

      });
   }

   /*AL MOVERSE DE STEP Y RETROCEDER LOS VALORES DE LOS RADIO BUTTONS DESAPARECEN,
   ESTE CODIGO PERMITEN MANTENER LOS VALORES*/
   mantenerValoresRadioButtons() {
      const controlEquipoSaludMental = this.informacionPaciente.areaPsiquica.control_equipo_salud_mental;
      this.controlEquipoSaludMental = controlEquipoSaludMental === 1 ? 'si' : 'no';
      this.form.patchValue({
         controlEquipoSaludMental: this.controlEquipoSaludMental
      });

      const psicoterapia = this.informacionPaciente.areaPsiquica.psicoterapia;
      this.psicoterapia = psicoterapia === 1 ? 'si' : 'no';
      this.form.patchValue({
         psicoterapia: this.psicoterapia
      });

      const evaluacionPsiquiatrica = this.informacionPaciente.areaPsiquica.evaluacion_psiquica;
      this.evaluacionPsiquiatrica = evaluacionPsiquiatrica === 1 ? 'si' : 'no';
      this.form.patchValue({
         evaluacionPsiquiatrica: this.evaluacionPsiquiatrica
      });

      const diagnosticosPsiquiatricos = this.informacionPaciente.areaPsiquica.diagnostico_psiquiatrico;
      this.diagnosticosPsiquiatricos = diagnosticosPsiquiatricos === 1 ? 'si' : 'no';
      this.form.patchValue({
         diagnosticosPsiquiatricos: this.diagnosticosPsiquiatricos
      });
   }

}
