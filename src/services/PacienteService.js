import patientRepository from '../data/repositories/patientRepository';


class PacienteService {

  async getPacientes() {
    return await patientRepository.obtenerTodosLosPacientes();
  }

  async savePaciente(data) {

    const patient = normalizePatient(data);

    if (!patient.rut || !patient.fullName || !patient.phone || !patient.createdBy) {
      throw new Error('Faltan campos por llenar');
    }

    const rutFormateado = ValidarYFormatearRut(patient.rut);

    patient.rut = rutFormateado;

    const resultado = await patientRepository.guardarNuevoPaciente(patient);

    return { resultado, paciente: patient };

  }

  async getPacienteDiagnosticos() {
    return await patientRepository.obtenerUltiDiagPaciente();
  }

  async findByRut(rut) {
    const rutFormateado = ValidarYFormatearRut(rut)
    return await patientRepository.obtenerPacientePorRut(rut);
  }

  async findByName(name) {
    return await patientRepository.obtenerPacientePorNombre(name);
  }

  async deletePaciente(rut) {
    return await patientRepository.eliminarPacientePorRut(rut);
  }
}




function calcularDigitoVerificador(num) {
  let suma = 0;
  let multiplicador = 2;

  for (let i = num.length - 1; i >= 0; i--) {
    suma += parseInt(num.charAt(i)) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resto = 11 - (suma % 11);

  if (resto === 11) return '0';
  if (resto === 10) return 'k';
  return resto.toString();
}


function ValidarYFormatearRut(rut) {
  const rutLimpio = rut.trim().replace(/\./g, "").replace(/-/g, "").toUpperCase();

  if (rutLimpio.length < 8 || rutLimpio.length > 9) {
    throw new Error("Rut invalido 1");
  }

  const regex = /^[0-9]+[0-9Kk]$/;

  if (!regex.test(rutLimpio)) {
    throw new Error("Rut invalido 2")
  }

  const cuerpo = rutLimpio.slice(0, -1);
  const dvEntregado = rutLimpio.slice(-1).toLowerCase();
  const dvCalculado = calcularDigitoVerificador(cuerpo);

  if (dvCalculado !== dvEntregado) {
    throw new Error("Rut invalido 3")
  }

  const cuerpoFormateado = Number(cuerpo).toLocaleString("es-CL");

  return `${cuerpoFormateado}-${dvEntregado.toUpperCase()}`;
}



function normalizePatient(data) {
  return {
    rut: data.rut?.trim(),
    fullName: (data.fullName ?? data.nombre)?.trim(),
    email: (data.email ?? data.correo)?.trim() ?? null,
    phone: (data.phone ?? data.celular)?.trim(),
    createdBy: data.createdBy ?? data.professionalId ?? null,
  };
}



export const pacienteService = new PacienteService();
export { pacienteService as PacienteService };
