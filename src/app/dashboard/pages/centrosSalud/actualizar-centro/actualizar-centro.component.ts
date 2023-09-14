import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { url } from 'inspector';
import { ConfirmEventType, ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Comunas } from 'src/app/dashboard/interfaces/comunas';
import { Usuarios1 } from 'src/app/dashboard/interfaces/usuarios';
import { CentrosSaludService } from 'src/app/servicios/centros.service';

@Component({
  selector: 'app-actualizar-centro',
  templateUrl: './actualizar-centro.component.html',
  styleUrls: ['./actualizar-centro.component.css']
})
export class ActualizarCentroComponent implements OnInit{
  form: FormGroup;
  dataModel!: MenuItem[];
  dataUsuario!:any;
  value!: string;
  @Input()datosCentro!:any;
  public previsualizacion!: string;
  public file:any;
  public imagen:any;
  public comunas!: Array<Comunas>
  public centros!: Array<{}>;
  public fileUrl!:any;

  constructor(
    private sanitizer: DomSanitizer,
     private centrosSalud: CentrosSaludService,
     private confirmationService: ConfirmationService,
     private fb: FormBuilder,
     private toast: MessageService,
  ) {


     this.form = this.fb.group({
      nombre_centro_salud: ['',''],
      comuna_centro_atencion: ['',''],
      logo: ['','']

     })
    //  this.form.controls['nombre_centro_salud'].setValue()
  }

  ngOnInit(): void {
    this.centrosSalud.listarComunas().subscribe((res:any) => {
      this.comunas = res;
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["datosCentro"]) {
      this.rellenarDatosForm();
      // Realiza cualquier otra lógica que necesites con los nuevos datosCentro aquí
    }
  }

  rellenarDatosForm(){
    this.form.controls['nombre_centro_salud'].setValue(this.datosCentro[0].nombre_centro_salud)
    this.form.controls['comuna_centro_atencion'].setValue(this.datosCentro[0].id_comuna_fk)
    this.obtenerImagen(this.datosCentro[0].logo);

  }


  actualizarRegistros(valor:any) {
   this.confirmationService.confirm({
      message: '¿Desea actualizar el centro hospitalario?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
         this.actualizarCentro();
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

  }

  validarCamposVacios(){
     if(this.form.value.nombre_centro_salud === ''){
       this.toast.add({ severity: 'warn', summary: 'Alert', detail: 'Debe ingresar un nombre para el centro de salud' });
     }
     else if(this.form.value.comuna_centro_atencion === ''){
       this.toast.add({ severity: 'warn', summary: 'Alert', detail: 'Debe seleccionar una comuna' });
     }
     else if(this.form.value.logo === ''){
       this.toast.add({ severity: 'warn', summary: 'Alert', detail: 'Debe agregar una imagen' });
     }else{
       return true;
     }
     return false;
  }


 actualizarCentro(){
  const formValues = this.form.value
  if(this.validarCamposVacios()){
    this.centrosSalud.actualizarCentro(this.datosCentro,formValues, this.file).subscribe( (res:any) => {
      this.toast.add({ severity: 'success', summary: 'Registros actualizados', detail: 'Centro actualizado correctamente!' });
      setTimeout(() => {
          window.location.reload();
      }, 1500);
    })
  }
 }

 async obtenerImagen(ruta: string){
  let urlImg: any;
  const promesaServicio = new Promise((resolve, reject) => {
    this.centrosSalud.mostrarImagen(ruta).subscribe ((res:any) => {
      //Transforma la imagen en una url
        const img = URL.createObjectURL(res)
        resolve(img)
    })
  })

  const resp = await promesaServicio;
  urlImg = resp;
  this.previsualizacion = urlImg

}

 capturarImagen(event: any){
    if(event.target.files[0]){
        const archivoCapturado = event?.target.files[0];
        this.extraerBase64(archivoCapturado).then( (image:any) => {
        this.previsualizacion = image.base;
      });
      this.file = archivoCapturado;
    }
 }

 extraerBase64 = async($event:any) => new Promise((resolve, reject) => {
    try {
      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () => {
        this.fileUrl = reader.result
        resolve({
          base: reader.result,
        });
      };
      reader.onerror = error => {
        resolve({
          base: null,
        })
      }
      return
    } catch (error) {
      return null;
    }
 });
}
