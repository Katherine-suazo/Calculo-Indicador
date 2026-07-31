import professionalRepository from '../data/repositories/professionalRepository';

class ProfessionalService {

    async getProfesionales() {
        return await professionalRepository.getAll();
    }

    async iniciarSesion(datos) {

        if (!datos.rut || !datos.fullName) {
            throw new Error('Debe ingresar rut y nombre');
        }

        const rutFormateado = ValidarYFormatearRut(datos.rut);

        datos.rut = rutFormateado;

        const existingProfessional = await professionalRepository.getByRut(datos.rut);

        if (existingProfessional) {
            return existingProfessional;
        }

        const result = await professionalRepository.insert({
            rut: datos.rut,
            fullName: datos.fullName,
        });

        return {
            id: result.lastInsertRowId,
            rut: datos.rut,
            full_name: datos.fullName,
        };
    }
}

function calcularDigitoVerificador(num) {
    let suma = 0;
    let multiplicador = 2;

    for (let i = num.length - 1; i >= 0; i--) {
        suma += parseInt(num.charAt(i)) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const resto = 11 - (suma % 11);

    if (resto === 11) return '0';
    if (resto === 10) return 'k';
    return resto.toString();
}


function ValidarYFormatearRut(rut) {

    const rutLimpio = rut.trim().replace(/\./g, "").replace(/-/g, "").toUpperCase();

    if (rutLimpio.length < 8 || rutLimpio.length > 9) { // length obtener el tamaño o la longitud
            throw new Error("Rut invalido 1");
        }

        const regex = /^[0-9]+[0-9Kk]$/;

        if (!regex.test(rutLimpio)) { // test() ejecuta una búsqueda de una ocurrencia entre una expresión regular y una cadena de texto
            throw new Error("Rut invalido 2")
        }

        const cuerpo = rutLimpio.slice(0, -1); // slice() Toma desde el primer carácter (índice 0) hasta el penúltimo (índice -1)
        const dvEntregado = rutLimpio.slice(-1).toLowerCase(); // slice() extrae únicamente el último carácter. toLowerCase() lo vuelve minuscula
        const dvCalculado = calcularDigitoVerificador(cuerpo);

        if (dvCalculado !== dvEntregado) {
            throw new Error("Rut invalido 3")
        }

        const cuerpoFormateado = Number(cuerpo).toLocaleString("es-CL");

        return `${cuerpoFormateado}-${dvEntregado.toUpperCase()}`;
}



export const profesionalService = new ProfessionalService();
export { profesionalService as ProfesionalServicio };
