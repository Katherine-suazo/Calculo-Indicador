import { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert, Button } from "react-native";
import { ProfesionalServicio } from '../../services/ProfesionalService'; /////


export function IniciarSesionScreen({ navigation }) {
    const [rut, setRut] = useState('');
    const [nombre, setNombre] = useState('');
    const [loading, setLoading] = useState(false);

    const handleIniciarSesion = async () => {
        if (!rut || !nombre) {
            Alert.alert('error', 'Debe ingresar rut y nombre');
            return;
        }

        try{
            setLoading(true);
            await ProfesionalServicio.iniciarSesion( rut, nombre );
            navigation.navigate('HomePacientes');
        }
        catch(error) {
            Alert.alert('error', error.message);
        }
        finally {
            setLoading(false);
        }
    }


    return (
        <View>

            <Text>Iniciar Sesion</Text>

            <TextInput
                placeholder = 'rut'
                value = { rut }
                onChangeText = { setRut }
            />

            <TextInput
                placeholder = 'nombre'
                value = { nombre }
                onChangeText = { setNombre }
            />

            <Button 
                title = { loading ? 'cargando...' : 'Iniciar Sesion' }
                onPress = { handleIniciarSesion }
            />

        </View>
    );
}


const styles = StyleSheet.create({

    

});