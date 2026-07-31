import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";

import { pacienteService } from "../../services/PacienteService";
import { DiagnosticoService } from "../../services/DiagnosticoService";
import InputRadius from "../components/InputRadius";


export function NuevoIndicadorScreen({ navigation }) {

    const [loading, setLoading] = useState(false);
    const [paciente, setPaciente] = useState({});

    const [checklist, setChecklist] = useState([]);
    const [totalPuntos, setTotalPuntos] = useState(0);

    const route = useRoute();
    const pacienteRut = route.params?.rutPaciente?.trim();

    //const handleResultadoIndicador = async () => {
    //    navigation.navigate('ResultadoIndicador');
    //};

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
    }

    useEffect(() => {
        mostraPaciente();
    }, [pacienteRut])  


    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            <View style={styles.container}>

                <Text style={styles.nombre}>{paciente.full_name}</Text>

                <View style={styles.preguntaContainer}>
                    <InputRadius
                        onFinalizar={(total, respuestas) => {
                            navigation.navigate('ResultadoIndicador', {total, respuestas});
                        }} 
                    />
                </View>


                <View style={styles.contenedorBotones}>
                    {/* Boton Cancela y devuelve al perfil del paciente */}
                    <TouchableOpacity style={[styles.button, { backgroundColor: '#8f8f8f' }]} onPress={() => handlePerfilPaciente(pacienteRut)} >
                        <Text style={styles.buttonText} > {loading ? 'cargando...' : 'Cancelar'}  </Text>
                    </TouchableOpacity>
                    {/* Boton Calcula el puntaje */}
                    {/*
                    <TouchableOpacity style={[styles.button, { backgroundColor: '#3B82F6' }]} onPress={handleResultadoIndicador} >
                        <Text style={styles.buttonText} > {loading ? 'cargando...' : 'Calcular'}  </Text>
                    </TouchableOpacity>
                    */}
                </View>

            </View>
        </SafeAreaView>
    )

}


const styles = StyleSheet.create({

    safeArea: {
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
        borderRadius: 20,
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

    nombre: {
        fontSize: 30,
        fontWeight: '500',
        padding: 25,
        textAlign: 'center',
    },

    preguntaContainer: {
        width: '90%',
        alignSelf: 'center',
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },


})