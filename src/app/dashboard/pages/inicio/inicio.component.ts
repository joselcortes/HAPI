import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { PacientesService } from '../../../servicios/datos.paciente.service';

@Component({
    selector: 'app-inicio',
    templateUrl: './inicio.component.html',
    styleUrls: ['./inicio.component.css'],
})

export class InicioComponent implements OnInit {
    //VARIABLES PARA ASIGNAR LAS ESTADISTICAS
    generoMasculino!: string;
    generoFemenino!: string;
    generoPangenero!: string;
    generoFluido!: string;
    generoAgenero!: string;
    generoBigenero!: string;
    estadistica!: any;
    edadesPacientes!: number;

    //ELEMENTOS DE LOS GRAFICOS
    data: any;
    options: any;
    basicData: any;
    basicOptions: any;

    constructor(private pacienteService: PacientesService) { }

    ngOnInit() {
      this.pacienteService.estadisticaInicio().subscribe((datos) => {
        this.estadistica = datos;
        this.generoMasculino = this.estadistica?.generos[0];
        this.generoFemenino = this.estadistica?.generos[1];
        this.generoPangenero = this.estadistica?.generos[2];
        this.generoBigenero = this.estadistica?.generos[3];
        this.generoFluido = this.estadistica?.generos[4];
        this.generoAgenero = this.estadistica?.generos[5];

        //ELEMENTOS PARA EL GRAFICO PREFERENCIAS DE GENERO
        const documentStyle1 = getComputedStyle(document.documentElement);
        const textColor1 = documentStyle1.getPropertyValue('--text-color');

        this.data = {
          labels: ['Masculino', 'Femenino','Pangenero','Genero fluido', 'Agénero', 'Bigénero'],
          datasets: [
            {
              data: [this.generoMasculino, this.generoFemenino, this.generoPangenero,this.generoFluido, this.generoAgenero, this.generoBigenero],
              backgroundColor: [documentStyle1.getPropertyValue('--blue-500'), documentStyle1.getPropertyValue('--yellow-500'),documentStyle1.getPropertyValue('--purple-500'), documentStyle1.getPropertyValue('--green-500'), documentStyle1.getPropertyValue('--gray-500'), documentStyle1.getPropertyValue('--red-400')],
              hoverBackgroundColor: [documentStyle1.getPropertyValue('--blue-400'), documentStyle1.getPropertyValue('--yellow-400'),documentStyle1.getPropertyValue('--purple-500'), documentStyle1.getPropertyValue('--green-400'), documentStyle1.getPropertyValue('--gray-400'), documentStyle1.getPropertyValue('--red-300')]
            }
          ]
        };

        this.options = {
          plugins: {
            legend: {
              labels: {
                usePointStyle: true,
                color: textColor1
              }
            }
          }
        };
      });
      let edades:number[]=[];
      let mayor50=0;
      this.pacienteService.estadisticasFecha().subscribe(data => {
        // if(data.edad === null || data.edad === undefined) return

        for (const item of data.edad) {
          let edad = item.fecha_nacimiento.slice(0,-14)
          edades.push(this.calcularEdadPacienteBaseDato(edad)!)
        }
        const resmayor51 = edades.filter(elem => elem >= 51)
        mayor50 = resmayor51.length

        const resmayor4150 = edades.filter(elem => elem >= 41 && elem <= 50);
        const mayor4150 = resmayor4150.length;

        const resmayor3140 = edades.filter(elem => elem >= 31 && elem <= 40);
        const mayor3140 = resmayor3140.length;

        const resmayor2130 = edades.filter(elem => elem >= 21 && elem <= 30);
        const mayor2130 = resmayor2130.length;

        const resmayor1620 = edades.filter(elem => elem >= 16 && elem <= 20);
        const mayor1620 = resmayor1620.length;

        const resmayor1115 = edades.filter(elem => elem >= 11 && elem <= 15);
        const mayor1115 = resmayor1115.length;

        const resmayor010 = edades.filter(elem => elem >= 0 && elem <= 10);
        const mayor010 = resmayor010.length;


        //ELEMENTOS PARA EL GRAFICO RANGO DE EDADES PACIENTE
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');



        // console.log('mayor51',mayor51);

        this.basicData = {
            labels: ['0-10', '11-15', '16-20', '21-30','31-40','41-50','51 - 70+'],
            datasets: [
                {
                    data: [mayor010,mayor1115, mayor1620, mayor2130,mayor3140,mayor4150,mayor50],
                    backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)','rgba(120, 122, 255, 0.2)','rgba(152, 155, 255, 0.2)','rgba(11, 105, 255, 0.2)'],
                    borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
                }
            ]
        };

        this.basicOptions = {
            responsive: true ,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                    labels: {
                        color: textColor
                    }

                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                x: {

                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
      })
    }

    calcularEdadPacienteBaseDato(fecha: string) {
      const fechaNacimiento = fecha;

      if (fechaNacimiento) {
         const partesFecha = fechaNacimiento.split('/');
         const fechaFormateada: string = `${partesFecha[2]}-${partesFecha[1]}-${partesFecha[0]}`;

         const fechaActual = new Date();
         const fechaNacimientoCalculada = new Date(fechaFormateada);

         let edad = fechaActual.getFullYear() - fechaNacimientoCalculada.getFullYear();
         const meses = fechaActual.getMonth() - fechaNacimientoCalculada.getMonth();
         const dias = fechaActual.getDate() - fechaNacimientoCalculada.getDate();

         if (meses < 0 || (meses === 0 && dias < 0)) {
            edad--;
         }
         return edad;
      }
      return undefined;
   }
}
