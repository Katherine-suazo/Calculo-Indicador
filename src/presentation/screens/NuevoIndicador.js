import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";

import { pacienteService } from "../../services/PacienteService";

export function NuevoIndicadorScreen({ navigation }) {

    const [loading, setLoading] = useState(false);
    const [paciente, setPaciente] = useState({})

    const route = useRoute();
    const pacienteRut = route.params?.rutPaciente?.trim();

    const handleResultadoIndicador = async () => {
        navigation.navigate('ResultadoIndicador');
    };

    const handlePerfilPaciente = async () => {
        navigation.navigate('PerfilPaciente'), {"rutPaciente": rut};
    };

    const mostraPaciente = async () => {
        if (!pacienteRut) {
            setPaciente({});
            return;
        }
    }


    return (
        <SafeAreaView styles={styles.safeArea} edges={['top', 'bottom']}>
            <View>

            <Text>{}</Text>

                <View>

                </View>


                <View style={styles.contenedorBotones}>
                    {/* Boton Cancela y devuelve al perfil del paciente */}
                    <TouchableOpacity style={[styles.button, { backgroundColor: '#8f8f8f' }]} onPress={handlePerfilPaciente} >
                        <Text style={styles.buttonText} > {loading ? 'cargando...' : 'Cancelar'}  </Text>
                    </TouchableOpacity>
                    {/* Boton Calcula el puntaje */}
                    <TouchableOpacity style={[styles.button, { backgroundColor: '#3B82F6'  }]} onPress={handleResultadoIndicador} >
                        <Text style={styles.buttonText} > {loading ? 'cargando...' : 'Calcular'}  </Text>
                    </TouchableOpacity>
                </View>

            </View>
        </SafeAreaView>
    )

}


const styles = StyleSheet.create({

    safeArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        paddingBottom: 16,
    },

    contenedorBotones: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        marginTop: 10,
    },

    button: {
        flex: 1,
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