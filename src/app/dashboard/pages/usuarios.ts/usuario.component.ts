import { Component, OnInit } from '@angular/core';
import { Usuarios, datosProfesionalSalud } from '../../interfaces/usuarios';
import { ConfirmEventType, ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { LoginService } from 'src/app/servicios/login.service';
@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css'],
  providers: [MessageService],
})
export class UsuarioComponent implements OnInit {

  public usuarios!: Array<Usuarios>;
  public datosUsuarios!: any;
  public data!: Array<any>;
  public visible!: boolean;
  public visibleUpdate!: boolean;

  dataModel!: MenuItem[];

  //ELEMENTOS PARA FILTRAR LOS DATOS DE LA TABLA
  terminoBusqueda!: string;
  usuariosFiltrados!: any[];

  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private loginSer:LoginService,
    private toast: MessageService,
    private confirmationService: ConfirmationService,
    ) {
    this.usuarios = [
      {
        id_profesional_salud: 0,
        rut_profesional_salud: '',
        nombre_usuario: '',
        cargo_profesional_salud: '',
        roles: '',
        nombre_centro_salud: '',
        estado: 0,
      },
    ];
  }

  ngOnInit() {

    this.loginSer.dataUsuario$.subscribe((data)=>{
      if(data){
        const nombreCentro = data.nombre_centro_salud;
        this.buscarUsuario(nombreCentro);
      }
    });

    this.usuarioService.listarUsuario('').subscribe((response:any)=>{
      this.usuarios = response;
      console.log('usususioduaosiduoasiduoiueoiu',this.usuarios);
    });

    this.dataModel = [
      {
        label: 'ingresar usuario',
        routerLink: 'ingresar',
      },
    ];

    this.usuarioService.visible$.subscribe(result=>{
      this.visible = result;
    });
  }


  buscarUsuario(nombreCentro:string){
    this.usuarioService.listarUsuario(nombreCentro).subscribe((response:any)=>{
      this.usuarios = response;

    });
  }

  eliminarUsuario(idUsuario: number) {
    this.confirmationService.confirm({
      message: '¿Esta seguro de eliminar el usuario?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eliminar(idUsuario);
      },
      reject: (type: ConfirmEventType) => {
        return 0;
      }
    });
  }

  eliminar(idUsuario:number) {
    const id= idUsuario;
    this.usuarioService.eliminarUsuario(id).subscribe(
      () => {
        this.toast.add({ severity: 'success', summary: 'Eliminado', detail: 'Usuario eliminado con éxito!' });
        setTimeout(() => {
          window.location.reload();
        }, 2500);
      },
      (error) => {
        this.toast.add({ severity: 'error', summary: 'Error', detail: 'El usuario no se pudo eliminar!' });
      }
    );
  }

  borrar(){
    localStorage.removeItem('datosProfesionalSalud');
  }

  showDialog(){
    localStorage.removeItem('profesionalSaludEncontrado');
    localStorage.removeItem('idProfesionalSalud');
    this.visible = true;
  }
  showModalUpdate(rut: string){
    this.visibleUpdate = true;
    this.usuarioService.listarUsuarioPorRut(rut).subscribe( res => {
      this.datosUsuarios = res;
    })
  }

  closeModal() {
    this.visible = false;
    localStorage.removeItem('profesionalSaludEncontrado');
    localStorage.removeItem('idProfesionalSalud');
  }
  closeModalUpdate(){
    this.visibleUpdate = false;
  }

  filtrarDatosPacientes() {
    if (this.terminoBusqueda) {
      const termino = this.terminoBusqueda.toLowerCase();
      this.usuariosFiltrados = this.usuarios.filter((datos) => {
        const rut = datos.rut_profesional_salud?.toLowerCase();
        const nombre = datos.nombre_usuario?.toLowerCase();
        return (
          rut?.includes(termino) || nombre?.includes(termino)
        );
      });
    } else {
      this.usuariosFiltrados = this.usuarios;
    }
  }
}
