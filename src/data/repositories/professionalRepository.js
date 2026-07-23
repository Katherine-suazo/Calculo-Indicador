import db from '../database/connection';
import { PacienteService } from '../../services/PacienteService';

class ProfessionalRepository {

    async getAll() {
        return await db.getAllAsync('SELECT * FROM professionals ORDER BY full_name');
    }

    async getByRut(rut) {
        return await db.getFirstAsync(
            'SELECT * FROM professionals WHERE rut = ?',
            [rut]
        );
    }

    async insert(professional) {
        return await db.runAsync(
            `INSERT INTO professionals (rut, full_name)
             VALUES (?, ?)`,
            [
                professional.rut,
                professional.fullName,
            ]
        );
    }

}

export default new ProfessionalRepository();
