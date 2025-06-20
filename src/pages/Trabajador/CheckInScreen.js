import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { useAuth } from '../../../context/AuthContext';
import supabase from '../../../lib/supabase';

export default function CheckInScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isCheckingIn, setIsCheckingIn] = useState(true);
  const [lastCheck, setLastCheck] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchLastCheck = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('registro')
          .select('*')
          .eq('id_usuario', user.id_usuario) // ← usa auth_id si es necesario
          .order('hora', { ascending: false })
          .limit(1);

        if (error) throw error;

        if (data && data.length > 0) {
          setLastCheck(data[0]);
          setIsCheckingIn(data[0].salida !== null);
        }
      } catch (error) {
        console.error('Error fetching last check:', error);
        Alert.alert('Error', 'No se pudo verificar el último registro');
      } finally {
        setLoading(false);
      }
    };

    fetchLastCheck();
  }, [user]);

  const handleCheckInOut = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permiso denegado para acceder a la ubicación');
      return;
    }

    setLoading(true);
    try {
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation
      });
      setLocation(currentLocation);

      await sendLocationToDB(currentLocation);
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert('Error', 'No se pudo obtener la ubicación');
      setLoading(false);
    }
  };

  const sendLocationToDB = async (loc) => {
    try {
      const now = new Date().toISOString();
      let response;

      if (isCheckingIn) {
        response = await supabase
          .from('registro')
          .insert([{
            id_usuario: user.id_usuario, // o user.auth_id según tu base
            hora: now,
            entrada: now,
            latitud: loc.coords.latitude,
            longitud: loc.coords.longitude,
            direccion_esperada: 'Oficina Principal',
            radio_permitido: 100,
            aprobado: user.rol === 'Admin'
          }])
          .select();
      } else {
        if (!lastCheck) throw new Error('No hay registro de entrada');

        response = await supabase
          .from('registro')
          .update({
            salida: now,
            latitud: loc.coords.latitude,
            longitud: loc.coords.longitude
          })
          .eq('id_registro', lastCheck.id_registro)
          .select();
      }

      if (response.error) throw response.error;

      Alert.alert(
        'Registro exitoso',
        `Se registró tu ${isCheckingIn ? 'entrada' : 'salida'} correctamente`,
        [{ text: 'OK', onPress: () => setIsCheckingIn(!isCheckingIn) }]
      );

      if (isCheckingIn && response.data && response.data.length > 0) {
        setLastCheck(response.data[0]);
      }
    } catch (error) {
      console.error('DB Error:', error);
      Alert.alert('Error', error.message || 'Error al guardar el registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isCheckingIn ? 'Registro de Entrada' : 'Registro de Salida'}
      </Text>

      {lastCheck && !isCheckingIn && (
        <View style={styles.lastCheckContainer}>
          <Text style={styles.subtitle}>Última entrada registrada:</Text>
          <Text style={styles.timeText}>
            {new Date(lastCheck.entrada).toLocaleString()}
          </Text>
        </View>
      )}

      <Button
        title={isCheckingIn ? 'Registrar Entrada' : 'Registrar Salida'}
        onPress={handleCheckInOut}
        disabled={loading}
      />

      {loading && <ActivityIndicator size="large" style={styles.loader} />}

      {location && (
        <View style={styles.locationContainer}>
          <Text style={styles.locationText}>Ubicación registrada:</Text>
          <Text style={styles.locationData}>
            📍 Lat: {location.coords.latitude.toFixed(6)}
          </Text>
          <Text style={styles.locationData}>
            📍 Long: {location.coords.longitude.toFixed(6)}
          </Text>
          <Text style={styles.locationData}>
            🎯 Precisión: {location.coords.accuracy.toFixed(1)} metros
          </Text>
        </View>
      )}

      {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333'
  },
  lastCheckContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#e3f2fd',
    borderRadius: 8
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976d2'
  },
  timeText: {
    fontSize: 14,
    marginTop: 5,
    color: '#555'
  },
  locationContainer: {
    marginTop: 25,
    padding: 15,
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#c8e6c9'
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 8
  },
  locationData: {
    fontSize: 14,
    marginVertical: 3,
    color: '#333'
  },
  error: {
    marginTop: 20,
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center'
  },
  loader: {
    marginTop: 20
  }
});
