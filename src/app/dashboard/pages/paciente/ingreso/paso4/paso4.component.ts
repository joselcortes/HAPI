import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Formulario4Datos } from 'src/app/dashboard/interfaces/formularios';
import { ComposicionFormularioService } from 'src/app/servicios/composicion-formulario.service';
import { PacientesService } from 'src/app/servicios/datos.paciente.service';
import { FormularioService } from 'src/app/servicios/formulario.service';
import { FuncionalidadElementosService } from 'src/app/servicios/funcionalidad-elementos.service';
import { Paso4FormularioService } from 'src/app/servicios/paso4-formulario.service';

@Component({
   selector: 'app-paso4',
   templateUrl: './paso4.component.html',
   styleUrls: ['./paso4.component.css']
})
export class Paso4Component implements OnInit {

   form!: FormGroup;
   items!: MenuItem[];
   datosFormulario4!: Formulario4Datos;
   textoJudializacion!: FormControl;
   checkHabilitarJudializacion!: FormControl;
   idFicha!: number;
   informacionPaciente!: any;

   constructor(
      private router: Router,
      private formularioService: Paso4FormularioService,
      public fb: FormBuilder,
      private confirmationService: ConfirmationService,
      private toast: MessageService,
      private serviceCerrarModal: FuncionalidadElementosService,
      private composicionFormulario: ComposicionFormularioService,
      public pacientesService: PacientesService,
      private ser: FormularioService,
   ) {

      this.idFicha = parseInt(localStorage.getItem("idFicha") as string);
      this.form = this.fb.group({
         textoAntecedentesPerinatales: ['', ''],
         textoAntecedentesMorbidosHospitalizaciones: ['', ''],
         textoAntecedentesQuirurgicos: ['', ''],
         textoAlergiasFocos: ['', ''],
         textoInmunizacionesSegunPNI: ['', ''],
         textoFuncionalidadGenital: ['', ''],
         textoAntecedentesFamiliares: ['', ''],
         textoJudializacion: [{ value: '', disabled: true }],
         checkHabilitarJudializacion: [false],
      })

      this.activarDesactivarTextosCondicionales();

   }

   guardarInformacionPacienteFormulario4() {
      const formValues = this.form.value;
      this.formularioService.setDataFormulario4(formValues);
      this.router.navigate(['paciente/revision']);
   }

   ngOnInit() {
      localStorage.setItem('paso3', JSON.stringify(false));
      const usuarioEncontrado = localStorage.getItem('paso4');
      const isEjecutado = usuarioEncontrado === 'true' ? true : false;
      const savedData = this.formularioService.getDataFormulario4();
      if (!isEjecutado) {
         this.form.patchValue(savedData);
      } else {
         localStorage.setItem('paso4', JSON.stringify(false));
         this.registrosBaseDeDatos();
      }
   }

   prevPage() {
      const formValues = this.form.value;
      this.formularioService.setDataFormulario4(formValues);
      this.router.navigate(['paciente/area-psiquica']);
   }

