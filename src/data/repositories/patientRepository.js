import db from '../database/connection';

class PatientRepository {

    async obtenerTodosLosPacientes() {
        return await db.getAllAsync('SELECT * FROM patients ORDER BY full_name');
    }

    async obtenerPacientePorRut(rut) {
        return await db.getFirstAsync(
            'SELECT * FROM patients WHERE TRIM(rut) = TRIM(?)',
            [rut]
        );
    }

    async guardarNuevoPaciente(patient) {
        return await db.runAsync(
            `INSERT INTO patients (rut, full_name, email, phone, created_by)
             VALUES (?, ?, ?, ?, ?)`,
            [
                patient.rut,
                patient.fullName,
                patient.email ?? null,
                patient.phone,
                patient.createdBy,
            ]
        );
    }

}

export default new PatientRepository();
