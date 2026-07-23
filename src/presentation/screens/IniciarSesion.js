import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert, Button, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { profesionalService } from "../../services/ProfesionalService";


export function IniciarSesionScreen({ navigation }) {

    const [loading, setLoading] = useState(false);

    const [rut, setRut] = useState('');
    const [nombre, setNombre] = useState('');

    const handleIniciarSesion = async () => {

        if (!rut.trim()) { 
            alert("Debe ingresar Rut");
            return;
        }

        if (!nombre.trim()) {
            alert("Debe ingresar nombre")
            return;
        }

        const datos = {
            "rut": rut,
            "fullName": nombre,
        }

        console.log('uno');
        

        var profesional = await profesionalService.iniciarSesion(datos);
        
        const guardarValorSyncStorage = async (valor) => {
            try {
                await AsyncStorage.setItem("profesionalId", JSON.stringify(profesional.id))
            }
            catch(error) {
                console.error("Error al guardar valor", error);
            }
        }
        
        guardarValorSyncStorage()

        console.log('aaaaa');
        
        
        navigation.navigate('HomePacientes');
    }

    // INVESTIGAR MASCARA DE INPUT

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>

            <View style={styles.formularioContainer} >

                <Image
                    style={styles.imagen}
                    source={{ uri: 'https://i.pinimg.com/736x/11/a9/36/11a93614f2863683a4d17f74dbcb1883.jpg' }}
                />

                <Text style={styles.titulo} >Iniciar Sesion</Text>

                {/* INGRESAR RUT */}
                <Text style={styles.texto} >Rut</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Ej: 11.111.111-1'
                    value={rut}
                    onChangeText={setRut}
                />

                {/* INGRESAR NOMBRE */}
                <Text style={styles.texto} >Nombre</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Jose Nose'
                    value={nombre}
                    onChangeText={setNombre}
                />

                <TouchableOpacity style={styles.button} onPress={handleIniciarSesion} disabled={loading} >
                    <Text style={styles.buttonText}> {loading ? 'cargando...' : 'Iniciar Sesion'} </Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
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

    input: {
        backgroundColor: '#F1F5F9',
        height: 50,
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 16,
        fontSize: 16,
    },

    texto: {
        fontWeight: '600',
        fontSize: 16,
        marginBottom: 8,
    },

    imagen: {
        width: 90,
        height: 90,
        alignSelf: 'center',
        marginBottom: 16,
        borderRadius: 40,
    }

});
