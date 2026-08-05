import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { RadioButton } from 'react-native-paper';
import React, { useState } from "react";

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
            { opcion: 'Dos o más', score: 3 },
        ]
    },
    {
        id: 3,
        pregunta: '3. Número de zonas afectadas',
        opciones: [
            { opcion: 'Una', score: 1 },
            { opcion: 'Dos', score: 2 },
            { opcion: 'Tres', score: 3 },
        ]
    },
    {
        id: 4,
        pregunta: '4. Isquemia',
        definicion: 'ITB: Índice tobillo-brazo | IDB: Índice dedo-brazo (Hallux)',
        opciones: [
            { opcion: 'Sin isquemia, sin signos ni síntomas, pulsos pedio y/o TP palpables, o ITB 0.90-1.2', score: 0 },
            { opcion: 'Pulsos palpables, levemente disminuidos o ITB 0.89-0.7 o IDB 0.74-0.6', score: 1 },
            { opcion: 'Pulsos débiles, poco palpables o ITB 0.69-0.5 o IDB 0.59-0.3', score: 2 },
            { opcion: 'Sin pulsos palpables o ITB < 0.5 o IDB < 0.3', score: 3 },
        ]
    },
    {
        id: 5,
        pregunta: '5. Infección',
        definicion: 'SIRS: Síndrome de Respuesta Inflamatoria Sistémica',
        opciones: [
            { opcion: 'Sin signos de infección', score: 0 },
            { opcion: 'Eritema < 2cm, descarga purulenta, caliente, doloroso', score: 1 },
            { opcion: 'Eritema > 2cm, infección en músculo, tendón, articulaciones o hueso', score: 2 },
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
        pregunta: '7. Neuropatía',
        opciones: [
            { opcion: 'Sin neuropatía', score: 0 },
            { opcion: 'Sensibilidad protectora disminuida a monofilamento o diapasón de 128 Hz', score: 1 },
            { opcion: 'Sensibilidad protectora ausente a monofilamento o diapasón de 128 Hz', score: 2 },
            { opcion: 'Pie de Charcot o Neuroosteoartropatía diabética', score: 3 },
        ]
    },
    {
        id: 8,
        pregunta: '8. Área',
        opciones: [
            { opcion: 'Pequeña (< 10 cm²)', score: 1 },
            { opcion: 'Mediana (10 - 40 cm²)', score: 2 },
            { opcion: 'Grande (> 40 cm²)', score: 3 },
        ]
    },
    {
        id: 9,
        pregunta: '9. Profundidad',
        opciones: [
            { opcion: 'Superficial (piel)', score: 1 },
            { opcion: 'Tendones, fascia, músculos', score: 2 },
            { opcion: 'Articular, huesos', score: 3 },
        ]
    },
    {
        id: 10,
        pregunta: '10. Etapa de Cicatrización',
        opciones: [
            { opcion: 'Epitelización', score: 1 },
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
    };

    const handleSeguiente = () => {
        if (respuestas[preguntaActual.id] === undefined) {
            Alert.alert('Opción requerida', 'Debe seleccionar una opción antes de continuar');
            return;
        }

        if (pasoActual < preguntas.length - 1) {
            setPasoActual(pasoActual + 1);
        }
        else {
            calcularResultado();
        }
    };

    const handleAnterior = () => {
        if (pasoActual > 0) {
            setPasoActual(pasoActual - 1);
        }
    };

    const calcularResultado = () => {
        const total = Object.values(respuestas).reduce(
            (acumulador, respuesta) => acumulador + respuesta, 0
        );
        onFinalizar(total, respuestas);
    };

    return (
        <View style={styles.container}>
            {/* ENCABEZADO DE PROGRESO */}
            <View style={styles.progressHeader}>
                <Text style={styles.preguntaCount}>
                    Pregunta <Text style={styles.pasoHighlight}>{pasoActual + 1}</Text> de {preguntas.length}
                </Text>
            </View>

            <ScrollView
                style={styles.contenido}
                contentContainerStyle={styles.contenidoContainer}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.preguntaTitulo}>{preguntaActual.pregunta}</Text>

                {preguntaActual.definicion && (
                    <View style={styles.definicionBox}>
                        <Text style={styles.definicionTexto}>{preguntaActual.definicion}</Text>
                    </View>
                )}

                <View style={styles.opcionesLista}>
                    {preguntaActual.opciones.map((opcion) => {
                        const seleccionada = respuestas[preguntaActual.id] === opcion.score;

                        return (
                            <TouchableOpacity
                                key={opcion.score}
                                style={[
                                    styles.opcionCard,
                                    seleccionada && styles.opcionCardSeleccionada
                                ]}
                                onPress={() => handleSeleccionarOpcion(opcion)}
                                activeOpacity={0.8}
                            >
                                <Text style={[
                                    styles.opcionTexto,
                                    seleccionada && styles.opcionTextoSeleccionado
                                ]}>
                                    {opcion.opcion}
                                </Text>

                                <RadioButton
                                    value={String(opcion.score)}
                                    status={seleccionada ? 'checked' : 'unchecked'}
                                    onPress={() => handleSeleccionarOpcion(opcion)}
                                    color="#2563EB"
                                    uncheckedColor="#94A3B8"
                                />
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>

            {/* BOTONES DE NAVEGACIÓN */}
            <View style={styles.contenedorBotones}>
                <TouchableOpacity
                    onPress={handleAnterior}
                    disabled={pasoActual === 0}
                    style={[
                        styles.button, 
                        styles.buttonAnterior,
                        pasoActual === 0 && styles.buttonDeshabilitado
                    ]}
                    activeOpacity={0.8}
                >
                    <Text style={[
                        styles.buttonTextAnterior,
                        pasoActual === 0 && styles.textoDeshabilitado
                    ]}>
                        Anterior
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={handleSeguiente} 
                    style={[styles.button, styles.buttonSiguiente]}
                    activeOpacity={0.8}
                >
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
    },

    progressHeader: {
        alignItems: 'center',
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
        marginBottom: 12,
    },

    preguntaCount: {
        fontSize: 13,
        fontWeight: '600',
        color: '#64748B',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },

    pasoHighlight: {
        color: '#2563EB',
        fontWeight: '700',
    },

    contenido: {
        flex: 1,
    },

    contenidoContainer: {
        paddingBottom: 16,
    },

    preguntaTitulo: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 12,
        lineHeight: 24,
        letterSpacing: -0.3,
    },

    definicionBox: {
        backgroundColor: '#EFF6FF',
        borderLeftWidth: 3,
        borderLeftColor: '#2563EB',
        padding: 10,
        borderRadius: 8,
        marginBottom: 16,
    },

    definicionTexto: {
        fontSize: 13,
        color: '#1E40AF',
        fontWeight: '500',
        lineHeight: 18,
    },

    opcionesLista: {
        gap: 10,
    },

    opcionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingVertical: 12,
        paddingHorizontal: 14,
        backgroundColor: '#F8FAFC',
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        borderRadius: 14,
    },

    opcionCardSeleccionada: {
        backgroundColor: '#EFF6FF',
        borderColor: '#2563EB',
    },

    opcionTexto: {
        flex: 1,
        fontSize: 14,
        color: '#334155',
        fontWeight: '500',
        paddingRight: 10,
        lineHeight: 20,
    },

    opcionTextoSeleccionado: {
        color: '#1E3A8A',
        fontWeight: '600',
    },

    contenedorBotones: {
        flexDirection: 'row',
        width: '100%',
        paddingTop: 12,
        gap: 12,
    },

    button: {
        flex: 1,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        height: 48,
    },

    buttonAnterior: {
        backgroundColor: '#F1F5F9',
        borderWidth: 1,
        borderColor: '#CBD5E1',
    },

    buttonSiguiente: {
        backgroundColor: '#2563EB',
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 3,
    },

    buttonDeshabilitado: {
        backgroundColor: '#F8FAFC',
        borderColor: '#E2E8F0',
        elevation: 0,
    },

    buttonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
        letterSpacing: 0.2,
    },

    buttonTextAnterior: {
        color: '#475569',
        fontSize: 15,
        fontWeight: '600',
    },

    textoDeshabilitado: {
        color: '#CBD5E1',
    },
});