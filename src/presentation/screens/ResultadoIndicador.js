import { View, StyleSheet, TouchableOpacity, Text, Alert, ScrollView } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { diagnosticoService } from '../../services/DiagnosticoService';

export function ResultadoIndicadorScreen({ navigation }) {
    const [loading, setLoading] = useState(false);

    const route = useRoute();
    const { score, respuestas, patientId, pacienteNombre, pacienteRut } = route.params ?? {};

    const handlePerfilPaciente = async () => {
        navigation.goBack();
    };

    const handleGuardarIndicador = async () => {
        if (loading) {
            return;
        }

        if (score === undefined || score === null) {
            Alert.alert('Resultado no disponible', 'No se recibió el puntaje del indicador.');
            return;
        }

        if (!patientId) {
            Alert.alert('Paciente no disponible', 'No se recibió el identificador del paciente.');
            return;
        }

        setLoading(true);

        try {
            const jsonValue = await AsyncStorage.getItem("profesionalId");
            const professionalId = jsonValue != null ? JSON.parse(jsonValue) : null;

            const resultado = await diagnosticoService.saveIndicador(score, patientId, professionalId);

            console.log('Diagnóstico guardado: ', resultado);

            Alert.alert(
                'Diagnóstico Guardado', 'El resultado fue guardado correctamente.',
                [{
                    text: 'Aceptar',
                    onPress: () => { navigation.navigate('PerfilPaciente', { rutPaciente: pacienteRut }); }
                }]
            );
        }
        catch (error) {
            console.error("Error guardando diagnóstico", error);
            Alert.alert('Error', error.message ?? 'No se pudo guardar el diagnóstico.');
        }
        finally {
            setLoading(false);
        }
    };

    const isLeve = score <= 10;
    const isModerado = score > 10 && score <= 20;

    const badgeStyle = isLeve
        ? styles.badgeLeve
        : isModerado
        ? styles.badgeModerado
        : styles.badgeSevero;

    const badgeTextStyle = isLeve
        ? styles.badgeTextoLeve
        : isModerado
        ? styles.badgeTextoModerado
        : styles.badgeTextoSevero;

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.container}>
                    <Text style={styles.subtituloHeader}>Evaluación de Riesgo</Text>
                    <Text style={styles.tituloResultado}>Resultado del Indicador</Text>

                    {/* BLOQUE DE PUNTAJE */}
                    <View style={styles.cardPuntaje}>
                        <Text style={styles.puntajeLabel}>Puntaje Total Obtencion</Text>
                        <Text style={styles.puntajeNumero}>
                            {score ?? 0} <Text style={styles.puntajeTotal}>/ 30</Text>
                        </Text>
                    </View>

                    {/* BADGE DE NIVEL */}
                    <View style={[styles.badgeContainer, badgeStyle]}>
                        <Text style={[styles.badgeTexto, badgeTextStyle]}>
                            {isLeve ? "Leve" : isModerado ? "Moderado" : "Severo"}
                        </Text>
                    </View>

                    {/* RECOMENDACIONES CLÍNICAS */}
                    <View style={styles.cardDivider} />

                    {isLeve ? (
                        <View style={styles.seccionDefinicion}>
                            <Text style={styles.tituloDefinicion}>Bajo riesgo de amputación</Text>
                            <Text style={styles.textoDefinicion}>
                                • Manejo en APS - Enfermera(o) Curación Avanzada.
                            </Text>
                        </View>
                    ) : isModerado ? (
                        <View style={styles.seccionDefinicion}>
                            <Text style={styles.tituloDefinicion}>Riesgo parcial de amputación (&lt; 30%)</Text>
                            <Text style={styles.textoDefinicion}> • Con ítem de isquemia 0, sin signos de osteomielitis: Manejo en APS por Enfermera(o) Curación Avanzada.</Text>
                            <Text style={styles.textoDefinicion}>
                                • Con ítem de isquemia 0, con signos de osteomielitis: Derivación a nivel secundario para su manejo.
                            </Text>
                            <Text style={styles.textoDefinicion}>
                                • Con ítem de isquemia ≤ 1: Derivación a nivel secundario para su manejo.
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.seccionDefinicion}>
                            <Text style={styles.tituloDefinicion}>Alto riesgo de amputación</Text>
                            <Text style={styles.subtituloSevero}>Amenaza de la extremidad y la vida</Text>
                            <Text style={styles.textoDefinicion}>
                                • Derivación inmediata a servicio de urgencia (evaluación urgente por cirujano).
                            </Text>
                        </View>
                    )}
                </View>

                {/* BOTÓN GUARDAR RESULTADO */}
                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleGuardarIndicador}
                    disabled={loading}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonText}>
                        {loading ? 'Guardando...' : 'Guardar Resultado'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F1F5F9',
    },

    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
    },

    container: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        padding: 22,
        borderRadius: 20,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
        marginBottom: 16,
        alignItems: 'center',
    },

    subtituloHeader: {
        fontSize: 13,
        fontWeight: '600',
        color: '#2563EB',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 2,
    },

    tituloResultado: {
        fontSize: 22,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 18,
        letterSpacing: -0.3,
    },

    cardPuntaje: {
        backgroundColor: '#F8FAFC',
        width: '100%',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 14,
    },

    puntajeLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#64748B',
        marginBottom: 4,
    },

    puntajeNumero: {
        fontSize: 34,
        fontWeight: '800',
        color: '#0F172A',
    },

    puntajeTotal: {
        fontSize: 18,
        fontWeight: '600',
        color: '#94A3B8',
    },

    badgeContainer: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        marginBottom: 12,
    },

    badgeTexto: {
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.3,
    },

    badgeLeve: {
        backgroundColor: '#DCFCE7',
    },

    badgeTextoLeve: {
        color: '#166534',
    },

    badgeModerado: {
        backgroundColor: '#FEF3C7',
    },

    badgeTextoModerado: {
        color: '#92400E',
    },

    badgeSevero: {
        backgroundColor: '#FEE2E2',
    },

    badgeTextoSevero: {
        color: '#991B1B',
    },

    cardDivider: {
        height: 1,
        width: '100%',
        backgroundColor: '#E2E8F0',
        marginVertical: 12,
    },

    seccionDefinicion: {
        width: '100%',
    },

    tituloDefinicion: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 8,
        textAlign: 'center',
    },

    subtituloSevero: {
        fontSize: 14,
        fontWeight: '600',
        color: '#DC2626',
        textAlign: 'center',
        marginBottom: 10,
    },

    textoDefinicion: {
        fontSize: 14,
        color: '#334155',
        lineHeight: 20,
        marginBottom: 8,
    },

    button: {
        backgroundColor: '#2563EB',
        height: 52,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },

    buttonDisabled: {
        opacity: 0.65,
    },

    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.2,
    },
});