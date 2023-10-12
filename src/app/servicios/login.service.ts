import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { env } from 'src/environments/environments';
import { Login } from '../dashboard/interfaces/login';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

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
  // public state = signal({})

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

  constructor(private http: HttpClient, public jwtHelper: JwtHelperService, private router: Router) {
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


  //MI LOGIN
  enviarDatosLogin(body:Login): Observable<any>{
    const data = {
      email: body.email,
      password: body.password
    }
    return this.http.post(`${env.url}/login/verificar-usuario`, data)
  }

  isAuthentucated(){
    const token = localStorage.getItem('token');
    if(!token){
      return false;
    }
    this.verificarToken(token).subscribe({
      next: (res:any) => {
        // console.log('el token expiro',this.jwtHelper.isTokenExpired(token));

        // console.log(res);
        if(res.verificar === false){
          console.log('el token expiro',this.jwtHelper.isTokenExpired(token));
          if(this.jwtHelper.isTokenExpired(token) === true){
            alert('El token expirto desea seguir?')
          }
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
          return false
        }else{
          return true
        }
      },
      error: (error) => {
        console.log(error);
      },
      complete(){}
    })
    return !this.jwtHelper.isTokenExpired(token);
  }

  verificarToken(token: string | null){
    if(!token){
      localStorage.removeItem('token');
      return of(false);
    }
    const headers = new HttpHeaders({
      Authorization: `${token}`,
      // token: `Bearer ${token}`,
      'Content-type': 'applicarion/json',
    });

    return this.http.get(`${env.url}/login/verificar-token`, {headers} )
  }


  // renovarToken()
}
