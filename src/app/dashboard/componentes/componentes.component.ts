import { Component } from '@angular/core';
import { error } from 'console';
import { CentrosSaludService } from 'src/app/servicios/centros.service';
import { LoginService } from 'src/app/servicios/login.service';
import { Subscription } from 'rxjs';

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
    ){


    }
    ngOnInit(){
      const token = localStorage.getItem('token');
      if(token){
        try {
          this.loginService.verificarToken(token).subscribe({
            next: (res:any) => {
                  console.log(res);
                  this.usuario = res.usuario[0];
                  console.log(this.usuario);
                  this.obtenerImagen(this.usuario.logo);
            },
            error: (error) => {
              console.log(error);
            },
            complete(){}
          })
        } catch (error) {

          console.log(error);
        }
      }
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

  mostrarLista(){
    this.mostrarUl = !this.mostrarUl;
  }
  cerrarHapi(){
    localStorage.removeItem("token");
    localStorage.removeItem("realizoClick");
    localStorage.removeItem("limpiarValoresFormulario1");
    localStorage.removeItem("idFicha");
  }

}
