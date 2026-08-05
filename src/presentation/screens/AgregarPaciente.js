import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { pacienteService } from "../../services/PacienteService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const REGEX_TELEFONO_CHILE = /^\+569\d{8}$/;

export function AgregarPacienteScreen({ navigation }) {
    const [loading, setLoading] = useState(false);

    const [rut, setRut] = useState("");
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [telefono, setTelefono] = useState('+569');
    const [errorTelefono, setErrorTelefono] = useState('');


    const handleTelefonoChange = (text) => {
        const digits = text.replace(/\D/g, '');

        let cleanDigits = digits;

        if (cleanDigits.startsWith('569')) {
            cleanDigits = cleanDigits.slice(3);
        } else if (cleanDigits.startsWith('56')) {
            cleanDigits = cleanDigits.slice(2);
        } else if (cleanDigits.startsWith('9')) {
            cleanDigits = cleanDigits.slice(1);
        }

        const truncated = cleanDigits.slice(0, 8);
        const formatted = `+569${truncated}`;

        setTelefono(formatted);

        if (formatted.length > 4 && !REGEX_TELEFONO_CHILE.test(formatted)) {
            setErrorTelefono('El número debe tener 8 dígitos después de +569');
        } else {
            setErrorTelefono('');
        }
    };

    const handleGuardarPaciente = async () => {
        if (!rut.trim()) {
            Alert.alert("Campo requerido", "Debe ingresar el RUT del paciente.");
            return;
        }

        if (!nombre.trim()) {
            Alert.alert("Campo requerido", "Debe ingresar el nombre del paciente.");
            return;
        }

        if (!REGEX_TELEFONO_CHILE.test(telefono)) {
            Alert.alert(
                "Teléfono inválido", 
                "Debe ingresar un número de celular válido (+569 seguido de 8 dígitos)."
            );
            return;
        }

        setLoading(true);

        try {
            const jsonValue = await AsyncStorage.getItem("profesionalId");
            const idProfesional = jsonValue != null ? JSON.parse(jsonValue) : null;

            const datos = {
                "rut": rut.trim(),
                "fullName": nombre.trim(),
                "email": correo.trim(),
                "phone": telefono.trim(),
                "createdBy": idProfesional,
            };

            const rutExistente = await pacienteService.findByRut(rut.trim());

            if (rutExistente) {
                Alert.alert("Paciente existente", "El RUT ingresado ya se encuentra registrado en el sistema.");
                return;
            }

            const respuesta = await pacienteService.savePaciente(datos);
            
            Alert.alert("¡Éxito!", "Paciente registrado correctamente.", [
                {
                    text: "Aceptar",
                    onPress: () => {
                        navigation.navigate('PerfilPaciente', { "rutPaciente": respuesta.paciente.rut });
                    }
                }
            ]);
        } 
        catch (error) {
            console.error("Error al guardar paciente:", error);
            Alert.alert("Error", error.message ?? "No se pudo guardar la información del paciente.");
        } 
        finally {
            setLoading(false);
        }
    };

    const handleHomePacientes = () => {
        navigation.reset({ index: 0, routes: [{ name: 'HomePacientes' }] });
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
                        style={[styles.input, errorTelefono ? styles.inputError : null]}
                        placeholder="+56912345678"
                        placeholderTextColor="#94A3B8"
                        value={telefono}
                        onChangeText={handleTelefonoChange}
                        keyboardType="phone-pad"
                        maxLength={12} // +569 (4 chars) + 8 dígitos = 12
                    />
                    {errorTelefono ? <Text style={styles.errorText}>{errorTelefono}</Text> : null}

                    {/* BOTONES */}
                    <View style={styles.contenedorBotones}>
                        <TouchableOpacity 
                            style={[styles.button, styles.buttonCancelar]} 
                            onPress={handleHomePacientes}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.buttonTextCancelar}>
                                Cancelar
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={[styles.button, styles.buttonGuardar, loading && styles.buttonDisabled]} 
                            onPress={handleGuardarPaciente}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.buttonText}>
                                {loading ? 'Guardando...' : 'Guardar'}
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

    inputError: {
        borderColor: '#EF4444',
        marginBottom: 4,
    },

    errorText: {
        color: '#EF4444',
        fontSize: 12,
        marginBottom: 12,
        fontWeight: '500',
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

    buttonDisabled: {
        opacity: 0.65,
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