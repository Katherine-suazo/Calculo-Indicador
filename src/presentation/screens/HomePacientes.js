import { useState } from "react";
import { View, Text, Button } from "react-native";


export function HomePacientesScreen({ navigation }) {
    const [loading, setLoading] = useState(false);

    const handleAgregarPaciente = async () => {
        navigation.navigate('AgregarPaciente');
    }
    
    return(
        <View>
            <Text>Home Pacientes</Text>

            <Button
                title = { loading ? 'cargando...' : 'Agregar Paciente' }
                onPress = { handleAgregarPaciente }
            />
        </View> 
    );

}