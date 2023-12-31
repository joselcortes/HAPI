import { Component, Input, SimpleChanges } from '@angular/core';
import { OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Usuarios1 } from 'src/app/dashboard/interfaces/usuarios';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { MenuItem, MessageService } from 'primeng/api';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { CentrosSaludService } from 'src/app/servicios/centros.service';
import { Centros } from 'src/app/dashboard/interfaces/centros';

@Component({
   selector: 'app-ingresarUsuario',
   templateUrl: './ingresarUsuario.component.html',
   styleUrls: ['./ingresarUsuario.component.css'],
})
export class IngresarUsuarioComponent implements OnInit {
   form: FormGroup;
   public usuarios!: Usuarios1;
   value!: string;
   dataModel!: MenuItem[];
   public roles!: Array<{}>;
   public centros!:any;
   dataUsuario!:any;

   constructor(
      private usuarioService: UsuarioService,
      private confirmationService: ConfirmationService,
      private fb: FormBuilder,
      private toast: MessageService,
      private centrosSalud: CentrosSaludService,
   ) {

      this.form = this.fb.group({
         rutProfesional: ['', ''],
         nombreProfesional: ['', ''],
         contrasenaProfesional: ['', ''],
         cargoProfesional: ['', ''],
         centroProfesional: ['', ''],
         rolProfesional: ['', ''],
         estadoProfesional:['','']
      })

   }

