import db from '../database/connection';

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
            `INSERT INTO professionals (rut, full_name, email)
             VALUES (?, ?, ?)`,
            [
                professional.rut,
                professional.fullName,
                professional.email ?? null,
            ]
        );
    }

}

export default new ProfessionalRepository();
