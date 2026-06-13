import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { IniciarSesionScreen } from "./src/presentation/screens/IniciarSesion";
import { HomePacientesScreen } from "./src/presentation/screens/HomePacientes";


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


        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}



