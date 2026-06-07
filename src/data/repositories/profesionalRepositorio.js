import db from "../database/connection";


class ProfesionalRespositorio {
    
    async getAll() {
        return await db.getAllAsync('select * from profesional');
    }
    async insert(profesional) {
        return await db.runAsync(
            'insert into profesional(rut, nombre, correo) values (?, ?, ?)',
            [ profesional.rut, profesional.nombre, profesional.correo ]
        );
    }
}


export default new ProfesionalRespositorio();