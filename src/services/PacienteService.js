import patientRepository from '../data/repositories/patientRepository';

class PacienteService {

    async getPacientes() {
        return await patientRepository.getAll();
    }

    async savePaciente(data) {
        const patient = normalizePatient(data);

        if (!patient.rut || !patient.fullName) {
            throw new Error('Debe ingresar rut y nombre del paciente');
        }

        return await patientRepository.insert(patient);
    }

    async findByRut(rut) {
        return await patientRepository.getByRut(rut);
    }
}

function normalizePatient(data) {
    return {
        rut: data.rut,
        fullName: data.fullName ?? data.nombre,
        email: data.email ?? data.correo ?? null,
        phone: data.phone ?? data.celular ?? null,
        createdBy: data.createdBy ?? data.professionalId ?? null,
    };
}

export const pacienteService = new PacienteService();
export { pacienteService as PacienteService };
