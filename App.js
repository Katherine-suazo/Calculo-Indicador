import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { IniciarSesionScreen } from "./src/presentation/screens/IniciarSesion";
import { HomePacientesScreen } from "./src/presentation/screens/HomePacientes";
import {  } from "./src/presentation/screens/AgregarPaciente";
import {  } from "./src/presentation/screens/PerfilPaciente";
import {  } from "./src/presentation/screens/NuevoIndicador";
import {  } from "./src/presentation/screens/ResultadoIndicador";

const Stack = createNativeStackNavigator();

export default function App() {
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
            component={}
            options={{ title: 'Agregar Paciente' }}
          />

          <Stack.Screen
            name = "PefilPaciente"
            component={}
            options={{ title: 'Perfil del Paciente' }}
          />

          <Stack.Screen
            name = "NuevoIndicador"
            component={}
            options={{ title: 'Nuevo Indicador' }}
          />

          <Stack.Screen
            name = "ResultadoIndicador"
            component={}
            options={{ title: 'Resultado Indicador' }}
          />

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}



