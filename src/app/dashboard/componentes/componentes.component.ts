import { Component } from '@angular/core';
import { CentrosSaludService } from 'src/app/servicios/centros.service';
import { LoginService } from 'src/app/servicios/login.service';

type Usuario = {
  nombre_usuario: string;
  cargo_profesional_salud: string;
  roles: string;
  comuna_centro_atencion: string;
  logo: string;
  nombre_centro_salud:string;
};

@Component({
  selector: 'app-componentes',
  templateUrl: './componentes.component.html',
  styleUrls: ['./componentes.component.css']
})
export class ComponentesComponent {

  public usuario!:Usuario;
  public mostrarUl: boolean = false
  public imagen!: any;
  constructor(
    private loginService: LoginService,
    private centros: CentrosSaludService,
    ){}

    ngOnInit(){
      this.loginService.dataUsuario$.subscribe(dataUser=>{
        if(dataUser){
          this.usuario = dataUser;
          this.obtenerImagen(this.usuario.logo);
      }else {
        throw new Error("Usuario vacio")
      }
    }, (err)=>{
      console.log(err);
      console.log("Error al cargar datos de usuario");
    });
  }

  async obtenerImagen(ruta: string){
    try {
      const res: any = await this.centros.mostrarImagen(ruta).toPromise();
      // Verifica si la respuesta contiene la imagen
      if (res instanceof Blob) {
        // Transforma la imagen en una URL
        this.imagen = URL.createObjectURL(res);
      } else {
        console.error("Respuesta inesperada del servidor:", res);
      }
    } catch (error) {
      console.error("Error al obtener la imagen:", error);
    }

  }

  async datosUsuario(){

  }


  mostrarLista(){
    this.mostrarUl = !this.mostrarUl;
  }
  cerrarHapi(){
    localStorage.removeItem("token");
  }

}
