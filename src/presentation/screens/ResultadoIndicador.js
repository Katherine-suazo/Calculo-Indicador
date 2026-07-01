import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export function ResultadoIndicadorScreen({ navigation }) {

    const [loading, setLoading] = useState(false);

    const handlePerfilPaciente = async () => {
        navigation.navigate('PerfilPaciente');
    };

    return (

        <SafeAreaView>
            <View>

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