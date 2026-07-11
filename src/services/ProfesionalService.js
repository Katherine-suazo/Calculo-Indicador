import professionalRepository from '../data/repositories/professionalRepository';

class ProfessionalService {

    async getProfesionales() {
        return await professionalRepository.getAll();
    }

    async iniciarSesion(datos) {
        if (!datos.rut || !datos.fullName) {
            throw new Error('Debe ingresar rut y nombre');
        }
        
        const existingProfessional = await professionalRepository.getByRut(datos.rut);
        
        if (existingProfessional) {
            return existingProfessional;
        }
        
        const result = await professionalRepository.insert({
            rut: datos.rut,
            fullName: datos.fullName,   
        });

        return {
            id: result.lastInsertRowId,
            rut: datos.rut,
            full_name: datos.fullName,
        };
    }
}

export const profesionalService = new ProfessionalService();
export { profesionalService as ProfesionalServicio };
