import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { PacientesService } from '../../../../servicios/datos.paciente.service';
import { DatosPaciente } from '../../../interfaces/ingreso_paciente';
import { FuncionalidadElementosService } from 'src/app/servicios/funcionalidad-elementos.service';
import { Router } from '@angular/router';
import { Paso1FormularioService } from 'src/app/servicios/paso1-formulario.service';
import { Paso2FormularioService } from 'src/app/servicios/paso2-formulario.service';
import { Paso3FormularioService } from 'src/app/servicios/paso3-formulario.service';
import { Paso4FormularioService } from 'src/app/servicios/paso4-formulario.service';

@Component({
    selector: 'app-tabla',
    templateUrl: './tabla.component.html',
    styleUrls: ['./tabla.component.css'],
    providers: [MessageService]
})
export class TablaComponent implements OnInit {

    datosPaciente!: DatosPaciente[];
    subscription: Subscription = new Subscription;
    items!: MenuItem[];
    items2!: MenuItem[];
    terminoBusqueda!: string;
    datosPacienteFiltrados!: any[];
    //CONTROLA EL ABRIRSE DEL MODAL
    visible!: boolean;

    constructor(
        public messageService: MessageService,
        public modalService: FuncionalidadElementosService,
        private pacienteService: PacientesService,
        private router: Router,
        private serviceCerrarModal: FuncionalidadElementosService,
        private paso1Formulario: Paso1FormularioService,
        private paso2Formulario: Paso2FormularioService,
        private paso3Formulario: Paso3FormularioService,
        private paso4Formulario: Paso4FormularioService
    ) { }

    ngOnInit() {
        this.items = [
            {
                label: 'Información personal',
                routerLink: 'informacion-personal',
            },
            {
                label: 'Identidad de genero',
                routerLink: 'identidad-genero'
            },
            {
                label: 'Area psiquica',
                routerLink: 'area-psiquica'
            },
            {
                label: 'Historia clinica',
                routerLink: 'historia-clinica'
            }
        ];

        //TODO: Agregar la tabla que liste todos los pacientes pero sin repetirlos
        this.pacienteService.obtenerInformacionPacientesHistorialGenero().subscribe((datos) => {
            this.datosPaciente = datos
        });
    }

    estiloTag = {
        position: 'relative',
        left: '8px'
      };

    cerrarModal() {
        localStorage.setItem("rutPacienteVistaPrincipal", ``);
        localStorage.setItem('limpiarValoresFormulario1', 'true');
        localStorage.removeItem('rutPacienteVistaPrincipal')
        localStorage.removeItem("rutPacienteVistaPrincipal")
        localStorage.removeItem('usuarioEncontrado');
        localStorage.removeItem('rutPaciente');
        localStorage.removeItem('paso1');
        localStorage.removeItem('paso2');
        localStorage.removeItem('paso3');
        localStorage.removeItem('paso4');
        this.paso1Formulario.reiniciarFormulario1();
        localStorage.setItem('realizoClick', 'false');
        this.serviceCerrarModal.close();
        this.visible = false;
    }

    abrirModal() {
        this.paso1Formulario.reiniciarFormulario1();
        this.paso2Formulario.reiniciarFormulario2();
        this.paso3Formulario.reiniciarFormulario3();
        this.paso4Formulario.reiniciarFormulario4();
        localStorage.removeItem('usuarioEncontrado');
        localStorage.removeItem('rutPaciente');
        localStorage.removeItem('paso1');
        localStorage.removeItem('paso2');
        localStorage.removeItem('paso3');
        localStorage.removeItem('paso4');
        localStorage.removeItem('rutPacienteVistaPrincipal');

        this.router.navigate(['paciente/']);
        this.visible = true;
      }

    filtrarDatosPacientes() {
        if (this.terminoBusqueda) {
            const termino = this.terminoBusqueda.toLowerCase();
            this.datosPacienteFiltrados = this.datosPaciente.filter(datos => {
                const rutPaciente = datos.rut_paciente?.toLowerCase();
                const nombrePaciente = datos.nombre_paciente?.toLowerCase();
                const centroAsistencial = datos.nombre_centro_salud?.toLowerCase();
                return rutPaciente?.includes(termino) || nombrePaciente?.includes(termino) || centroAsistencial?.includes(termino);
            });
        } else {
            this.datosPacienteFiltrados = this.datosPaciente;
        }
    }
}









