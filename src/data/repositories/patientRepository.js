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

    async eliminarPacientePorRut(rut) {
        let deleteResult = { changes: 0 };

        await db.withExclusiveTransactionAsync(async (tx) => {
            const patient = await tx.getFirstAsync(
                'SELECT id FROM patients WHERE TRIM(rut) = TRIM(?)',
                [rut]
            );

            await tx.runAsync(
                'DELETE FROM diagnoses WHERE patient_id = ?',
                [patient.id]
            );

            deleteResult = await tx.runAsync(
                'DELETE FROM patients WHERE id = ?',
                [patient.id]
            );
        });

        return deleteResult;
    }

}

export default new PatientRepository();
