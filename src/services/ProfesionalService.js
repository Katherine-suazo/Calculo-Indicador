import professionalRepository from '../data/repositories/professionalRepository';

class ProfessionalService {

    async getProfesionales() {
        return await professionalRepository.getAll();
    }

    async iniciarSesion(rut, nombre, email = null) {
        if (!rut || !nombre) {
            throw new Error('Debe ingresar rut y nombre');
        }

        const existingProfessional = await professionalRepository.getByRut(rut);

        if (existingProfessional) {
            return existingProfessional;
        }

        const result = await professionalRepository.insert({
            rut,
            fullName: nombre,
            email,
        });

        return {
            id: result.lastInsertRowId,
            rut,
            full_name: nombre,
            email,
        };
    }
}

export const profesionalService = new ProfessionalService();
export { profesionalService as ProfesionalServicio };
