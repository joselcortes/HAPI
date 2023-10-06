import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { crearUsuario } from '../dashboard/interfaces/usuarios';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { env } from 'src/environments/environments';
@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private url: string;
  private visible = new BehaviorSubject(false);
  visible$ = this.visible.asObservable();

  constructor(private http: HttpClient) {
    this.url = `${env.url}/usuario`;
  }

  guardarUsuario(body: crearUsuario): Observable<any> {
    const data = {
      rutProfesional: body.rutProfesional,
      nombreProfesional: body.nombreProfesional,
      contrasenaProfesional: body.contrasenaProfesional,
      cargoProfesional: body.cargoProfesional,
      rolProfesional: body.rolProfesional,
      centroProfesional: body.centroProfesional
    }
    return this.http.post(`${this.url}/guardar`, data);
  }

  id!: number;
  idUsuario(idUsuario: number) {
    this.id = idUsuario;
  }



  actualizarUsuario(body: crearUsuario, id?:number): Observable<any> {
    let idUsuario;
    if(id){
      idUsuario = id
    }else{
      idUsuario = localStorage.getItem('idProfesionalSalud')
    }

    const data = {
      rutProfesional: body.rutProfesional,
      nombreProfesional: body.nombreProfesional,
      contrasenaProfesional: body.contrasenaProfesional,
      cargoProfesional: body.cargoProfesional,
      rolProfesional: body.rolProfesional,
      centroProfesional: body.centroProfesional,
      estadoProfesional: body.estadoProfesional,
    }
    return this.http.post(`${this.url}/actualizar/${idUsuario}`, data);
  }

  listarUsuario(nombreCentro: string) {
    return this.http.get(this.url.concat(`/listar`));
  }

  listarUsuarioPorRut(rut:string) {
    return this.http.get(this.url.concat(`/listarPorRut/${rut}`));
  }

  eliminarUsuario(idUsuario: number): Observable<any> {
    return this.http.post(`${this.url}/eliminar/${idUsuario}`, null);
  }


  cerrarModal() {
    this.visible.next(false);
  }
}
