import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { RadioButton } from 'react-native-paper';
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const preguntas = [
    {
        id: 1,
        pregunta: '1. Localización de la herida primaria',
        opciones: [
            { opcion: 'Falanges', score: 1 },
            { opcion: 'Metatarsal', score: 2 },
            { opcion: 'Tarsal', score: 3 },
        ]
    },
    {
        id: 2,
        pregunta: '2. Localización topográfica',
        opciones: [
            { opcion: 'Dorsal o Plantar', score: 1 },
            { opcion: 'Lateral o Medial', score: 2 },
            { opcion: 'Dos o mas', score: 3 },
        ]
    },
    {
        id: 3,
        pregunta: '3. Numero de zonas afectadas (ver 1)',
        opciones: [
            { opcion: 'Una', score: 1 },
            { opcion: 'Dos', score: 2 },
            { opcion: 'Tres', score: 3 },
        ]
    },
    {
        id: 4,
        pregunta: '4. Isquemia',
        definicion: 'ITB: Indice tobillo-brazo, medido por doopler | IDB: Indice, con dedo se refiere al hallux, medido por doppler',
        opciones: [
            { opcion: 'Sin isquemia, sin signos ni sintomas, pulsos pedio y/o tibial posterior (TP) palpables, o ITB 0.90-1.2', score: 0 },
            { opcion: 'Pulsos palpables, levemente disminuidos o ITB 0.89-0.7 o IDB 0.74-0.6', score: 1 },
            { opcion: 'Pulsos debiles, poco palpables o ITB 0.69-0.5 o IDB 0.59-0.3', score: 2 },
            { opcion: 'Sin pulsos palpables o ITB < 0.5 o IDB < 0.3', score: 3 },
        ]
    },
    {
        id: 5,
        pregunta: '5. Infeccion',
        definicion: 'SIRS: Sindrome de respuesta inflamatoria sistematica',
        opciones: [
            { opcion: 'Sin signos de infeccion', score: 0 },
            { opcion: 'Eritemia < 2cm, descarga purulenta, caliente, doloroso', score: 1 },
            { opcion: 'Eritemia < 2cm, infeccion en musculo, tendon articulaciones o hueso', score: 2 },
            { opcion: 'SIRS, hiperglicemia o hipoglicemia secundaria', score: 3 },
        ]
    },
    {
        id: 6,
        pregunta: '6. Edema',
        opciones: [
            { opcion: 'Sin edema', score: 0 },
            { opcion: 'Alrededor de la herida', score: 1 },
            { opcion: 'Un pie o una pierna', score: 2 },
            { opcion: 'Bilateral, secundaria a comorbilidades', score: 3 },
        ]
    },
    {
        id: 7,
        pregunta: '7. Neuropatia',
        opciones: [
            { opcion: 'Sin neuropatia', score: 0 },
            { opcion: 'Sensibilidad protectora disminuida a monofilamento o diapason de 128 Hz', score: 1 },
            { opcion: 'Sensibilidad protectora ausente a monofilamento o diapason de 128 Hz', score: 2 },
            { opcion: 'Pie de Charcot o Neurosteoartropia diabetica', score: 3 },
        ]
    },
    {
        id: 8,
        pregunta: '8. Area',
        opciones: [
            { opcion: 'Pequena (< 10 cm2)', score: 1 },
            { opcion: 'Mediana (10 - 40 cm2)', score: 2 },
            { opcion: 'Grande (> 40 cm2)', score: 3 },
        ]
    },
    {
        id: 9,
        pregunta: '9. Profundidad',
        opciones: [
            { opcion: 'Superficial (piel)', score: 1 },
            { opcion: 'Tendones, fascia, musculos', score: 2 },
            { opcion: 'Articular, huesos', score: 3 },
        ]
    },
    {
        id: 10,
        pregunta: '10. Etapa de Cicatrizacion',
        opciones: [
            { opcion: 'Epitelizacion', score: 1 },
            { opcion: 'Granulatoria', score: 2 },
            { opcion: 'Inflamatoria', score: 3 },
        ]
    },
];


