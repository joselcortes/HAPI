import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MenuItem, ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { Usuarios1 } from 'src/app/dashboard/interfaces/usuarios';
import { CentrosSaludService } from 'src/app/servicios/centros.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-actualizar-usuario',
  templateUrl: './actualizar-usuario.component.html',
  styleUrls: ['./actualizar-usuario.component.css']
})
export class ActualizarUsuarioComponent implements OnInit{
  form: FormGroup;
  @Input()consultaUsuario!:any;
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

  ngOnChanges(changes: SimpleChanges): void {
   if (changes["consultaUsuario"]) {
    console.log(this.consultaUsuario);
     this.rellenarUsuarios()
     // Realiza cualquier otra lógica que necesites con los nuevos datosCentro aquí
   }
 }
 rellenarUsuarios(){
   this.form.controls['rutProfesional'].setValue(this.consultaUsuario[0].rut_profesional_salud);
   this.form.controls['nombreProfesional'].setValue(this.consultaUsuario[0].nombre_usuario);
   this.form.controls['cargoProfesional'].setValue(this.consultaUsuario[0].cargo_profesional_salud);
   this.form.controls['rolProfesional'].setValue(this.consultaUsuario[0].nombre_usuario);
   this.form.controls['centroProfesional'].setValue(this.consultaUsuario[0].fk_centro_salud);
   if(this.consultaUsuario[0].estado === 1){
     this.form.controls['estadoProfesional'].setValue(1);
    }
    if(this.consultaUsuario[0].estado === 2){
     this.form.controls['estadoProfesional'].setValue(2);
    }

    if(this.consultaUsuario[0].roles == 'adminUser'){
       this.form.controls['rolProfesional'].setValue(1);
    }
    if(this.consultaUsuario[0].roles == 'Usuario'){
       this.form.controls['rolProfesional'].setValue(2);
    }
 }

  actualizarRegistros(valor:any) {
    if (!this.validarRun(this.form.value.rutProfesional)) {
      this.toast.add({ severity: 'error', summary: 'Error', detail: 'RUN INGRESADO NO VÁLIDO' });
      return;
    }
   this.confirmationService.confirm({
      message: '¿Desea actualizar el usuario?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
         this.actualizarUsuario(valor);
      },
      reject: (type: ConfirmEventType) => {
         return 0;
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

 actualizarUsuario(valor:any){
  const form = this.form.value;

  form.rolProfesional = this.form.value.rolProfesional == 1 ? 'adminUser' : 'Usuario';

   this.usuarioService.actualizarUsuario(form, valor).subscribe(
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

}
