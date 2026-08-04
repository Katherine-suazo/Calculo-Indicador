import diagnosisRepository from "../data/repositories/diagnosisRepository";

class DiagnosticoService {
  calculateIndicador(dataForm) {
    const answers =
      typeof dataForm === "string" ? JSON.parse(dataForm) : dataForm;

    if (!answers || typeof answers !== "object") {
      throw new Error("Las respuestas del indicador no son validas");
    }

    let score = 0;
    for (const value of Object.values(answers)) {
      const numericValue = Number(value);
      if (Number.isNaN(numericValue)) {
        throw new Error("Todas las respuestas deben ser numericas");
      }
      score += numericValue;
    }

    return score;
  }

  async saveIndicador(score, patientId, professionalId = null) {
    if (!patientId) {
      throw new Error("Debe seleccionar un paciente");
    }

    return await diagnosisRepository.insert({
      score,
      patientId,
      professionalId,
      diagnosisDate: new Date().toISOString(),
    });
  }

  async obtenerDiagnosticosPorPaciente(id) {
    return await diagnosisRepository.getDiagnosesByPatientId(id);
  }

}

export const diagnosticoService = new DiagnosticoService();
export { diagnosticoService as DiagnosticoService };
