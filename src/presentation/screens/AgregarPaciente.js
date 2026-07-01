import React, { useState } from "react";
import { View, Text, Touchable, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export function AgregarPacienteScreen({ navigation }) {

    const [ loading, setLoading ] = useState(false);

    const handleHomePacientes = async () => {
        navigation.navigate('HomePacientes');
    };

    const handleGuardarPaciente = async () => {
        navigation.navigate('PerfilPaciente');
    };

    return(
        <SafeAreaView style = { styles.container } >
            <View>

                {/* Guardar e ir al perfil del paciente creado */}   
                <TouchableOpacity style={styles.button} onPress={handleGuardarPaciente} >
                    <Text style={styles.buttonText} > { loading ? 'cargando...' : 'Guardar' }  </Text>
                </TouchableOpacity>


                {/* Cancelar y volver a home Pacientes */}
                <TouchableOpacity style={styles.button} onPress={handleHomePacientes} >
                    <Text style={styles.buttonText} > { loading ? 'cargando...' : 'Cancelar' }  </Text>
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