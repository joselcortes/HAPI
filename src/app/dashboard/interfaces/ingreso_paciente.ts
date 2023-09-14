
interface Ficha {
  fechaIngreso?:  Date|null;
  borradoLogico?: boolean;
  apoyoEscolar?: boolean;
  judicializacio?: boolean;
  detallesApoyo?: string;
  detallesJudicializacion?: string;
}

interface AntecedentesClinicos {
  antecedentePerinatales?: string;
  antecedenteHospitalizaciones?: string;
  antecedentesQuirurgicos?: string;
  antecedentesAlergicos?: string;
  antecedentesPni?: string;
  funcionalidadGenital?: string;
}

interface PersonasInv {
  rutInvolucrada?: string;
  pasaporte?: string;
  nombreInvolucrada?: string;
  apellidoPInvolucrada?: string;
  apellidoMInvolucrada?: string;
  parentescoInvolucrada?: string;
  telefonoInvolucrada?: string;
  domicilioInvolucrada?: string;
}

interface PersonasAcom {
  rutInvolucrada?: string;
  nombreInvolucrada?: string;
  apellidoPInvolucrada?: string | null;
  apellidoMInvolucrada?: string | null;
  parentescoInvolucrada?: string;
  telefonoInvolucrada?: string;
  domicilioInvolucrada?: string | null;
  pasaporteEncargado?: string | null;
}

interface AreaPsiquica {
  controlEquipoSaludMental?: number | boolean;
  psicoterapia?: number | boolean;
  evaluacionPsiquica?: number | boolean;
  diagnosticoPsiquiatrico?: number | boolean;
  utilizacionFarmaco?: boolean;
  detallesFarmacos?: string;
}

interface Paciente {
  rutPaciente?: string;
  pasaporte?: string;
  nombrePaciente?: string;
  apellidoPaternoPa?: string;
  apellidoMaternoPa?: string;
  pronombre?: string;
  nombreSocial?: string;
  fechaNacimientoPa?: string;
  domicilioPaciente?: string;
  telefonoPaciente?: string;
  usoDroga?: boolean;
  antecedenteFamilires?: boolean;
  detallesUsoDroga?: string;
  detallesAntecedentesFa?: string;
}

interface HistoriaGenero {
  identidadGenero?: string;
  orientacionSexual?: string;
  inicioTransicioSexual?: string;
  tiempoLatencia?: string;
  apoyoFamiliar?: number | boolean;
  usoPrenda?: boolean;
  presenciaDisforia?: boolean;
  detallesDiforia?: string;
}

interface PrendaYDieta {
  detallesHabitoAlimenticio?: string;
  fkPrendaDisconformidad?: number[];
}

export interface RecopilacionInformacion {
  ficha: Ficha;
  antecedentesClinicos: AntecedentesClinicos;
  personasInv: PersonasInv;
  personasAcom: PersonasAcom;
  AreaPsiquica: AreaPsiquica;
  paciente: Paciente;
  historiaGenero: HistoriaGenero;
  prendaYdieta: PrendaYDieta;
}


//TABLA DE PACIENTES
export interface DatosPaciente {
    [x: string]: any;
    id_paciente?: number;
    rut_paciente?: string;
    nombre_paciente?: string;
    apellido_paterno_paciente?: string;
    apellido_materno_paciente?: string;
    nombre_centro_salud?: string;
}

export interface Estadistica {
  edad: number;
  fecha_nacimiento: string; // Supongo que aquí tienes un tipo de fecha en formato ISO 8601
}
