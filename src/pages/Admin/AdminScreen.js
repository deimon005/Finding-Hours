import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as Location from 'expo-location';

export default function CheckInScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleGetLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      setErrorMsg('Permiso denegado para acceder a la ubicación');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Entrada / Salida</Text>
      <Button title="Obtener ubicación" onPress={handleGetLocation} />

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