const InputRadio = ({ onFinalizar }) => {

    const [pasoActual, setPasoActual] = useState(0);
    const [respuestas, setRespuestas] = useState({});

    const preguntaActual = preguntas[pasoActual];

    const handleSeleccionarOpcion = (opcion) => {
        setRespuestas({ ...respuestas, [preguntaActual.id]: opcion.score });
    }

    const handleSeguiente = () => {
        if (respuestas[preguntaActual.id] === undefined) {
            Alert.alert('Opcion requerida', 'Debe seleccionar una opcion antes de continuar');
            return;
        }

        if (pasoActual < preguntas.length - 1) {
            setPasoActual(pasoActual + 1);
        }
        else {
            calcularResultado();
        }
    }

    const handleAnterior = () => {
        if (pasoActual > 0) {
            setPasoActual(pasoActual - 1);
        }
    }

    const calcularResultado = () => {
        const total = Object.values(respuestas).reduce(
            (acumulador, respuesta) => acumulador + respuesta, 0
        );
        console.log('Respuestas:', respuestas);
        console.log('Puntaje total:', total);


        onFinalizar(total, respuestas);
    }


    return (
        <View style={styles.container}>

            <Text style={styles.preguntaCount} >Pregunta {pasoActual + 1} de {preguntas.length}</Text>

            <ScrollView
                style={styles.contenido}
                contentContainerStyle={styles.contenidoContainer}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.preguntaContainer} >{preguntaActual.pregunta}</Text>

                <Text style={styles.definicionTexto}>{preguntaActual.definicion}</Text>

                {preguntaActual.opciones.map((opcion) => {

                    const seleccionada = respuestas[preguntaActual.id] === opcion.score;

                    return (

                        <TouchableOpacity
                            key={opcion.score}
                            style={styles.opcionContainer}
                            onPress={() => handleSeleccionarOpcion(opcion)}
                        >
                            <Text style={styles.opcionTexto}> {opcion.opcion} </Text>

                            <RadioButton
                                value={String(opcion.score)}
                                status={seleccionada ? 'checked' : 'unchecked'}
                                onPress={() => handleSeleccionarOpcion(opcion)}
                            />
                        </TouchableOpacity>

                    )

                })}
            </ScrollView>

            <View style={styles.contenedorBotones}>

                <TouchableOpacity
                    onPress={handleAnterior}
                    disabled={pasoActual === 0}
                    style={[styles.button, pasoActual === 0 ? styles.buttonDeshabilitado : styles.buttonAnterior]}
                >
                    <Text style={[styles.buttonText, pasoActual === 0 && styles.textoDeshabilitado]} > Anterior </Text>
                </TouchableOpacity>


                <TouchableOpacity onPress={handleSeguiente} style={[styles.button, { backgroundColor: '#9d83ce' }]}>
                    <Text style={styles.buttonText}>
                        {pasoActual === preguntas.length - 1 ? 'Finalizar' : 'Siguiente'}
                    </Text>
                </TouchableOpacity>

            </View>


        </View>

    );
};

export default InputRadio;



const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 13,
    },

    contenido: {
        flex: 1,
    },

    contenidoContainer: {
        paddingBottom: 20,
    },

    contenedorBotones: {
        flexDirection: 'row',
        width: '100%',
        paddingVertical: 10,
    },

    button: {
        flex: 1,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        marginHorizontal: 8,
    },

    buttonAnterior: {
        backgroundColor: '#9d83ce',
    },

    buttonSiguiente: {
        backgroundColor: '#9d83ce',
    },

    buttonDeshabilitado: {
        backgroundColor: '#b598e2',
        opacity: 0.6,
    },

    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },

    preguntaCount: {
        fontSize: 15,
        textAlign: 'center',
        paddingVertical: 10,
    },

    preguntaContainer: {
        fontSize: 20,
        paddingTop: 15,
    },

    definicionTexto: {
        fontSize: 15,
        paddingTop: 10,
        color: '#6a6c76',
    },

    opcionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingVertical: 10,
    },

    opcionTexto: {
        flex: 1,
        fontSize: 18,
        paddingRight: 12,
    },
});