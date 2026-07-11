import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert, Button, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { profesionalService } from "../../services/ProfesionalService";


export function IniciarSesionScreen({ navigation }) {

    const [loading, setLoading] = useState(false);

    const [rut, setRut] = useState('');
    const [nombre, setNombre] = useState('');

    function calcularDigitoVerificador(num) {
        let suma = 0;
        let multiplicador = 2;

        for (let i = num.length - 1; i >= 0; i--) {
            suma += parseInt(num.charAt(i)) * multiplicador;
            multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
        }

        const resto = 11 - (suma % 11);

        if (resto === 11) return '0';
        if (resto === 10) return 'k';
        return resto.toString();
    }


    const handleIniciarSesion = async () => {

        if (!rut.trim()) { // trim() elimina los espacios en blanco al inicio y final
            alert("Debe ingresar Rut");
            return;
        }

        const rutLimpio = rut.trim().replace(/\./g, "").replace(/-/g, "").toUpperCase() // replace() el texto que deseas reemplazar y el texto nuevo. toUpperCase() vuelve todos los caracteres a mayuscula

        if (rutLimpio.length < 8 || rutLimpio.length > 9) { // length obtener el tamaño o la longitud
            alert("Rut invalido 1");
            return;
        }

        const regex = /^[0-9]+[0-9Kk]$/;
        if (!regex.test(rutLimpio)) { // test() ejecuta una búsqueda de una ocurrencia entre una expresión regular y una cadena de texto
            alert("Rut invalido 2")
            return;
        }

        const cuerpo = rutLimpio.slice(0, -1); // slice() Toma desde el primer carácter (índice 0) hasta el penúltimo (índice -1)
        const dvEntregado = rutLimpio.slice(-1).toLowerCase(); // slice() extrae únicamente el último carácter. toLowerCase() lo vuelve minuscula

        const dvCalculado = calcularDigitoVerificador(cuerpo);
        if (dvCalculado !== dvEntregado) {
            alert("Rut invalido 3")
            return;
        }

        if (!nombre.trim()) {
            alert("Debe ingresar nombre")
            return;
        }

        const datos = {
            "rut": rutLimpio,
            "fullName": nombre,
        }

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
