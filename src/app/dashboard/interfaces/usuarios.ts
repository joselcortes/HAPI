export interface Usuarios{
  id_profesional_salud:number;
  rut_profesional_salud:string,
  nombre_usuario: string,
  cargo_profesional_salud: string,
  roles:string,
  nombre_centro_salud:string,
}
export interface Usuarios1{

  rutProfesional: string,
  nombreProfesional: string,
  emailProfesional:string,
  cargoProfesional: string,
  contrasenaProfesional: string,
  rolProfesional: string,
  centroProfesional: string,

}


export interface crearUsuario{

  rutProfesional: string,
  nombreProfesional: string,
  contrasenaProfesional:string,
  cargoProfesional:string,
  centroProfesional:string,
  rolProfesional:string,

}


export interface datosProfesionalSalud {
  cargo_profesional_salud: string,
  fk_centro_salud: number,
  id_profesional_salud: number,
  nombre_usuario: string,
  roles: string,
  rut_profesional_salud: string
};