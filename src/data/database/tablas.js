import db from './connection';


export function crearTablas() {
    db.execSync("PRAGMA foreign_keys = ON;")

    // TABLA PACIENTES ---------
    db.execSync (`
        CREATE TABLE IF NOT EXISTS paciente(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            rut TEXT NOT NULL UNIQUE,
            nombre TEXT NOT NULL,
            correo TEXT,
            celular INTEGER
        )
    `);

    // TABLA PROFESIONAL ---------
    db.execSync (`
        CREATE TABLE IF NOT EXISTS profesional(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            rut TEXT NOT NULL UNIQUE,
            nombre TEXT NOT NULL,
        )
    `);

    // TABLA DIAGNOSTICO ---------
    db.execSync (`
        CREATE TABLE IF NOT EXISTS diagnostico(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            puntaje INTEGER NOT NULL,
            pacienteId INTEGER,
            profesionalId  INTEGER,
            FOREIGN KEY (pacienteId) REFERENCES paciente(id) ON DELETE RESTRICT,
            FOREIGN KEY (profesionalId) REFERENCES profesional(id) ON DETELE RESTRICT
        )
    `);

}


// ctrl + shift + u + 60 + enter    (`)

