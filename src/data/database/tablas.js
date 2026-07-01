import db from './connection';

export function crearTablas() {
    db.execSync('PRAGMA foreign_keys = ON;');

    db.execSync(`
        CREATE TABLE IF NOT EXISTS professionals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            rut TEXT NOT NULL UNIQUE,
            full_name TEXT NOT NULL,
            email TEXT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.execSync(`
        CREATE TABLE IF NOT EXISTS patients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            rut TEXT NOT NULL UNIQUE,
            full_name TEXT NOT NULL,
            email TEXT,
            phone TEXT,
            created_by INTEGER,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (created_by) REFERENCES professionals(id) ON DELETE RESTRICT
        )
    `);

    db.execSync(`
        CREATE TABLE IF NOT EXISTS diagnoses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            score INTEGER NOT NULL,
            patient_id INTEGER NOT NULL,
            professional_id INTEGER,
            diagnosis_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE RESTRICT,
            FOREIGN KEY (professional_id) REFERENCES professionals(id) ON DELETE RESTRICT
        )
    `);
}
