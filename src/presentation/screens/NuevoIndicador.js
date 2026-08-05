import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";

import { pacienteService } from "../../services/PacienteService";
import { DiagnosticoService } from "../../services/DiagnosticoService";
import InputRadio from "../components/InputRadio";

export function NuevoIndicadorScreen({ navigation }) {
    const [loading, setLoading] = useState(false);
    const [paciente, setPaciente] = useState({});

    const [checklist, setChecklist] = useState([]);
    const [totalPuntos, setTotalPuntos] = useState(0);
    const [idpaciente, setIdpaciente] = useState('');

    const route = useRoute();
    const pacienteRut = route.params?.rutPaciente?.trim();

    const handlePerfilPaciente = async (rut) => {
        navigation.goBack();
    };

    const mostraPaciente = async () => {
        if (!pacienteRut) {
            setPaciente({});
            return;
        }

        setLoading(true);

        try {
            const datos = await pacienteService.findByRut(pacienteRut);
            setPaciente(datos ?? {});
        }
        catch {
            console.log('(Nuevo Indicador) No se puede mostrar al paciente');
        }
        finally {
            setLoading(false);
        }
    };
     
    useEffect(() => {
        mostraPaciente();
    }, [pacienteRut]);

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            <View style={styles.headerContainer}>
                <Text style={styles.subtituloHeader}>Nuevo Indicador</Text>
                <Text style={styles.nombre} numberOfLines={1}>
                    {paciente.full_name || 'Cargando paciente...'}
                </Text>
            </View>

            <View style={styles.preguntaContainer}>
                <InputRadio
                    onFinalizar={(total, respuestas) => {
                        navigation.navigate('ResultadoIndicador', {
                            score: total,
                            respuestas,
                            patientId: paciente.id,
                            pacienteRut: paciente.rut,
                            pacienteNombre: paciente.full_name,
                        });
                    }}
                />
            </View>

            <View style={styles.contenedorBotones}>
                {/* Botón Cancela y devuelve al perfil del paciente */}
                <TouchableOpacity 
                    style={[styles.button, styles.buttonCancelar]} 
                    onPress={() => handlePerfilPaciente(pacienteRut)}
                    disabled={loading}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonTextCancelar}>
                        {loading ? 'Cargando...' : 'Cancelar Evaluacion'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 16,
        paddingBottom: 12,
    },

    headerContainer: {
        alignItems: 'center',
        marginVertical: 12,
    },

    subtituloHeader: {
        fontSize: 13,
        fontWeight: '600',
        color: '#2563EB',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },

    nombre: {
        fontSize: 22,
        fontWeight: '700',
        color: '#0F172A',
        marginTop: 2,
        letterSpacing: -0.3,
    },

    preguntaContainer: {
        flex: 1,
        width: '100%',
        backgroundColor: '#FFFFFF',
        padding: 18,
        borderRadius: 20,
        marginBottom: 12,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
    },

    contenedorBotones: {
        flexDirection: 'row',
        width: '100%',
    },

    button: {
        flex: 1,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
    },

    buttonCancelar: {
        backgroundColor: '#F1F5F9',
        borderWidth: 1,
        borderColor: '#CBD5E1',
    },

    buttonTextCancelar: {
        color: '#475569',
        fontSize: 15,
        fontWeight: '600',
    },
});