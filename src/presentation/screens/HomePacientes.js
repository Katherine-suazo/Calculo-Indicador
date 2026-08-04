import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { format } from "date-fns";

import { pacienteService } from "../../services/PacienteService";

export function HomePacientesScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [buscar, setBuscar] = useState("");
  const [pacientes, setPacientes] = useState([]);
  const [pacientesFiltrados, setPacientesFiltrados] = useState([]);
  const [ultimosDiagnosticos, setUltimosDiagnosticos] = useState([]);

  const handleAgregarPaciente = async () => {
    navigation.navigate("AgregarPaciente");
  };

  const handlePerfilPaciente = async (rut) => {
    navigation.navigate("PerfilPaciente", { rutPaciente: rut });
  };

  const mostrarPacientes = async () => {
    const pacienteslist = await pacienteService.getPacientes();
    setPacientes(pacienteslist);
    setPacientesFiltrados(pacienteslist)
  };

  const mostrarDiagnosticos = async () => {
    const diagnosticosList = await pacienteService.getPacienteDiagnosticos();
    setUltimosDiagnosticos(diagnosticosList);
  };

  useEffect(() => {
    mostrarDiagnosticos();
    mostrarPacientes();
    
  }, []);

  const handleBuscar = async (texto) => {
    setBuscar(texto);

    const textoLimpio = texto.trim().toLowerCase();

    if (textoLimpio === "") {
      setPacientesFiltrados([]);
      return;
    }

    const resultado = pacientes.filter((pacientes) => {
      const buscarNombre = pacientes.full_name?.toLowerCase() || "";
      const buscarRut = pacientes.rut?.toLowerCase() || "";

      return (
        buscarRut.includes(textoLimpio) || buscarNombre.includes(textoLimpio)
      );
    });

    setPacientesFiltrados(resultado);
  };

  const PerfilBuscado = ({ item }) => (
    <TouchableOpacity
      onPress={() => handlePerfilPaciente(item.rut)}
      disabled={loading}
    >
      <View style={styles.itemPaciente}>
        <Text style={styles.textoPacienteRut}>{item.full_name} - {item.rut}</Text>
      </View>
    </TouchableOpacity>
  );

  const AbrirPerfil = ({ item }) => {
    const fechaYHora = item?.diagnosis_date
      ? format(new Date(item.diagnosis_date), "HH:mm dd-MM-yyyy")
      : "Sin fecha";

    return (
      <TouchableOpacity
        onPress={() => handlePerfilPaciente(item.rut)}
        disabled={loading}
      >
        <View style={styles.itemPaciente}>
          <Text style={styles.textoPacienteName}>{item.full_name}</Text>
          <Text style={styles.textoPacienteRut}>Rut: {item.rut}</Text>
          <View style={styles.puntajeYfecha}>

            {item?.score <= 10 ? (
              <Text style={styles.textoPacienteRut}>Puntaje: {item.score} de 30 - Leve</Text>
            ) : item?.score <= 20 ? (
              <Text style={styles.textoPacienteRut}>Puntaje: {item.score} de 30 - Moderado</Text>
            ) : (
              <Text style={styles.textoPacienteRut}>Puntaje: {item.score} de 30 - Severo</Text>
            )}
            <Text style={styles.textoPacienteRut}>{fechaYHora}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>

      {/* BUSCAR PACIENTES POR RUT Y NOMBRE ---------------------------*/}
      <View style={[styles.contenidoContainer, styles.itemContenidoBuscador]}>
        <TextInput
          style={styles.inputBuscador}
          placeholder="Buscar paciente por RUT o nombre"
          clearButtonMode="while-editing"
          value={buscar}
          onChangeText={handleBuscar}
        />
        <FlatList
          data={pacientesFiltrados}
          keyExtractor={(item) => item.id.toString()}
          renderItem={PerfilBuscado}
          ListEmptyComponent={
            buscar.trim() !== "" ? (
              <Text style={styles.buscadorVacio}> No hay resultados </Text>
            ) : null
          }
        />
        
      </View>

      {/* MOSTRAR PACIENTES POR ULTIMOS INDICADORES ------------------*/}
      <View style={[styles.contenidoContainer, styles.itemContenidoHistorial]}>
        <Text style={styles.texto}>Ultimos Pacientes con Indicadores</Text>
        <FlatList
          data={ultimosDiagnosticos}
          keyExtractor={(item, index) => item?.id ? item.id.toString() : index.toString()}
          renderItem={AbrirPerfil}
          ListEmptyComponent={<Text style={styles.buscadorVacio}> No hay Indicadores </Text>}
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleAgregarPaciente}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {" "}
          {loading ? "cargando..." : "Agregar Paciente"}{" "}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    paddingVertical: 16,
  },

  button: {
    backgroundColor: "#3B82F6",
    height: 50,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    width: "85%",
    marginTop: 8,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  contenidoContainer: {
    width: "90%",
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  itemContenidoBuscador: {
    flex: 1,
  },

  itemContenidoHistorial: {
    flex: 2,
    paddingBottom: 10,
  },

  inputBuscador: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    marginBottom: 20,
    fontSize: 16,
  },

  buscadorVacio: {
    textAlign: "center",
    marginVertical: 30,
    color: "#888",
    fontSize: 16,
  },

  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 20,
    textAlign: "center",
  },

  itemPaciente: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  textoPacienteName: {
    fontSize: 20,
    color: "#26303f",
  },

  textoPacienteRut: {
    fontSize: 16,
    color: "#3f4246",
  },

  texto: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 8,
    color: "#1E293B",
  },

  puntajeYfecha: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
});
