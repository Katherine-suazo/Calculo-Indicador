import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { FlatList } from "react-native-gesture-handler";


export function PerfilPacienteScreen({ navigation }) {

    const [loading, setLoading] = useState(false);
    const [datospaciente, setDatosPaciente] = useState(mostrarPaciente);
    const [diagnosticos, setDiagnosticos] = useState([]);

    const handleNuevoIndicador = async () => {
        navigation.navigate('NuevoIndicador');
    };

    const handleHomePacientes = async () => {
        navigation.navigate('HomePacientes');
    };

    const mostrarDiagnosticos 

    return (
        <SafeAreaView>
            <View>

                <Text>Rut: </Text>
                <Text>Correo: </Text>
                <Text>Celular: </Text>

                <View>
                    <FlatList
                        data={diagnosticos}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.itemDiagnostico}>
                                <Text style={styles.textoPacienteName} >{item.diagnosis_date} </Text>
                                <Text style={styles.textoPacienteRut} >{item.score}</Text>
                                <Text style={styles.textoPacienteRut} >{item.professional_id}</Text>
                            </View>
                        )}
                    />
                </View>

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

