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

        <SafeAreaView>
            <View>

                <Text style={styles.puntaje}>Puntaje: {score}</Text>

                <View>

                    {score <= 10 ? (
                        <Text>Leve</Text>

                    ) : score <= 20 ? (
                        <Text>Moderado</Text>

                    ) : (
                        <Text>Severo</Text>
                    )}

                </View>


                {/* Boton Guardar Resultado */}
                <TouchableOpacity
                    style={[ styles.button, { backgroundColor: '#3B82F6' }, loading && { opacity: 0.6 } ]}
                    onPress={handleGuardarIndicador}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>{loading ? 'Guardando...' : 'Guardar'}</Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>

    )


}



const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        paddingBottom: 16,
    },

    button: {
        // flex: 1,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        height: 50,
        marginHorizontal: 8,
    },

    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600'
    },


})