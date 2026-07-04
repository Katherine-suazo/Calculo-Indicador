import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect } from "react";

import { IniciarSesionScreen } from "./src/presentation/screens/IniciarSesion";
import { HomePacientesScreen } from "./src/presentation/screens/HomePacientes";
import { AgregarPacienteScreen } from "./src/presentation/screens/AgregarPaciente";
import { NuevoIndicadorScreen } from "./src/presentation/screens/NuevoIndicador";
import { ResultadoIndicadorScreen } from "./src/presentation/screens/ResultadoIndicador";
import { PerfilPacienteScreen } from "./src/presentation/screens/PerfilPaciente";
import { crearTablas } from "./src/data/database/tablas";
import { DatabaseDebugButton } from "./src/presentation/components/DatabaseDebugButton";


const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    crearTablas();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="IniciarSesion">

          <Stack.Screen
            name = "IniciarSesion"
            component = { IniciarSesionScreen }
            options = {{ title: 'Iniciar Sesion' }}
          />

          <Stack.Screen
            name = "HomePacientes"
            component = { HomePacientesScreen }
            options = {{ title: 'Home Pacientes' }}
          />

          <Stack.Screen
            name = "AgregarPaciente"
            component = { AgregarPacienteScreen }
            options = {{ title: 'Agregar Paciente' }}
          />

          <Stack.Screen
            name = "PerfilPaciente"
            component = { PerfilPacienteScreen }
            options = {{ title: 'Perfil Paciente' }}
          />

          <Stack.Screen
            name = "NuevoIndicador"
            component = { NuevoIndicadorScreen }
            options = {{ title: 'Nuevo Indicador' }}
          />

          <Stack.Screen
            name = "ResultadoIndicador"
            component = { ResultadoIndicadorScreen }
            options = {{ title: 'Resultado Indicador' }}
          />

        </Stack.Navigator>
      </NavigationContainer>
      <DatabaseDebugButton />
    </SafeAreaProvider>
  )
}



