import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import * as Location from 'expo-location';
import { useAuth } from '../../../context/AuthContext';
import supabase from '../../../lib/supabase';

export default function CheckInScreen() {
  const [location, setLocation] = useState(null);
  const [ciudad, setCiudad] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [nombre, setNombre] = useState('');
  const [comentario, setComentario] = useState('');
  const [modoSalida, setModoSalida] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const init = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('usuario')
        .select('nombre')
        .eq('auth_id', user.id)
        .single();

      if (error || !data) {
        console.error('Error obteniendo nombre:', error);
        setNombre('');
      } else {
        setNombre(data.nombre);
      }

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permiso denegado para acceder a la ubicación');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation(loc);

      const geocoded = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      if (geocoded.length > 0) {
        const place = geocoded[0];
        const ciudadNombre = `${place.city || place.region}, ${place.country}`;
        setCiudad(ciudadNombre);
      }
    };

    init();
  }, [user]);

  const handleGetLocation = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      if (!location || !user) {
        Alert.alert('Error', 'Ubicación no disponible o sesión no iniciada');
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from('usuario')
        .select('id_usuario')
        .eq('auth_id', user.id)
        .single();

      if (userError || !userData) {
        Alert.alert('Error', 'No se pudo obtener el usuario');
        return;
      }

      const { latitude, longitude } = location.coords;

      if (modoSalida) {
        // 🔁 Marcar SALIDA
        const { data: registros, error: fetchError } = await supabase
          .from('registro')
          .select('id_registro')
          .eq('id_usuario', userData.id_usuario)
          .is('salida', null)
          .order('hora', { ascending: false })
          .limit(1);

        if (fetchError || !registros || registros.length === 0) {
          Alert.alert('Error', 'No hay registro de entrada abierto.');
          return;
        }

        const registroId = registros[0].id_registro;

        const { error: updateError } = await supabase
          .from('registro')
          .update({
            salida: new Date().toISOString(),
            comentarios: comentario || null,
          })
          .eq('id_registro', registroId);

        if (updateError) {
          Alert.alert('Error', 'Error al registrar la salida.');
        } else {
          Alert.alert('Éxito', 'Salida registrada correctamente.');
          setComentario('');
          setModoSalida(false);
        }

      } else {
        // 🟢 Marcar ENTRADA
        const { data: abiertos, error: abiertosError } = await supabase
          .from('registro')
          .select('id_registro')
          .eq('id_usuario', userData.id_usuario)
          .is('salida', null)
          .limit(1);

        if (abiertosError) {
          Alert.alert('Error', 'No se pudo verificar registros previos.');
          return;
        }

        if (abiertos?.length > 0) {
          Alert.alert('Advertencia', 'Ya existe un registro de entrada sin salida.');
          return;
        }

        const { error: insertError } = await supabase.from('registro').insert([{
          latitud: latitude,
          longitud: longitude,
          id_usuario: userData.id_usuario,
          hora: new Date().toISOString(),
          entrada: new Date().toISOString(),
          salida: null,
          direccion_esperada: 'Oficina Central',
          radio_permitido: 50,
          aprobado: true,
          comentarios: comentario || null,
        }]);

        if (insertError) {
          Alert.alert('Error', 'Error al registrar la entrada.');
        } else {
          Alert.alert('Éxito', 'Entrada registrada correctamente.');
          setComentario('');
        }
      }

    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Ocurrió un error inesperado.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Error', 'No se pudo cerrar sesión');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>
        {nombre ? `Bienvenido, ${nombre}` : 'Bienvenido'}
      </Text>

      <Text style={styles.title}>Registro de Asistencia</Text>

      <TextInput
        style={styles.input}
        placeholder="Comentarios (opcional)"
        placeholderTextColor="#888"
        value={comentario}
        onChangeText={setComentario}
      />

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={() => {
            setModoSalida(false);
            handleGetLocation();
          }}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Marcar Entrada</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={() => {
            setModoSalida(true);
            handleGetLocation();
          }}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Marcar Salida</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator color="#000" style={{ marginTop: 10 }} />}

      {location && (
        <Text style={styles.location}>
          📍 Latitud: {location.coords.latitude.toFixed(5)}{'\n'}
          📍 Longitud: {location.coords.longitude.toFixed(5)}{'\n'}
          🏙️ Ciudad: {ciudad || 'Cargando...'}
        </Text>
      )}

      {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  greeting: {
    fontSize: 24,
    color: '#1B263B',
    fontWeight: '600',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    color: '#3D5A80',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#F9F9F9',
    color: '#333',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2EC4B6',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#88CCC9',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  location: {
    marginTop: 16,
    backgroundColor: '#F0F4F8',
    padding: 16,
    borderRadius: 12,
    color: '#1B263B',
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    width: '100%',
  },
  error: {
    marginTop: 16,
    backgroundColor: '#FFE5E5',
    padding: 12,
    borderRadius: 8,
    color: '#B00020',
    fontSize: 15,
    textAlign: 'center',
    width: '100%',
  },
  logoutButton: {
    marginTop: 36,
    backgroundColor: '#E63946',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 12,
    elevation: 3,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});
