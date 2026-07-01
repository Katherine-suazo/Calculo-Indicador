import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";


export function NuevoIndicadorScreen({ navigation }) {

    const [loading, setLoading] = useState(false);

    const handleResultadoIndicador = async () => {
        navigation.navigate('ResultadoIndicador');
    };

    const handlePerfilPaciente = async () => {
        navigation.navigate('PerfilPaciente');
    };

    return (
        <SafeAreaView styles={styles.container}>
            <View>

                {/* Boton Calcula el puntaje */}
                <TouchableOpacity style={styles.button} onPress={handleResultadoIndicador} >
                    <Text style={styles.buttonText} > {loading ? 'cargando...' : 'Calcular'}  </Text>
                </TouchableOpacity>

                {/* Boton Cancela y devuelve al perfil del paciente */}
                <TouchableOpacity style={styles.button} onPress={handlePerfilPaciente} >
                    <Text style={styles.buttonText} > {loading ? 'cargando...' : 'Cancelar'}  </Text>
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
        backgroundColor: '#3B82F6',
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },

    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600'
    },


})