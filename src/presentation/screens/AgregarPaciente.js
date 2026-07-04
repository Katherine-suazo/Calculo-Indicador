import React, { useState } from "react";
import { View, Text, Touchable, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { pacienteService } from "../../services/PacienteService";


export function AgregarPacienteScreen({ navigation }) {

    const [loading, setLoading] = useState(false);

    const [rut, setRut] = useState("");
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [celular, setCelular] = useState("");

    const handleGuardarPaciente = async () => {
        const datos = {
            "rut":rut, 
            "fullName": nombre, 
            "email": correo, 
            "phone": celular,
        };
        console.log(datos);
        await pacienteService.savePaciente(data)

        navigation.navigate('PerfilPaciente');
    };

    const handleHomePacientes = async () => {
        navigation.navigate('HomePacientes');
    };

    return (
        <SafeAreaView style={styles.container} >
            <View style={styles.formularioContainer} >

                <Text style={styles.titulo} > AgregarPaciente </Text>

                <Text style={styles.texto} > Rut Paciente * </Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ej: 11.111.111-1"
                    value={rut}
                    onChangeText={setRut}
                />

                <Text style={styles.texto} > Nombre Completo * </Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nombre Nombre Apellido Apellido"
                    value={nombre}
                    onChangeText={setNombre}
                />

                <Text style={styles.texto} > Correo Electronico </Text>
                <TextInput
                    style={styles.input}
                    placeholder="correo@gmail.com"
                    value={correo}
                    onChangeText={setCorreo}
                />

                <Text style={styles.texto} > Celular * </Text>
                <TextInput
                    style={styles.input}
                    placeholder="+56 9 11112222"
                    value={celular}
                    onChangeText={setCelular}
                />


                <View style={styles.contenedorBotones}>

                    {/* Cancelar y volver a home Pacientes */}
                    <TouchableOpacity style={[styles.button, { backgroundColor: '#8f8f8f' }]} onPress={handleHomePacientes} >
                        <Text style={styles.buttonText} > {loading ? 'cargando...' : 'Cancelar'}  </Text>
                    </TouchableOpacity>

                    {/* Guardar e ir al perfil del paciente creado */}
                    <TouchableOpacity style={[styles.button, { backgroundColor: '#3B82F6' }]} onPress={handleGuardarPaciente} >
                        <Text style={styles.buttonText} > {loading ? 'cargando...' : 'Guardar'}  </Text>
                    </TouchableOpacity>

                </View>

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

    contenedorBotones: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        marginTop: 10,
    },

    button: {
        flex: 1,
        borderRadius: 8,
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

    formularioContainer: {
        width: '85%',
        alignSelf: 'center',
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 16,
        // sombra para ios
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        // sombra para android
        elevation: 4,
    },

    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 24,
        textAlign: 'center',
    },

    texto: {
        fontWeight: '600',
        fontSize: 16,
        marginBottom: 8,
    },

    input: {
        backgroundColor: '#F1F5F9',
        height: 50,
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 16,
        fontSize: 16,
    },

})