   ngOnInit(): void {
      this.agregarGuionSeparadorRut();
      this.centrosSalud.listarCentro().subscribe( res => {
        this.centros = res;
      })
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


   actualizarRegistros(valor:any, id:any) {
    this.confirmationService.confirm({
       message: 'Ya se encuentra registrado un usuario con el rut ingresado, ¿Desea actualizar el usuario?',
       icon: 'pi pi-exclamation-triangle',
       accept: () => {
          this.actualizarUsuario(valor, id);
       },
       reject: (type: ConfirmEventType) => {
          return 0;
       }
    });
 }


   registrosBaseDeDatos(){
      if(this.form.value.rutProfesional === ''){
        this.toast.add({ severity: 'warn', summary: 'Alert', detail: 'Debe ingresar un valor en el campo de rut' });
      }
      this.usuarioService.listarUsuarioPorRut(this.form.value.rutProfesional).subscribe((datos) => {
         this.dataUsuario = datos;

        //  if(this.dataUsuario != ''){
        //     localStorage.setItem('profesionalSaludEncontrado', 'true');
        //     localStorage.setItem('idProfesionalSalud', `${this.dataUsuario[0].id_profesional_salud}`);
        //  }else{
        //   this.toast.add({ severity: 'error', summary: 'Error', detail: 'No se encontraron datos del usuario' });

        //  }
         this.form.controls['nombreProfesional'].setValue(this.dataUsuario[0].nombre_usuario);
         this.form.controls['cargoProfesional'].setValue(this.dataUsuario[0].cargo_profesional_salud);
         this.form.controls['rolProfesional'].setValue(this.dataUsuario[0].nombre_usuario);
         this.form.controls['centroProfesional'].setValue(this.dataUsuario[0].fk_centro_salud);
        //  this.form.controls['estadoProfesional'].setValue(this.dataUsuario[0].estado);


         if(this.dataUsuario[0].estado === 1){
          this.form.controls['estadoProfesional'].setValue(1);
         }
         if(this.dataUsuario[0].estado === 2){
          this.form.controls['estadoProfesional'].setValue(2);
         }

         if(this.dataUsuario[0].roles == 'adminUser'){
            this.form.controls['rolProfesional'].setValue(1);
         }
         if(this.dataUsuario[0].roles == 'Usuario'){
            this.form.controls['rolProfesional'].setValue(2);
         }

      });

   }


   agregarGuionSeparadorRut() {
      const runPasaportePacienteControl = this.form.get('rutProfesional');
      if (runPasaportePacienteControl) {
         runPasaportePacienteControl.valueChanges.subscribe(value => {
            const rut = value?.replace(/[^0-9kK]+/g, '');
            if (rut) {
               const rutFormatted = rut.slice(0, -1) + '-' + rut.slice(-1);
               runPasaportePacienteControl.setValue(rutFormatted, { emitEvent: false });
            }
         });
      }
   }
   validarCamposVacios(){
      if(this.form.value.rutProfesional === ''){
        this.toast.add({ severity: 'warn', summary: 'Alert', detail: 'El campo de rut no puede estar vacio' });
      }
      else if(this.form.value.nombreProfesional === ''){
        this.toast.add({ severity: 'warn', summary: 'Alert', detail: 'El campo de nombre no puede estar vacio' });
      }
      else if(this.form.value.contrasenaProfesional === ''){
        this.toast.add({ severity: 'warn', summary: 'Alert', detail: 'El campo de contraseña no puede estar vacio' });
      }
      else if(this.form.value.cargoProfesional === ''){
        this.toast.add({ severity: 'warn', summary: 'Alert', detail: 'El campo de cargo no puede estar vacio' });
      }
      else if(this.form.value.centroProfesional === '' || this.form.value.centroProfesional === '**'){
        this.toast.add({ severity: 'warn', summary: 'Alert', detail: 'Debe elegir un centro asistencial' });
      }else if(this.form.value.estadoProfesional === '' || this.form.value.estadoProfesional === '**'){
        this.toast.add({ severity: 'warn', summary: 'Alert', detail: 'Debe elegir el estado del usuario' });
      }else if(this.form.value.rolProfesional === '' || this.form.value.rolProfesional === '**'){
        this.toast.add({ severity: 'warn', summary: 'Alert', detail: 'Debe elegir un tipo de usuario' });
      }else{
        return true;
      }
      return false;
   }


  actualizarUsuario(valor:any, id:any){
    this.usuarioService.actualizarUsuario(valor, id).subscribe(
      () => {
        this.toast.add({ severity: 'success', summary: 'Registros Ingresados', detail: 'Usuario actualizado correctamente!' });
        setTimeout(() => {
            localStorage.removeItem('profesionalSaludEncontrado');
            localStorage.removeItem('idProfesionalSalud');
            window.location.reload();
        }, 2500);
      },
    )
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


  guardar() {
    const formValues = this.form.value;
    if(this.validarCamposVacios()){
    if (!this.validarRun(this.form.value.rutProfesional)) {
      this.toast.add({ severity: 'error', summary: 'Error', detail: 'RUN INGRESADO NO VÁLIDO' });
      return;
    }
        if (this.form.value.rutProfesional != '') {
            this.usuarioService.listarUsuarioPorRut(this.form.value.rutProfesional).subscribe((datos) => {
            this.dataUsuario = datos;
            if(this.dataUsuario != ''){
              localStorage.setItem('profesionalSaludEncontrado', 'true');
           }

            if (localStorage.getItem('profesionalSaludEncontrado')) {
              formValues.rolProfesional = this.form.value.rolProfesional == 1 ? 'adminUser' : 'Usuario';
              formValues.centroProfesional = this.form.value.centroProfesional;
              this.actualizarRegistros(formValues, this.dataUsuario[0].id_profesional_salud);
            } else {

              formValues.rolProfesional = this.form.value.rolProfesional == 1 ? 'adminUser' : 'Usuario';
              formValues.centroProfesional = this.form.value.centroProfesional;

              this.usuarioService.guardarUsuario(formValues).subscribe(
                  () => {
                    this.toast.add({ severity: 'success', summary: 'Registros Ingresados', detail: 'Usuario Guardado Con Éxito!' });
                    setTimeout(() => {
                        localStorage.removeItem('profesionalSaludEncontrado');
                        localStorage.removeItem('idProfesionalSalud');
                        window.location.reload();
                    }, 2500);
                  },
              )
            }
          });
        }
    }
  }
}
