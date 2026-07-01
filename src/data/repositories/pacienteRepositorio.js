import db from '../database/connection';


class PacienteRepositorio {

    async getAll() {
        return await db.getAllAsync('select * from paciente');
    }
    async insert(paciente) {
        return await db.runAsync(
            'insert into paciente(rut, nombre, correo, celular) values (?, ?, ?, ?)',
            [ paciente.rut, paciente.nombre, paciente.correo, paciente.celular ]
        );
    }

}


export default new PacienteRepositorio();  


