import db from "../database/connection";

class PatientRepository {
  async obtenerTodosLosPacientes() {
    return await db.getAllAsync("SELECT * FROM patients ORDER BY full_name");
  }

  async obtenerPacientePorRut(rut) {
    return await db.getFirstAsync(
      "SELECT * FROM patients WHERE TRIM(rut) = TRIM(?)",
      [rut],
    );
  }

  async obtenerIdPacientePorId(rut) {
    return await db.getFirstAsync(
      "SELECT id FROM patients WHERE TRIM(rut) = TRIM(?)",
      [rut],
    );
  }

  async obtenerUltiDiagPaciente(limit = 15) {
    return await db.getAllAsync(
      `SELECT
                p.id AS patient_id,
                p.rut,
                p.full_name,
                p.email,
                p.phone,
                d.id AS diagnosis_id,
                d.score,
                d.diagnosis_date
            FROM patients p
            INNER JOIN diagnoses d ON d.patient_id = p.id
            WHERE d.id IN (
                SELECT id FROM diagnoses GROUP BY patient_id HAVING MAX(diagnosis_date)
            )
            ORDER BY d.diagnosis_date DESC 
            LIMIT ?;`,
      [limit],
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
      ],
    );
  }

  async eliminarPacientePorRut(rut) {
    let deleteResult = { changes: 0 };

    await db.withExclusiveTransactionAsync(async (tx) => {
      const patient = await tx.getFirstAsync(
        "SELECT id FROM patients WHERE TRIM(rut) = TRIM(?)",
        [rut],
      );

      await tx.runAsync("DELETE FROM diagnoses WHERE patient_id = ?", [
        patient.id,
      ]);

      deleteResult = await tx.runAsync("DELETE FROM patients WHERE id = ?", [
        patient.id,
      ]);
    });

    return deleteResult;
  }
}

export default new PatientRepository();
