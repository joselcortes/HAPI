import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ValidacionesService} from './servicios/validaciones.service';
import { LoginService } from './servicios/login.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class VigilanteHapiGuard implements CanActivate {

  private validaciones:boolean = false;
  private prueba:boolean = false;
  constructor(private router:Router, private validacionesService:ValidacionesService, private loginService:LoginService, private jwtHelper : JwtHelperService){
  }

  redirect(bandera:boolean){
    if(!bandera){
        this.router.navigate(["/login"]);
    }
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      if(!this.loginService.isAuthentucated()){
        // alert('el token vencio')
        // this.router.navigate(['/login']);
        return false;
      }

      return true;

    }
}
