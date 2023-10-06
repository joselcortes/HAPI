import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComponentesComponent } from './dashboard/componentes/componentes.component';
import { InicioComponent } from './dashboard/pages/inicio/inicio.component';
import { TablaComponent } from './dashboard/pages/paciente/tabla/tabla.component';
import { Paso1Component } from './dashboard/pages/paciente/ingreso/paso1/paso1.component';
import { Paso2Component } from './dashboard/pages/paciente/ingreso/paso2/paso2.component';
import { Paso3Component } from './dashboard/pages/paciente/ingreso/paso3/paso3.component';
import { Paso4Component } from './dashboard/pages/paciente/ingreso/paso4/paso4.component';
import { LoginComponent } from './login/login.component';
import { EpisodiosComponent } from './dashboard/pages/paciente/episodios/episodios.component';
import { VigilanteHapiGuard } from './vigilante-hapi.guard';
import { UsuarioComponent } from './dashboard/pages/usuarios.ts/usuario.component';
import { IngresarUsuarioComponent } from './dashboard/pages/usuarios.ts/ingresarUsuario/ingresarUsuario.component';
import { CentrosSaludComponent } from './dashboard/pages/centrosSalud/centros-salud.component';
import { IngresarCentroComponent } from './dashboard/pages/centrosSalud/ingresar-centro/ingresar-centro.component';
import { ActualizarCentroComponent } from './dashboard/pages/centrosSalud/actualizar-centro/actualizar-centro.component';

const routes: Routes = [
  {
    path: '',
    component: ComponentesComponent,
    canActivate: [VigilanteHapiGuard],
    children: [
      {
        path: '',
        component: InicioComponent,

      },
      {
        path: 'inicio',
        component: InicioComponent,
      },
      {
        path: 'paciente',
        canActivate: [VigilanteHapiGuard],
        component: TablaComponent,
        children: [
          {
            path: '',
            component: Paso1Component,
          },
          {
            path: 'informacion-personal',
            component: Paso1Component,
          },
          {
            path: 'identidad-genero',
            component: Paso2Component,
          },
          {
            path: 'area-psiquica',
            component: Paso3Component,
          },
          {
            path: 'historia-clinica',
            component: Paso4Component,
          },
        ],
      },
      {
        path: 'consulta/:rut',
        canActivate: [VigilanteHapiGuard],
        component: EpisodiosComponent,
        children: [
          {
            path: '',
            redirectTo: 'informacion-personal',
            pathMatch: 'full',
          },{
            path: 'informacion-personal',
            component: Paso1Component,
            data: { breadcrumb: 'Información Personal' }
          },
          {
            path: 'identidad-genero',
            component: Paso2Component,
            data: { breadcrumb: 'Identidad de Género' }
          },
          {
            path: 'area-psiquica',
            component: Paso3Component,
            data: { breadcrumb: 'Área Psíquica' }
          },
          {
            path: 'historia-clinica',
            component: Paso4Component,
            data: { breadcrumb: 'Historia Clínica' }
          },
        ],
      },
      {
        path: 'usuario',
        canActivate: [VigilanteHapiGuard],
        component: UsuarioComponent,
        children: [
          {
            path: '',
            component: IngresarUsuarioComponent,
          },
          {
            path: 'ingresar',
            component: IngresarUsuarioComponent,

          },
        ],
      },
      {
        path: 'centro',
        canActivate: [VigilanteHapiGuard],
        component: CentrosSaludComponent,
        children: [
          {
            path: '',
            component: IngresarCentroComponent
          },
          {
            path: 'crear-centro',
            component: IngresarCentroComponent
          },
          {
            path: 'actualizar-centro',
            component: ActualizarCentroComponent
          }
        ]
      }
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
