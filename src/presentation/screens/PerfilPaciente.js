import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { format } from "date-fns";

import { pacienteService } from "../../services/PacienteService";
import diagnosisRepository from "../../data/repositories/diagnosisRepository";
import { diagnosticoService } from "../../services/DiagnosticoService";


export function PerfilPacienteScreen({ navigation }) {

  const [loading, setLoading] = useState(false);
  const [paciente, setPaciente] = useState({});
  const [diagnosticos, setDiagnosticos] = useState([]);


  const route = useRoute();
  const pacienteRut = route.params?.rutPaciente?.trim();


  const handleNuevoIndicador = async (rut) => {
    navigation.navigate('NuevoIndicador', { "rutPaciente": rut });
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
      const datos = await pacienteService.findByRut(pacienteRut);
      return datos;
    }
    catch {
      console.log('(Perfil Paciente)No se puedo Mostrar al paciente');
    }
    finally {
      setLoading(false);
    }
  }


  const mostrarHistorialDiag = async () => {
    const datosPaciente = await MostrarPaciente();
    setPaciente(datosPaciente ?? {});

    const diagnosticoPaciente = await diagnosticoService.obtenerDiagnosticosPorPaciente(datosPaciente.id);
    setDiagnosticos(diagnosticoPaciente ?? []);
  }


  const handleEliminarPaciente = async () => {
    setLoading(true);
    try {
      const datos = await pacienteService.deletePaciente(pacienteRut);
      console.log('paciente eliminado');
      navigation.navigate('HomePacientes');
    }
    catch {
      throw new Error("No se pudo eliminar al paciente");
      console.log('No se pudo eliminar al paciente');
    }
    finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    mostrarHistorialDiag();
  }, [pacienteRut])


  const HistorialIndicador = ({ item }) => {
    const fechaYHora = item?.diagnosis_date
      ? format(new Date(item.diagnosis_date), "HH:mm dd-MM-yyyy")
      : "Sin fecha";

    return (
      <View style={styles.datosHistorial}>

        <View style={styles.fechaYpuntaje}>
          <Text style={styles.textoDefinicion}>Puntaje: </Text>
          {/* <Text>Profesional: {item?.professional_name ?? 'No Asignado'}</Text> */}
        </View>

        <View style={styles.fechaYpuntaje}>

          {item?.score <= 10 ? (
            <Text style={styles.leve}>{item.score} de 30 - Leve</Text>
          ) : item?.score <= 20 ? (
            <Text style={styles.moderado}>{item.score} de 30 - Moderado</Text>
          ) : (
            <Text style={styles.severo}>{item.score} de 30 - Severo</Text>
          )}
          <Text style={styles.textoDefinicion}>{fechaYHora}</Text>
        </View>

      </View>
    )

  }



  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>

      <View style={styles.containerHeader}>

        <View style={styles.containerNombre}>
          <Text style={styles.nombre}>{paciente.full_name}</Text>
        </View>

        {/* Boton de eliminar paciente */}
        <TouchableOpacity style={[styles.buttonEliminar, { backgroundColor: '#e23036', marginTop: 30 }]} onPress={handleEliminarPaciente} >
          <Text style={styles.buttonText} > {loading ? 'cargando...' : 'Eliminar'}  </Text>
        </TouchableOpacity>

      </View>

      <View style={styles.datosContainerPadre}>

        <View style={styles.datosContainerHijo}>
          <Text style={styles.datosSubtitulos}>Rut:</Text>
          <Text style={styles.datosSubtitulos}>Email:</Text>
          <Text style={styles.datosSubtitulos}>Telefono:</Text>
        </View>

        <View style={styles.datosContainerHijo}>
          <Text style={styles.datos}>{paciente.rut}</Text>
          <Text style={styles.datos}>{paciente.email}</Text>
          <Text style={styles.datos}>{paciente.phone}</Text>
        </View>

      </View>


      {/* Boton Nuevo Indicador del paciente */}
      <TouchableOpacity style={[styles.button, { backgroundColor: '#3B82F6' }]} onPress={() => handleNuevoIndicador(pacienteRut)} >
        <Text style={styles.buttonText} > {loading ? 'cargando...' : 'Nuevo Indicador'}  </Text>
      </TouchableOpacity>

      {/* Historial */}
      <Text style={styles.historial}>Historial</Text>
      <View style={[styles.indicadorContainer]}>
        <FlatList
          data={diagnosticos}
          keyExtractor={(item, index) => item?.id ? item.id.toString() : index.toString()}
          renderItem={HistorialIndicador}
          ListEmptyComponent={<Text style={styles.historialVacio} > Este paciente no tiene historial </Text>}
        />
      </View>

      {/* Boton Volver a Home Pacientes*/}
      <TouchableOpacity style={[styles.button, { backgroundColor: '#8f8f8f', marginTop: 30 }]} onPress={handleHomePacientes} >
        <Text style={styles.buttonText} > {loading ? 'cargando...' : 'Volver al inicio'}  </Text>
      </TouchableOpacity>

    </SafeAreaView>
  )

}


const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'flex-start',
    paddingBottom: 16,
  },

  // container: {
  //   justifyContent: 'flex-start',
  //   paddingBottom: 16,
  // },

  indicadorContainer: {
    width: '90%',
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

  containerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },

  containerNombre: {
    flex: 1,
    alignItems: 'center',
  },

  buttonEliminar: {
    width: 110,
    height: 40,
    backgroundColor: '#e21616',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },

  nombre: {
    fontSize: 30,
    fontWeight: '500',
    paddingTop: 25,
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
    // fontWeight: '500',
  },

  datosSubtitulos: {
    fontSize: 20,
    // margin: 3.4,
    // fontWeight: '500',
  },

  historialVacio: {
    textAlign: 'center',
    marginVertical: '30%',
    color: '#888',
    fontSize: 16,
  },

  fechaYpuntaje: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },

  datosHistorial: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  leve: {
    textAlign: 'left',
    fontSize: 19,
    color: '#24a331',
  },

  moderado: {
    textAlign: 'left',
    fontSize: 19,
    color: '#e19625',
  },

  severo: {
    textAlign: 'left',
    fontSize: 19,
    color: '#e12525',
  },

  textoDefinicion: {
    fontSize: 17,
    textAlign: 'center',
  }

})
