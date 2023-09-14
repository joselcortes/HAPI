import { Component, OnInit, ViewChild } from '@angular/core';

import { ConfirmEventType, ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { CentrosSaludService } from 'src/app/servicios/centros.service';
import { Centros } from '../../interfaces/centros';
import { ActualizarCentroComponent } from './actualizar-centro/actualizar-centro.component';

@Component({
  selector: 'app-centros-salud',
  templateUrl: './centros-salud.component.html',
  styleUrls: ['./centros-salud.component.css']
})
export class CentrosSaludComponent implements OnInit {

  public centros!: Array<Centros>;
  public datosCentro!:any;
  public data!: Array<any>;
  public visible!: boolean;
  public actualizarvisible!:boolean
  public logUrl!: string;
  public idActualizar!: string;
  public imagenUrl!: string;
  public imagenes: string[] = [];
  dataModel!: MenuItem[];

  //ELEMENTOS PARA FILTRAR LOS DATOS DE LA TABLA
  terminoBusqueda!: string;
  centrosFiltrados!: any[];

  constructor(
    private router: Router,
    private centrosService: CentrosSaludService,
    private toast: MessageService,
    private confirmationService: ConfirmationService,
    ) {

    this.centros = [
      {
        id_centro_salud: 0,
        nombre_centro_salud: '',
        nombre_comuna:'',
        comuna_centro_atencion: '',
        logo: '',
        img: ''
      },
    ];
  }

  ngOnInit() {
    this.listarCentro();
    this.dataModel = [
      {
        label: 'ingresarcentro',
        routerLink: 'crear-centro',
      },
      {
        label: 'actualizarcentro',
        routerLink: 'actualizar-centro',
      },
    ];
  }

  listarCentro(){
    //TODO: Obtener el logo solamente
    this.centrosService.listarCentro().subscribe((res: any) => {
      this.centros = res;

      this.centros.forEach((item:any, index) => {
        const urlImg = this.obtenerImagen(item.logo, index)
        item.img = urlImg
        return item;
      });
    })
  }

  eliminarCentro(idCentro: number, rutaCentros: string) {

    this.confirmationService.confirm({
      message: '¿Esta seguro de eliminar el centro de salud?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eliminar(idCentro, rutaCentros);
      },
      reject: (type: ConfirmEventType) => {
        return 0;
      }
    });
  }

  eliminar(idCentro:number, rutaCentros: string) {
    const id= idCentro;
    this.centrosService.eliminarCentro(id, rutaCentros).subscribe( ()=> {
      this.toast.add({ severity: 'success', summary: 'Eliminado', detail: 'Usuario eliminado con éxito!' });
        setTimeout(() => {
          window.location.reload();
        }, 2500);
    },
    (error) => {
      this.toast.add({ severity: 'error', summary: 'Error', detail: 'El usuario no se pudo eliminar!' });
    })
  }

  //TODO: Crear una funcion para pedir la imagen y darle como parametro la url que se encuentra en el backend
  // esta funcion hay que llamarla en el listar para poder pasar el parametro
  async obtenerImagen(ruta: string, index: number){
    let urlImg: any;
    const promesaServicio = new Promise((resolve, reject) => {
      this.centrosService.mostrarImagen(ruta).subscribe ((res:any) => {
        //Transforma la imagen en una url
          const img = URL.createObjectURL(res)
          resolve(img)
      })
    })

    const resp = await promesaServicio;
    urlImg = resp;

    this.centros[index].img = urlImg;

  }


  showDialog(){

    this.visible = true;
  }

  closeModal() {
    this.visible = false;
  }

  solicitarDatos(id: string){
    this.centrosService.listarCentroRut(id).subscribe( (res:any) => {
      this.datosCentro = res;
    })
  }

  showActualizar(id:string){
    this.actualizarvisible = true;
    this.solicitarDatos(id)
  }

  closeModalActualizar() {
    this.actualizarvisible = false;
    this.idActualizar = '';
  }

  filtrarDatosPacientes() {
    if (this.terminoBusqueda) {
      const termino = this.terminoBusqueda.toLowerCase();
      this.centrosFiltrados = this.centros.filter((datos) => {
        const nombreCentro = datos.nombre_centro_salud?.toLowerCase();
        const comuna = datos.nombre_comuna?.toLowerCase();
        return (
          nombreCentro?.includes(termino) || comuna?.includes(termino)
        );
      });
    } else {
      this.centrosFiltrados = this.centros;
    }
  }
}
