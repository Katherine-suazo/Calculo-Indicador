import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";

import { pacienteService } from "../../services/PacienteService";


export function PerfilPacienteScreen({ navigation }) {

    const [loading, setLoading] = useState(false);
    const [paciente, setPaciente] = useState({});
    const [diagnosticos, setDiagnosticos] = useState([]);

    const route = useRoute();
    const pacienteRut = route.params?.rutPaciente?.trim();

    const handleNuevoIndicador = async () => {
        navigation.navigate('NuevoIndicador');
    };

    const handleHomePacientes = async () => {
        navigation.navigate('HomePacientes');
    };

    const MostrarPaciente = async () => {
        if (!pacienteRut) {
            setPaciente({});
            return;
        }

        setLoading(true);
        try {
            console.log(pacienteRut);
            const datos = await pacienteService.findByRut(pacienteRut);
            console.log("mostrar paciente", datos);
            setPaciente(datos ?? {});
        } 
        finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        MostrarPaciente();
    }, [pacienteRut])

    const historialIndicador = ({ item }) => (
        <View>
            <Text>{item.diagnosis_date}</Text>
            <Text>{item.score}</Text>
            <Text>{item.professional_id}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>

            <View style={styles.container}>

                <Text style={styles.nombre}>{paciente.full_name}</Text>

                <View style={styles.datosContainerPadre}>
                    <View style={styles.datosContainerHijo}>
                        <Text style={styles.datosSubtitulos}>Rut:</Text>
                        <Text style={styles.datosSubtitulos}>Email:</Text>
                        <Text style={styles.datosSubtitulos}>Telefono:</Text>
                    </View>
                    <View style={styles.datosContainerHijo}>
                        <Text style={styles.datos}>{paciente.rut?.trim()}</Text>
                        <Text style={styles.datos}>{paciente.email}</Text>
                        <Text style={styles.datos}>{paciente.phone}</Text>
                    </View>
                </View>


                {/* Boton Nuevo Indicador del paciente */}
                <TouchableOpacity style={[styles.button, { backgroundColor: '#3B82F6' }]} onPress={handleNuevoIndicador} >
                    <Text style={styles.buttonText} > {loading ? 'cargando...' : 'Nuevo Indicador'}  </Text>
                </TouchableOpacity>

                {/* Historial */}
                <Text style={styles.historial}>Historial</Text>
                <View style={[styles.indicadorContainer]}>
                    <FlatList
                        data={diagnosticos}
                        keyExtractor={item => String(item.id)}
                        renderItem={historialIndicador}
                        ListEmptyComponent={<Text style={styles.historialVacio} > Este paciente no tiene indicadores </Text>}
                    />
                </View>

                {/* Boton Volver a Home Pacientes*/}
                <TouchableOpacity style={[styles.button, { backgroundColor: '#8f8f8f', marginTop: 30 }]} onPress={handleHomePacientes} >
                    <Text style={styles.buttonText} > {loading ? 'cargando...' : 'Volver al inicio'}  </Text>
                </TouchableOpacity>

            </View>

        </SafeAreaView>
    )

}



const styles = StyleSheet.create({

    safeArea: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },

    container: {
        justifyContent: 'flex-start',
        paddingBottom: 16,
    },

    indicadorContainer: {
        width: '88%',
        alignSelf: 'center',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16,
        height: '50%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },

    button: {
        height: 50,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        marginHorizontal: 20,
    },

    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600'
    },

    nombre: {
        fontSize: 30,
        fontWeight: '500',
        textAlign: 'center',
    },

    historial: {
        fontSize: 25,
        fontWeight: '500',
        textAlign: 'center',
        padding: 10,
        margin: 10,
    },

    datosContainerPadre: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'flex-start',
        marginTop: 10,
    },

    datosContainerHijo: {
        padding: 5,
        marginHorizontal: 20,
    },

    datos: {
        fontSize: 20,
        fontWeight: '500',
    },

    datosSubtitulos: {
        fontSize: 20,
        // margin: 3.4,
        // fontWeight: '500',
    },

    historialVacio: {
        textAlign: 'center',
        marginVertical: 30,
        color: '#888',
        fontSize: 16,
    },

})
