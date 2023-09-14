import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Usuarios1 } from 'src/app/dashboard/interfaces/usuarios';
import { MenuItem, MessageService } from 'primeng/api';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { DomSanitizer } from '@angular/platform-browser';
import { CentrosSaludService } from 'src/app/servicios/centros.service';
import { Comunas } from 'src/app/dashboard/interfaces/comunas';

@Component({
  selector: 'app-ingresar-centro',
  templateUrl: './ingresar-centro.component.html',
  styleUrls: ['./ingresar-centro.component.css']
})
export class IngresarCentroComponent implements OnInit {
  form: FormGroup;
  dataModel!: MenuItem[];
  dataUsuario!:any;
  value!: string;
  public previsualizacion!: string;
  public usuarios!: Usuarios1;
  public file:any;
  public comunas!: Array<Comunas>
  public roles!: Array<{}>;
  public centros!: Array<{}>;
  public datosImg!:any;
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

  }

  ngOnInit(): void {
    this.centrosSalud.listarComunas().subscribe( (res:any)  => {
      this.comunas = res;
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

 guardar() {
   const formValues = this.form.value;
   if(this.validarCamposVacios()){
      this.centrosSalud.crearCentro(formValues, this.file).subscribe( () => {
        this.toast.add({ severity: 'success', summary: 'Registros Ingresados', detail: 'Centro Guardado Con Éxito!' });
        setTimeout(() => {
            window.location.reload();
        }, 2500);
      })
   }
 }
}

