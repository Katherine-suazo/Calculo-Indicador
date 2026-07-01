import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";


export function PerfilPacienteScreen({ navigation }) {

    const [loading, setLoading] = useState(false);

    const handleNuevoIndicador = async () => {
        navigation.navigate('NuevoIndicador');
    };

    const handleHomePacientes = async () => {
        navigation.navigate('HomePacientes');
    };

    return (
        <SafeAreaView>
            <View>

                {/* Boton Nuevo Indicador del paciente */}
                <TouchableOpacity style={styles.button} onPress={handleNuevoIndicador} >
                    <Text style={styles.buttonText} > {loading ? 'cargando...' : 'Nuevo Indicador'}  </Text>
                </TouchableOpacity>

                {/* Boton Volver a Home Pacientes*/}
                <TouchableOpacity style={styles.button} onPress={handleHomePacientes} >
                    <Text style={styles.buttonText} > {loading ? 'cargando...' : 'Volve al inicio'}  </Text>
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

