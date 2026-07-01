import db from '../database/connection';

class PatientRepository {

    async getAll() {
        return await db.getAllAsync('SELECT * FROM patients ORDER BY full_name');
    }

    async getByRut(rut) {
        return await db.getFirstAsync(
            'SELECT * FROM patients WHERE rut = ?',
            [rut]
        );
    }

    async insert(patient) {
        return await db.runAsync(
            `INSERT INTO patients (rut, full_name, email, phone, created_by)
             VALUES (?, ?, ?, ?, ?)`,
            [
                patient.rut,
                patient.fullName,
                patient.email ?? null,
                patient.phone ?? null,
                patient.createdBy ?? null,
            ]
        );
    }

}

export default new PatientRepository();
