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

  // async canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot
  // ): Promise<boolean | UrlTree> {
  //   const token: string | null = localStorage.getItem("token");

  //   if (token) {
  //     const result = await this.validacionesService.validartoken(token);

  //     if (result) {
  //       const res:any = await this.loginService.verificarToken(token).toPromise();
  //       this.validaciones = res.verificar;
  //     } else {
  //       this.validaciones = false;
  //     }

  //     this.redirect(this.validaciones);
  //     return this.validaciones;
  //   } else {
  //     this.validaciones = false
  //     // Handle the case where 'token' is null (e.g., user is not authenticated)
  //     // You can either redirect the user or return false/UrlTree accordingly.
  //     return this.validaciones; // Or return UrlTree or navigate to a login page.
  //   }
  // }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      let token:string | null = localStorage.getItem("token");
      if(!this.loginService.isAuthentucated()){
        this.router.navigate(['/login']);
        return false;
      }
      return true;
      // try {
      //   this.loginService.verificarToken(token).subscribe({
      //     next: (res:any) => {
      //       console.log('bien');
      //     },
      //     error: (error) => {
      //       console.log('err');
      //       localStorage.removeItem('token');
      //       this.router.navigate(['/login']);

      //       console.log(error);
      //     },
      //     complete(){}
      //   })
      //   return true;
      // } catch (error) {
      //   console.log('malo');
      //   localStorage.removeItem('token');
      //   this.router.navigate(['/login']);
      //   return false;
      // }
    }
}
