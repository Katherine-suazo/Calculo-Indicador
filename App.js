import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { } from "./src/presentation/screens"; /////////

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="IniciarSesion">

          <Stack.Screen
            name = "IniciarSesion"
            component = {}
            options = {{ title: 'Iniciar Sesion' }}
          />

          <Stack.Screen
            name = "HomePacientes"
            component = {}
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



