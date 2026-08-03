import db from '../database/connection';

class DiagnosisRepository {

    async getAll() {
        return await db.getAllAsync('SELECT * FROM diagnoses ORDER BY diagnosis_date DESC');
    }

    async getByPatientId(patientId) {
        return await db.getAllAsync(
            'SELECT * FROM diagnoses WHERE patient_id = ? ORDER BY diagnosis_date DESC', [patientId]
        );
    }

    async insert(diagnosis) {
        return await db.runAsync(
            `INSERT INTO diagnoses (score, patient_id, professional_id, diagnosis_date)
             VALUES (?, ?, ?, ?)`,
            [
                diagnosis.score,
                diagnosis.patientId,
                diagnosis.professionalId ?? null,
                diagnosis.diagnosisDate ?? new Date().toISOString(),
            ]
        );
    }

}

export default new DiagnosisRepository();
