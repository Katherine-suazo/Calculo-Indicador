import db from "../database/connection";


class ProfessionalRepository {
    
    async getAll() {
        return await db.getAllAsync('SELECT * FROM professionals ORDER BY full_name');
    }

    async getByTaxId(taxId) {
        return await db.getFirstAsync(
            'SELECT * FROM professionals WHERE tax_id = ?',
            [taxId]
        );
    }

    async insert(professional) {
        return await db.runAsync(
            `INSERT INTO professionals (tax_id, full_name, email)
             VALUES (?, ?, ?)`,
            [
                professional.taxId,
                professional.fullName,
                professional.email ?? null,
            ]
        );
    }
}


export default new ProfessionalRepository();
