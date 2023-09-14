import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ValidacionesService} from './servicios/validaciones.service';
import { LoginService } from './servicios/login.service';

@Injectable({
  providedIn: 'root'
})
export class VigilanteHapiGuard implements CanActivate {

  private validaciones:boolean = false;
  constructor(private router:Router, private validacionesService:ValidacionesService, private loginService:LoginService){
  }

  redirect(bandera:boolean){
    if(!bandera){
        this.router.navigate(["/login"]);
    }
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      let token:string | null = localStorage.getItem("token");
      this.validaciones = this.validacionesService.validartoken(token);
      this.redirect(this.validaciones);
      this.loginService.mandarToken(token);
    return this.validaciones;

  }
}
