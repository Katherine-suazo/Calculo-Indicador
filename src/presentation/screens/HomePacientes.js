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
    setPacientesFiltrados(pacienteslist);
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
      activeOpacity={0.7}
    >
      <View style={styles.itemBusqueda}>
        <Text style={styles.textoBusquedaNombre}>{item.full_name}</Text>
        <Text style={styles.textoBusquedaRut}>{item.rut}</Text>
      </View>
    </TouchableOpacity>
  );

  const AbrirPerfil = ({ item }) => {
    const fechaYHora = item?.diagnosis_date
      ? format(new Date(item.diagnosis_date), "HH:mm dd-MM-yyyy")
      : "Sin fecha";

    // helper para aplicar color según severidad
    const isLeve = item?.score <= 10;
    const isModerado = item?.score > 10 && item?.score <= 20;

    const badgeStyle = isLeve
      ? styles.badgeLeve
      : isModerado
      ? styles.badgeModerado
      : styles.badgeSevero;

    const badgeTextStyle = isLeve
      ? styles.badgeTextoLeve
      : isModerado
      ? styles.badgeTextoModerado
      : styles.badgeTextoSevero;

    const nivelTexto = isLeve ? "Leve" : isModerado ? "Moderado" : "Severo";

    return (
      <TouchableOpacity
        onPress={() => handlePerfilPaciente(item.rut)}
        disabled={loading}
        activeOpacity={0.8}
      >
        <View style={styles.cardPaciente}>
          <View style={styles.cardHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.textoPacienteName} numberOfLines={1}>
                {item.full_name}
              </Text>
              <Text style={styles.textoPacienteRut}>RUT: {item.rut}</Text>
            </View>
            <View style={[styles.badgeContainer, badgeStyle]}>
              <Text style={[styles.badgeTexto, badgeTextStyle]}>
                {nivelTexto}
              </Text>
            </View>
          </View>

          <View style={styles.cardDivider} />

          <View style={styles.puntajeYfecha}>
            <Text style={styles.textoPuntaje}>
              Puntaje: <Text style={styles.textoPuntajeValor}>{item.score}</Text>/30
            </Text>
            <Text style={styles.textoFecha}>{fechaYHora}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* BUSCAR PACIENTES POR RUT Y NOMBRE */}
      <View style={[styles.contenidoContainer, styles.itemContenidoBuscador]}>
        <Text style={styles.seccionTitulo}>Búsqueda rápida</Text>
        <TextInput
          style={styles.inputBuscador}
          placeholder="Buscar paciente por RUT o nombre..."
          placeholderTextColor="#94A3B8"
          clearButtonMode="while-editing"
          value={buscar}
          onChangeText={handleBuscar}
        />
        <FlatList
          data={pacientesFiltrados}
          keyExtractor={(item) => item.id.toString()}
          renderItem={PerfilBuscado}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            buscar.trim() !== "" ? (
              <Text style={styles.buscadorVacio}>Sin resultados encontrados</Text>
            ) : null
          }
        />
      </View>

      {/* MOSTRAR PACIENTES POR ÚLTIMOS INDICADORES */}
      <View style={[styles.contenidoContainer, styles.itemContenidoHistorial]}>
        <Text style={styles.seccionTitulo}>Últimos Pacientes con Indicadores</Text>
        <FlatList
          data={ultimosDiagnosticos}
          keyExtractor={(item, index) =>
            item?.id ? item.id.toString() : index.toString()
          }
          renderItem={AbrirPerfil}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 8 }}
          ListEmptyComponent={
            <Text style={styles.buscadorVacio}>No hay indicadores registrados</Text>
          }
        />
      </View>

      {/* BOTÓN PRINCIPAL DE ACCIÓN */}
      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleAgregarPaciente}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {loading ? "Cargando..." : "+ Agregar Paciente"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },

  contenidoContainer: {
    width: "92%",
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 20,
    marginBottom: 14,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },

  itemContenidoBuscador: {
    maxHeight: 220,
  },

  itemContenidoHistorial: {
    flex: 1,
  },

  seccionTitulo: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 12,
    letterSpacing: -0.3,
  },

  inputBuscador: {
    height: 46,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: "#F8FAFC",
    marginBottom: 8,
    fontSize: 15,
    color: "#1E293B",
  },

  buscadorVacio: {
    textAlign: "center",
    marginVertical: 20,
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "500",
  },

  // Estilos de la lista de búsqueda desplegable
  itemBusqueda: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textoBusquedaNombre: {
    fontSize: 15,
    fontWeight: "600",
    color: "#334155",
  },
  textoBusquedaRut: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },

  // Tarjetas del Historial
  cardPaciente: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  textoPacienteName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 2,
  },
  textoPacienteRut: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },

  // Badges de Severidad
  badgeContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeTexto: {
    fontSize: 12,
    fontWeight: "700",
  },
  badgeLeve: {
    backgroundColor: "#DCFCE7",
  },
  badgeTextoLeve: {
    color: "#166534",
  },
  badgeModerado: {
    backgroundColor: "#FEF3C7",
  },
  badgeTextoModerado: {
    color: "#92400E",
  },
  badgeSevero: {
    backgroundColor: "#FEE2E2",
  },
  badgeTextoSevero: {
    color: "#991B1B",
  },

  cardDivider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 10,
  },

  puntajeYfecha: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textoPuntaje: {
    fontSize: 13,
    color: "#475569",
  },
  textoPuntajeValor: {
    fontWeight: "700",
    color: "#0F172A",
  },
  textoFecha: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "500",
  },

  // Footer & Botón
  footerContainer: {
    width: "100%",
    alignItems: "center",
    paddingBottom: 8,
  },
  button: {
    backgroundColor: "#2563EB",
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    width: "92%",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});