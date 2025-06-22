import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';
import { useAuth } from '../../../context/AuthContext';
import supabase from '../../../lib/supabase';

export default function CheckInScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleGetLocation = async () => {
    setLoading(true);
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      setErrorMsg('Permiso denegado para acceder a la ubicación');
      setLoading(false);
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      if (!user) {
        Alert.alert('Error', 'Debes iniciar sesión para registrar');
        setLoading(false);
        return;
      }

      const { latitude, longitude } = location.coords;
      const hora = new Date().toISOString();
      const aprobado = true;

      const { data, error } = await supabase
        .from('Registro') 
        .insert([{
          latitud: latitude,
          longitud: longitude,
          id_usuario: user.id_usuario || user.id,
          hora,
          entrada: true,
          salida: false,
          direccion_esperada: 'Oficina Central',
          ratio_permitido: 50,
          aprobado,
          comentario: '',
        }]);

      if (error) {
        console.error('Error insertando registro:', JSON.stringify(error, null, 2));
        Alert.alert('Error', 'No se pudo guardar el registro');
      } else {
        Alert.alert('Éxito', 'Registro guardado correctamente');
      }
    } catch (error) {
      setErrorMsg('Error obteniendo ubicación');
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Entrada / Salida</Text>
      <Button
        title={loading ? "Guardando..." : "Obtener ubicación y registrar"}
        onPress={handleGetLocation}
        disabled={loading}
      />

      {location && (
        <Text style={styles.location}>
          Latitud: {location.coords.latitude}{"\n"}
          Longitud: {location.coords.longitude}
        </Text>
      )}

      {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 24, marginBottom: 20 },
  location: { marginTop: 20, fontSize: 16, color: 'green' },
  error: { marginTop: 20, fontSize: 16, color: 'red' },
});
