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

      // Obtener id_usuario a partir del auth_id (user.id)
      const { data: userData, error: userError } = await supabase
        .from('usuario')
        .select('id_usuario')
        .eq('auth_id', user.id)
        .single();

      if (userError || !userData) {
        console.error('Error obteniendo id_usuario:', userError);
        Alert.alert('Error', 'No se pudo encontrar el usuario en la base de datos');
        setLoading(false);
        return;
      }

      const id_usuario = userData.id_usuario;
      const { latitude, longitude } = location.coords;

      const { data, error } = await supabase
        .from('registro')
        .insert([{
          latitud: latitude,
          longitud: longitude,
          id_usuario: id_usuario,
          hora: new Date().toISOString(),
          entrada: new Date().toISOString(),
          salida: null,
          direccion_esperada: 'Oficina Central',
          radio_permitido: 50,
          aprobado: true,
          comentarios: ''
        }]);

      if (error) {
        console.error('Error insertando registro:', error);
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
