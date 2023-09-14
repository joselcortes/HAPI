export interface Formulario1Datos {
    runPasaportePaciente?: string | undefined;
    nombresPaciente?: string;
    apellidoPaternoPaciente?: string;
    apellidoMaternoPaciente?: string;
    fechaNacimientoPaciente?: string;
    edadPaciente?: string;
    nombreSocialPaciente?: string;
    pronombrePaciente?: string;
    domicilioPaciente?: string;
    numeroTelefonicoPaciente?: string;
    runPasaporteResponsable?: string;
    nombresResponsable?: string;
    apellidoPaternoResponsable?: string;
    apellidoMaternoResponsable?: string;
    fechaNacimientoResponsable?: string;
    edadResponsable?: number;
    domicilioResponsable?: string;
    numeroTelefonicoResponsable?: string;
    runPasaporteAcompaniante?: string;
    nombresAcompaniante?: string;
    apellidoPaternoAcompaniante?: string;
    apellidoMaternoAcompaniante?: string;
    parentescoAcompaniante?: string;
    numeroTelefonicoAcompaniante?: string;
}

export interface Formulario2Datos {
    generoSeleccionado?: string;
    orientacionSexualSeleccionada?: string;
    inicioTransicion?: string;
    tiempoLatencia?: string;
    valorRangoAutopercepción?: number;
    usoBinder?: boolean;
    usoTucking?: boolean;
    usoPacking?: boolean;
    usoOtro?: boolean;
    usoNinguno?: boolean;
    apoyoFamiliar?: boolean; 
    textoElementosDisforia?: string;
    checkHabilitarCampoDisforia?: boolean;
}

export interface Formulario3Datos {
    textoFarmacos?: string;
    checkHabilitarCampoFarmaco?: boolean;
    textoApoyoEscolaridad?: string;
    checkHabilitarCampoApoyoEscolaridad?: boolean;
    textoDrogas?: string;
    checkHabilitarCampoDrogas?: boolean;
    alimentacionSeleccionada?: string;
    controlEquipoSaludMental?: boolean;
    psicoterapia?: boolean;
    evaluacionPsiquiatrica?: boolean;
    diagnosticosPsiquiatricos?: boolean;
}

export interface Formulario4Datos {
    textoAntecedentesPerinatales?: string;
    textoAntecedentesMorbidosHospitalizaciones?: string;
    textoAntecedentesQuirurgicos?: string;
    textoAlergiasFocos?: string;
    textoInmunizacionesSegunPNI?: string;
    textoFuncionalidadGenital?: string;
    textoAntecedentesFamiliares?: string;
    textoJudializacion?: string;
    checkHabilitarJudializacion?: boolean;
}

export interface Formulario5Datos {
    textoJudializacion: string;
    checkHabilitarJudializacion: boolean;
}
