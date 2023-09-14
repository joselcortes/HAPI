import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';

import { AppRoutingModule } from './app-routing.module';
import { primeNgModules } from './primeng/primeng-modules';

import { AppComponent } from './app.component';
import { InicioComponent } from './dashboard/pages/inicio/inicio.component';
import { Paso1Component } from './dashboard/pages/paciente/ingreso/paso1/paso1.component';
import { Paso2Component } from './dashboard/pages/paciente/ingreso/paso2/paso2.component';
import { Paso3Component } from './dashboard/pages/paciente/ingreso/paso3/paso3.component';
import { Paso4Component } from './dashboard/pages/paciente/ingreso/paso4/paso4.component';
import { ComponentesComponent } from './dashboard/componentes/componentes.component';
import { LoginComponent } from './login/login.component';
import { EpisodiosComponent } from './dashboard/pages/paciente/episodios/episodios.component';
import { TablaComponent } from './dashboard/pages/paciente/tabla/tabla.component';
import { UsuarioComponent} from './dashboard/pages/usuarios.ts/usuario.component';
import { IngresarUsuarioComponent } from './dashboard/pages/usuarios.ts/ingresarUsuario/ingresarUsuario.component';
import { CentrosSaludComponent } from './dashboard/pages/centrosSalud/centros-salud.component';
import { IngresarCentroComponent } from './dashboard/pages/centrosSalud/ingresar-centro/ingresar-centro.component';
import { ActualizarCentroComponent } from './dashboard/pages/centrosSalud/actualizar-centro/actualizar-centro.component';

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    Paso1Component,
    Paso2Component,
    Paso3Component,
    Paso4Component,
    ComponentesComponent,
    LoginComponent,
    EpisodiosComponent,
    TablaComponent,
    UsuarioComponent,
    IngresarUsuarioComponent,
    CentrosSaludComponent,
    IngresarCentroComponent,
    ActualizarCentroComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ...primeNgModules, //USO DE SPREAD OPERATOR PARA AGREGAR TODOS LOS MÓDULOS DE PRIMENG
  ],
  providers: [DatePipe, ConfirmationService, MessageService, Paso1Component],
  bootstrap: [AppComponent]
})
export class AppModule {}
