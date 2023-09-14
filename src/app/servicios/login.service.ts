import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { env } from 'src/environments/environments';
import { Login } from '../dashboard/interfaces/login';

type Usuario = {
  id_profesional_salud:number
  nombre_usuario: string;
  cargo_profesional_salud: string;
  roles: string;
  comuna_centro_atencion: string;
  nombre_centro_salud:string,
  logo: string;
}

@Injectable({
  providedIn: "root",
})


export class LoginService {
  private url: string;
  private headersToken: any;

  public dataUsuario = new BehaviorSubject<Usuario>({

    id_profesional_salud: 0,
    nombre_usuario: '',
    cargo_profesional_salud: '',
    roles: '',
    comuna_centro_atencion: '',
    nombre_centro_salud: '',
    logo: ''

  });


  dataUsuario$ = this.dataUsuario.asObservable();

  constructor(private http: HttpClient) {
    this.url = `${env.url}/sesion`;
    this.headersToken = new HttpHeaders();

    this.data = {
      sub: 0,
      scope: '',
    };
  }

  private data: {
    sub: number;
    scope: string;
  };

  getHeader(body: any): Observable<any>{
    return this.http.post(`${this.url}/credenciales`, body,{
      observe: 'response',
    });

  }

  mandarToken(token: string | null) {

    const header = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });


    this.http.get(`${this.url}/verificar`, { headers: header })
      .subscribe((result:any) => {
        this.dataUsuario.next(result.resultData);
    });
  }

  enviarDatosLogin(body:Login): Observable<any>{
    const data = {
      email: body.email,
      password: body.password
    }
    return this.http.post(`${env.url}/login/verificar-usuario`, data)
  }
}