   activarDesactivarTextosCondicionales(){
      this.form.get('checkHabilitarJudializacion')?.valueChanges.subscribe((value: boolean) => {
         if (value) {
            this.form.get('textoJudializacion')?.enable();
         } else {
            this.form.get('textoJudializacion')?.disable();
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
      this.formularioService.setDataFormulario4(formValues);
      if (this.form.value.runPasaportePaciente != '' && this.form.value.runPasaportePaciente != '-') {
         if (localStorage.getItem('paso4')) {
            this.composicionFormulario.composicionFormularioActualizar().subscribe(
               () => {
                  this.toast.add({ severity: 'success', summary: 'Registros Ingresados', detail: 'Los Registros Fueron Ingresados Con Éxito!' });
                  this.formularioService.reiniciarFormulario4();
                  setTimeout(() => {
                     localStorage.removeItem('usuarioEncontrado');
                     localStorage.removeItem('rutPaciente');
                     this.formularioService.reiniciarFormulario4();
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
                     this.serviceCerrarModal.close();
                     window.location.reload();
                     localStorage.removeItem('usuarioEncontrado');
                     localStorage.removeItem('rutPaciente');
                     this.formularioService.reiniciarFormulario4();
                     window.location.reload();
                  }, 2500);
               },
               (error) => {
                  this.toast.add({ severity: 'error', summary: 'Error Al Ingresar Registros', detail: 'Por Favor, Inténtelo De Nuevo.' });
               }
            );
         }
      }
   }

   registrosBaseDeDatos() {
      const rutPaciente = localStorage.getItem('rutPaciente') ?? '';
      this.pacientesService.dataPacientePorRunTotal(rutPaciente).subscribe((datosPorRut) => {
         this.informacionPaciente = datosPorRut;
         this.form.controls['textoAntecedentesPerinatales'].setValue(this.informacionPaciente.antecedentes.detalles_antecedente_perinatales);
         this.form.controls['textoAntecedentesMorbidosHospitalizaciones'].setValue(this.informacionPaciente.antecedentes.detalles_antecedentes_hospitalizaciones);
         this.form.controls['textoAntecedentesQuirurgicos'].setValue(this.informacionPaciente.antecedentes.detalles_antecedentes_quirurgicos);
         this.form.controls['textoAlergiasFocos'].setValue(this.informacionPaciente.antecedentes.detalles_antecedentes_alergicos);
         this.form.controls['textoInmunizacionesSegunPNI'].setValue(this.informacionPaciente.antecedentes.detalles_antecedentes_pni);
         this.form.controls['textoFuncionalidadGenital'].setValue(this.informacionPaciente.antecedentes.detalles_funcionalidad_genital);
         this.form.controls['textoAntecedentesFamiliares'].setValue(this.informacionPaciente.antecedentes.detalles_antecedentes_familia);
         this.form.controls['checkHabilitarJudializacion'].setValue(this.informacionPaciente.ficha.judicializacion === 1 ? 1 : 0);
         this.form.controls['textoJudializacion'].setValue(this.informacionPaciente.ficha.detalles_judicializacion);
         this.formularioService.setDataFormulario4(this.form.value);
      });
   }

   finalizarConsulta() {
      this.confirmationService.confirm({
         message: '¿Está seguro/a de terminar la consulta?',
         icon: 'pi pi-exclamation-triangle',
         accept: () => {
          this.guardar2(this.idFicha);
            // this.ser.finalizarFormulario(this.idFicha).subscribe(response => {

            //    this.toast.add({ severity: 'success', summary: 'Finalizar', detail: 'La Ficha ha sido Finalizada' });

            //    setTimeout(() => {
            //       window.location.reload();
            //    }, 1000);
            // }, err => {
            //    this.toast.add({ severity: 'error', summary: 'Error', detail: 'Error al finalizar la ficha' });
            // });
         },
         reject: (type: ConfirmEventType) => {
            return 0;
         }
      });
   }

   guardar2(idFicha?:number) {
    const formValues = this.form.value;
    this.formularioService.setDataFormulario4(formValues);
    if (this.form.value.runPasaportePaciente != '' && this.form.value.runPasaportePaciente != '-') {
       if (localStorage.getItem('paso4')) {
          this.composicionFormulario.composicionFormularioActualizar('finalizar', this.idFicha).subscribe( () => {
                  this.toast.add({ severity: 'success', summary: 'Registros Ingresados', detail: 'Los Registros Fueron Ingresados Con Éxito!' });
                  this.formularioService.reiniciarFormulario4();
                  setTimeout(() => {
                     localStorage.removeItem('usuarioEncontrado');
                     localStorage.removeItem('rutPaciente');
                     this.formularioService.reiniciarFormulario4();
                     window.location.reload();
                  }, 2500);
               },
               (error) => {
                  this.toast.add({ severity: 'error', summary: 'Error Al Ingresar Registros', detail: 'Por Favor, Inténtelo De Nuevo.' });
               });
       } else {
        this.composicionFormulario.composicionFormularioIngresar('finalizar', this.idFicha).subscribe(
           () => {
              this.toast.add({ severity: 'success', summary: 'Registros Ingresados', detail: 'Los Registros Fueron Ingresados Con Éxito!' });
              setTimeout(() => {
                 this.serviceCerrarModal.close();
                 window.location.reload();
                 localStorage.removeItem('usuarioEncontrado');
                 localStorage.removeItem('rutPaciente');
                 this.formularioService.reiniciarFormulario4();
                 window.location.reload();
              }, 2500);
           },
           (error) => {
              this.toast.add({ severity: 'error', summary: 'Error Al Ingresar Registros', detail: 'Por Favor, Inténtelo De Nuevo.' });
           }
        );
     }
    }
 }

}
