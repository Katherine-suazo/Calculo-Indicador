import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { profesionalService } from "../../services/ProfesionalService";

export function IniciarSesionScreen({ navigation }) {
    const [loading, setLoading] = useState(false);
    const [rut, setRut] = useState('');
    const [nombre, setNombre] = useState('');

    const handleIniciarSesion = async () => {
        if (!rut.trim()) {
            Alert.alert('Campo vacío', "Debe ingresar RUT");
            return;
        }

        if (!nombre.trim()) {
            Alert.alert('Campo vacío', "Debe ingresar nombre");
            return;
        }

        const datos = {
            "rut": rut,
            "fullName": nombre,
        };

        var profesional = await profesionalService.iniciarSesion(datos);

        const guardarValorSyncStorage = async (valor) => {
            try {
                await AsyncStorage.setItem("profesionalId", JSON.stringify(profesional.id));
            }
            catch (error) {
                console.error("Error al guardar valor", error);
            }
        };

        guardarValorSyncStorage();

        navigation.reset({index: 0, routes: [{ name: 'HomePacientes' }] });
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <View style={styles.formularioContainer}>
                <Image
                    style={styles.imagen}
                    source={require('../../../assets/Foot Logo by kreabie.jpeg')}
                />

                <Text style={styles.titulo}>Iniciar Sesión</Text>
                <Text style={styles.subtitulo}>Ingresa tus credenciales para acceder</Text>

                {/* INGRESAR RUT */}
                <Text style={styles.texto}>RUT</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Ej: 11.111.111-1'
                    placeholderTextColor="#94A3B8"
                    value={rut}
                    onChangeText={setRut}
                    autoCapitalize="characters"
                />

                {/* INGRESAR NOMBRE */}
                <Text style={styles.texto}>Nombre completo</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Ej: José Pérez'
                    placeholderTextColor="#94A3B8"
                    value={nombre}
                    onChangeText={setNombre}
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleIniciarSesion}
                    disabled={loading}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonText}>
                        {loading ? 'Cargando...' : 'Iniciar Sesión'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifycontent: 'center',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 16,
    },

    formularioContainer: {
        width: '92%',
        alignSelf: 'center',
        backgroundColor: '#FFFFFF',
        padding: 24,
        borderRadius: 20,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
    },

    imagen: {
        width: 84,
        height: 84,
        alignSelf: 'center',
        marginBottom: 16,
        borderRadius: 42,
        borderWidth: 3,
        borderColor: '#F8FAFC',
    },

    titulo: {
        fontSize: 22,
        fontWeight: '700',
        color: '#0F172A',
        textAlign: 'center',
        letterSpacing: -0.3,
    },

    subtitulo: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        marginTop: 4,
        marginBottom: 20,
        fontWeight: '400',
    },

    texto: {
        fontWeight: '600',
        fontSize: 14,
        marginBottom: 6,
        color: '#334155',
    },

    input: {
        backgroundColor: '#F8FAFC',
        height: 48,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        paddingHorizontal: 14,
        marginBottom: 16,
        fontSize: 15,
        color: '#1E293B',
    },

    button: {
        backgroundColor: '#2563EB',
        height: 52,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },

    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.2,
    },
});