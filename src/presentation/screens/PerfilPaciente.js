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
      console.log('(Perfil Paciente)No se pudo Mostrar al paciente');
    }
    finally {
      setLoading(false);
    }
  };

  const mostrarHistorialDiag = async () => {
    const datosPaciente = await MostrarPaciente();
    setPaciente(datosPaciente ?? {});

    const diagnosticoPaciente = await diagnosticoService.obtenerDiagnosticosPorPaciente(datosPaciente.id);
    setDiagnosticos(diagnosticoPaciente ?? []);
  };

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
  };

  useEffect(() => {
    mostrarHistorialDiag();
  }, [pacienteRut]);

  const HistorialIndicador = ({ item }) => {
    const fechaYHora = item?.diagnosis_date
      ? format(new Date(item.diagnosis_date), "HH:mm dd-MM-yyyy")
      : "Sin fecha";

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
      <View style={styles.cardHistorial}>
        <View style={styles.historialHeader}>
          <Text style={styles.textoPuntaje}>
            Puntaje: <Text style={styles.textoPuntajeValor}>{item?.score}</Text>/30
          </Text>
          <View style={[styles.badgeContainer, badgeStyle]}>
            <Text style={[styles.badgeTexto, badgeTextStyle]}>{nivelTexto}</Text>
          </View>
        </View>

        <View style={styles.historialFooter}>
          <Text style={styles.textoFecha}>{fechaYHora}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* TARJETA DE INFORMACIÓN DEL PACIENTE */}
      <View style={styles.cardPerfil}>
        <View style={styles.containerHeader}>
          <View style={styles.containerNombre}>
            <Text style={styles.nombre} numberOfLines={1}>
              {paciente.full_name || "Cargando..."}
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.buttonEliminar} 
            onPress={handleEliminarPaciente}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonTextEliminar}>
              {loading ? '...' : 'Eliminar'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardDivider} />

        <View style={styles.datosGrid}>
          <View style={styles.datoFila}>
            <Text style={styles.datosSubtitulos}>RUT:</Text>
            <Text style={styles.datos}>{paciente.rut || '-'}</Text>
          </View>

          <View style={styles.datoFila}>
            <Text style={styles.datosSubtitulos}>Email:</Text>
            <Text style={styles.datos} numberOfLines={1}>{paciente.email || '-'}</Text>
          </View>

          <View style={styles.datoFila}>
            <Text style={styles.datosSubtitulos}>Teléfono:</Text>
            <Text style={styles.datos}>{paciente.phone || '-'}</Text>
          </View>
        </View>
      </View>

      {/* BOTÓN NUEVO INDICADOR */}
      <TouchableOpacity 
        style={styles.buttonNuevoIndicador} 
        onPress={() => handleNuevoIndicador(pacienteRut)} 
        disabled={loading}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Cargando...' : '+ Nuevo Indicador'}
        </Text>
      </TouchableOpacity>

      {/* HISTORIAL */}
      <View style={styles.seccionHistorialHeader}>
        <Text style={styles.historialTitulo}>Historial de Diagnósticos</Text>
      </View>

      <View style={styles.indicadorContainer}>
        <FlatList
          data={diagnosticos}
          keyExtractor={(item, index) => item?.id ? item.id.toString() : index.toString()}
          renderItem={HistorialIndicador}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.historialVacio}>Este paciente no tiene historial registrado</Text>
          }
        />
      </View>

      {/* BOTÓN VOLVER */}
      <TouchableOpacity 
        style={styles.buttonVolver} 
        onPress={handleHomePacientes} 
        disabled={loading}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonTextVolver}>
          {loading ? 'Cargando...' : 'Volver al Inicio'}
        </Text>
      </TouchableOpacity>
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

  // Tarjeta de información del paciente
  cardPerfil: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginTop: 8,
    marginBottom: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },

  containerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },

  containerNombre: {
    flex: 1,
  },

  nombre: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.3,
  },

  buttonEliminar: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FEE2E2',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },

  buttonTextEliminar: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '600',
  },

  cardDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 14,
  },

  datosGrid: {
    gap: 8,
  },

  datoFila: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  datosSubtitulos: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    width: 80,
  },

  datos: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '500',
    flex: 1,
  },

  // Botón Nuevo Indicador
  buttonNuevoIndicador: {
    backgroundColor: '#2563EB',
    height: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
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

  // Historial
  seccionHistorialHeader: {
    marginBottom: 8,
    paddingHorizontal: 4,
  },

  historialTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.3,
  },

  indicadorContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },

  cardHistorial: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  historialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },

  textoPuntaje: {
    fontSize: 14,
    color: '#475569',
  },

  textoPuntajeValor: {
    fontWeight: '700',
    color: '#0F172A',
  },

  historialFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  textoFecha: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },

  historialVacio: {
    textAlign: 'center',
    marginVertical: 40,
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '500',
  },

  // Badges de Severidad
  badgeContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  badgeTexto: {
    fontSize: 12,
    fontWeight: '700',
  },

  badgeLeve: {
    backgroundColor: '#DCFCE7',
  },

  badgeTextoLeve: {
    color: '#166534',
  },

  badgeModerado: {
    backgroundColor: '#FEF3C7',
  },

  badgeTextoModerado: {
    color: '#92400E',
  },

  badgeSevero: {
    backgroundColor: '#FEE2E2',
  },

  badgeTextoSevero: {
    color: '#991B1B',
  },

  // Botón Volver
  buttonVolver: {
    backgroundColor: '#F1F5F9',
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },

  buttonTextVolver: {
    color: '#475569',
    fontSize: 15,
    fontWeight: '600',
  },
});