import patientRepository from '../data/repositories/patientRepository';


class PacienteService {

    async getPacientes() {
        return await patientRepository.obtenerTodosLosPacientes();
    }

    async savePaciente(data) {
        const patient = normalizePatient(data);

        if (!patient.rut || !patient.fullName || !patient.phone || !patient.createdBy) {
            throw new Error('Debe ingresar rut y nombre del paciente');
        }

        return await patientRepository.guardarNuevoPaciente(patient);
    }

    async findByRut(rut) {
        return await patientRepository.obtenerPacientePorRut(rut);
    }
}

function normalizePatient(data) {
    return {
        rut: data.rut?.trim(),
        fullName: (data.fullName ?? data.nombre)?.trim(),
        email: (data.email ?? data.correo)?.trim() ?? null,
        phone: (data.phone ?? data.celular)?.trim() ?? null,
        createdBy: data.createdBy ?? data.professionalId ?? null,
    };
}

export const pacienteService = new PacienteService();
export { pacienteService as PacienteService };
