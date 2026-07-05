import  React, { useEffect, useEffectEvent, useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity, TextInput, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { pacienteService } from "../../services/PacienteService";


export function HomePacientesScreen({ navigation }) {

    const [ loading, setLoading ] = useState(false);
    const [ buscar, setBuscar ] = useState('');
    const [ pacientes, setPacientes ] = useState([])
    const [ pacientesFiltrados, setPacientesFiltrados ] = useState(MostrarPacientes);

    const handleAgregarPaciente = async() => {
        navigation.navigate('AgregarPaciente');
    }
    
    const MostrarPacientes = async () => {
        const pacienteslist = await pacienteService.getPacientes();
        console.log(pacienteslist);
        setPacientes(pacienteslist);
    }

    useEffect(() => {
      MostrarPacientes();
    }, [pacientes])
    

    const handleBuscar = (texto) => {
        setBuscar(texto);

        if (texto.trim() === '' ) {
            setPacientesFiltrados(MostrarPacientes);
            return;
        }

        const textoNormalizado = texto.toLowerCase();

        const resultado = MostrarPacientes.filter(paciente => {
            const nombreCoincide = paciente.nombre.toLowerCase().includes(textoNormalizado);
            const rutCoincide = paciente.rut.toLowerCase().includes(textoNormalizado);
            return nombreCoincide || rutCoincide;
        });

        setPacientesFiltrados(resultado);
    }


    return(
        <SafeAreaView style = { styles.container } edges={['top', 'bottom']} >

            {/* BUSCAR PACIENTES POR RUT Y NOMBRE */}
            <View style = {[styles.contenidoContainer, styles.itemContenidoBuscador ]}>
                <TextInput 
                    style = {styles.inputBuscador}
                    placeholder = "Buscar paciente rut/nombre"
                    clearButtonMode = "while-editing"
                    value = {buscar}
                    onChangeText = {handleBuscar}
                />
                <FlatList
                    data = {pacientesFiltrados}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.itemPaciente}>
                            <Text style={styles.textoPaciente}>{item.nombre} {item.rut}</Text>
                        </View>
                    ) }
                    ListEmptyComponent = { <Text style={styles.buscadorVacio} > No hay resultados </Text> }
                />
            </View>

            {/* MOSTRAR PACIENTES POR ULTIMOS INDICADORES */}
            <View style = {[styles.contenidoContainer, styles.itemContenidoHistorial ]}>
                <Text style = {styles.texto} >Ultimos Pacientes con Indicadores</Text>
                <FlatList
                    data = {pacientes}
                    keyExtractor = {item => item.id}
                    renderItem = {({ item }) => (
                        <View style={styles.itemPaciente}>
                            <Text style={styles.textoPacienteName}>{item.full_name} </Text>
                            <Text style={styles.textoPacienteRut}>{item.rut}</Text>
                        </View>
                    ) }
                    ListEmptyComponent = { <Text style={styles.buscadorVacio} > No hay Indicadores </Text> }
                />
            </View>


            <TouchableOpacity style={styles.button} onPress={handleAgregarPaciente} disabled={loading} >
                <Text style = { styles.buttonText } > { loading ? 'cargando...' : 'Agregar Paciente' } </Text>
            </TouchableOpacity>

        </SafeAreaView> 
    );
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        paddingVertical: 16, 
    },

    button: {
        backgroundColor: '#3B82F6',
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        width: '85%',
        marginTop: 8,
    },

    buttonText: {
        color:'#FFFFFF',
        fontSize: 16,
        fontWeight: '600'
    },

    contenidoContainer: {
        width: '85%',
        alignSelf: 'center',
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4, 
    },

    itemContenidoBuscador: {
        flex: 1,
    },

    itemContenidoHistorial:{
        flex: 1.3,
        paddingBottom: 10,
    },

    inputBuscador: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        marginBottom: 20,
        fontSize: 16,
    },

    buscadorVacio: {
        textAlign: 'center',
        marginVertical: 30,
        color: '#888',
        fontSize: 16,
    },

    titulo: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 20,
        textAlign: 'center',
    },

    itemPaciente: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },

    textoPacienteName: {
        fontSize: 20,
        color: '#26303f',
    },

    textoPacienteRut: {
        fontSize: 16,
        color: '#3f4246',
    },

    texto: {
        fontWeight: '600',
        fontSize: 16,
        marginBottom: 8,
        color: '#1E293B',
    },
})