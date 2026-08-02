import { View, StyleSheet, TouchableOpacity, Text, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { diagnosticoService } from '../../services/DiagnosticoService';


export function ResultadoIndicadorScreen({ navigation }) {

    const [loading, setLoading] = useState(false);

    const route = useRoute();

    const { score, respuestas, patientId, pacienteRut, pacienteNombre } = route.params ?? {};

    const handlePerfilPaciente = async () => {
        navigation.goBack();
    };

    const handleGuardarIndicador = async () => {
        if (loading) {
            return;
        }

        if (score === undefined || score === null) {
            Alert.alert('Resultado no disponible', 'No se recibio el puntaje del indicador.');
            return;
        }

        if (!patientId) {
            Alert.alert('Paciente no disponible', 'No se recibio el identificador del paciente.');
            return;
        }

        setLoading(true);

        try {
            const jsonValue = await AsyncStorage.getItem("profesionalId");
            const professionalId = jsonValue != null ? JSON.parse(jsonValue) : null;
            const resultado = await diagnosticoService.saveIndicador(score, patientId, professionalId);

            console.log('Diagnostico guardado: ', resultado);

            Alert.alert(
                'Diagnostico Guardado', 'El resultado fue guardado correctamente.',
                [{
                    text: 'Aceptar',
                    onPress: () => { navigation.navigate('PerfilPaciente', { rutPaciente: pacienteRut }) }
                }]
            );
        }
        catch (error) {
            console.error("Error guarguando diagnostico", error);
            Alert.alert('Error', error.message ?? 'No se pudo guardar el diagnostico.');
        }
        finally {
            setLoading(false);
        }
    }

    return (

        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>

            <View style={styles.container}>

                <Text style={styles.tituloResultado}>Resultado</Text>

                <Text style={styles.puntaje}>Total Puntaje:</Text>

                <Text style={styles.puntajeNumero}>{score} de 30</Text>

                <View>

                    {score <= 10 ? (
                        <View>
                            <Text style={styles.leve}>Leve</Text>
                            <Text style={styles.tituloDefinicion}>Bajo riesgo de amputacion</Text>
                            <Text style={styles.textoDefinicion}>Manejo en APS - Enfermera(o) Curacion Avanzada.</Text>
                        </View>
                    ) : score <= 20 ? (
                        <View>
                            <Text style={styles.moderado}>Moderado</Text>
                            <Text style={styles.tituloDefinicion}>Riesgo parcial de amputacion menor al 30%</Text>
                            <Text style={styles.textoDefinicion}>Con item de isquemia 0, sin signos de osteomielitis: Manejo de APS, Enfermero(o) Curacion avanzada</Text>
                            <Text style={styles.textoDefinicion}>Con item de isquemia 0, con signos de osteomielitis derivacion nivel 2rio para su manejo.</Text>
                            <Text style={styles.textoDefinicion}>Con item de isquemia menor o igual a 1 derivacion nivel 2rio para su manejo</Text>
                        </View>

                    ) : (
                        <View>
                            <Text style={styles.severo}>Severo</Text>
                            <Text style={styles.tituloDefinicion}>Alto riesgo de amputacion, amenaza de la extremidad y la vida</Text>
                            <Text style={styles.textoDefinicion}>Derivacion inmediata a servicio de urgencia (evaluacion por cirujano)</Text>
                        </View>
                    )}

                </View>

            </View>

            {/* Boton Guardar Resultado */}
            <TouchableOpacity
                style={[styles.button, { backgroundColor: '#3B82F6' }, loading && { opacity: 0.6 }]}
                onPress={handleGuardarIndicador}
                disabled={loading}
            >
                <Text style={styles.buttonText}>{loading ? 'Guardando...' : 'Guardar'}</Text>
            </TouchableOpacity>



        </SafeAreaView>

    )


}



const styles = StyleSheet.create({

    safeArea: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        paddingBottom: 16,
    },

    container: {
        width: '90%',
        alignSelf: 'center',
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        marginBottom: 20,
    },

    button: {
        // flex: 1,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        height: 50,
        marginHorizontal: 8,
        width: '90%',
    },

    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600'
    },

    tituloResultado: {
        color: '#5c97f0',
        fontSize: 25,
        textAlign: 'center',
        paddingBottom: 25,
    },

    puntaje: {
        textAlign: 'center',
        fontSize: 22,
        paddingBottom: 8,
    },

    puntajeNumero: {
        textAlign: 'center',
        fontSize: 25,
        paddingBottom: 20,
    },


    leve: {
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 30,
        color: '#32cc41',
        paddingBottom: 10,
    },

    moderado: {
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 30,
        color: '#e19625',
        paddingBottom: 10,
    },

    severo: {
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 30,
        color: '#e12525',
        paddingBottom: 10,
    },

    tituloDefinicion: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: '500',
        paddingBottom: 15,
    },

    textoDefinicion: {
        fontSize: 18,
        paddingBottom: 10,
        textAlign: 'center',
    }


})