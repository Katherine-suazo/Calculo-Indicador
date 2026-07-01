import db from '../database/connection';


class DiagnosticoRepositorio {
    
    async getAll() {
        return await db.getAllAsync('select * from diagnostico');
    }
    async insert(diagnostico) {
        return await db.runAsync(
            'insert into diagnostico(puntaje, pacienteId, profesionalId) values (?, ?, ?)',
            [ diagnostico.puntaje, diagnostico.pacienteId, diagnostico.profesionalId ]
        );
    }

}

export default new DiagnosticoRepositorio();