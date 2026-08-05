import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { pacienteService } from "../../services/PacienteService";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function AgregarPacienteScreen({ navigation }) {
    const [loading, setLoading] = useState(false);

    const [rut, setRut] = useState("");
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [celular, setCelular] = useState("");

    const handleGuardarPaciente = async () => {
        if (!rut.trim()) {
            alert("Debe ingresar Rut del paciente");
            return;
        }

        if (!nombre.trim()) {
            alert("Debe ingresar nombre del paciente");
            return;
        }

        if (!celular.trim()) {
            alert("Debe ingresar celular del paciente");
            return;
        }

        const obtenerValorSyncStorage = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem("profesionalId");
                return jsonValue != null ? JSON.parse(jsonValue) : null;
            }
            catch (error) {
                console.error("Error obteniendo valor de syncStorage", error);
            }
        };

        var idProfesional = await obtenerValorSyncStorage();

        const datos = {
            "rut": rut,
            "fullName": nombre,
            "email": correo,
            "phone": celular,
            "createdBy": idProfesional,
        };

        const rutExistente = await pacienteService.findByRut(rut);

        if (rutExistente) {
            throw new Error("El paciente ya existe");
            console.log('El paciente ya existe');
        }
        else {
            const respuesta = await pacienteService.savePaciente(datos);
            console.log('Paciente guardado');
            await navigation.navigate('PerfilPaciente', { "rutPaciente": respuesta.paciente.rut });
        }
    };

    const handleHomePacientes = async () => {
        navigation.navigate('HomePacientes');
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.formularioContainer}>
                    <Text style={styles.titulo}>Agregar Paciente</Text>
                    <Text style={styles.subtitulo}>Ingresa los datos personales para el registro</Text>

                    {/* RUT */}
                    <Text style={styles.texto}>RUT Paciente <Text style={styles.requerido}>*</Text></Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ej: 11.111.111-1"
                        placeholderTextColor="#94A3B8"
                        value={rut}
                        onChangeText={setRut}
                        autoCapitalize="characters"
                    />

                    {/* NOMBRE */}
                    <Text style={styles.texto}>Nombre Completo <Text style={styles.requerido}>*</Text></Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ej: Juan Pérez González"
                        placeholderTextColor="#94A3B8"
                        value={nombre}
                        onChangeText={setNombre}
                    />

                    {/* CORREO */}
                    <Text style={styles.texto}>Correo Electrónico</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="ejemplo@correo.com"
                        placeholderTextColor="#94A3B8"
                        value={correo}
                        onChangeText={setCorreo}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    {/* CELULAR */}
                    <Text style={styles.texto}>Celular <Text style={styles.requerido}>*</Text></Text>
                    <TextInput
                        style={styles.input}
                        placeholder="+56 9 11112222"
                        placeholderTextColor="#94A3B8"
                        value={celular}
                        onChangeText={setCelular}
                        keyboardType="phone-pad"
                    />

                    {/* BOTONES */}
                    <View style={styles.contenedorBotones}>
                        <TouchableOpacity 
                            style={[styles.button, styles.buttonCancelar]} 
                            onPress={handleHomePacientes}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.buttonTextCancelar}>
                                {loading ? 'Cargando...' : 'Cancelar'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={[styles.button, styles.buttonGuardar]} 
                            onPress={() => handleGuardarPaciente()}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.buttonText}>
                                {loading ? 'Cargando...' : 'Guardar'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F5F9',
    },

    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: 20,
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

    requerido: {
        color: '#EF4444',
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

    contenedorBotones: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        marginTop: 12,
        gap: 12,
    },

    button: {
        flex: 1,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        height: 52,
    },

    buttonGuardar: {
        backgroundColor: '#2563EB',
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },

    buttonCancelar: {
        backgroundColor: '#F1F5F9',
        borderWidth: 1,
        borderColor: '#CBD5E1',
    },

    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.2,
    },

    buttonTextCancelar: {
        color: '#475569',
        fontSize: 16,
        fontWeight: '600',
    },
});