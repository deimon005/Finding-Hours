// src/pages/Admin/WorkerDetailScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, Linking } from 'react-native';
import { useRoute } from '@react-navigation/native';
import supabase from '../../../lib/supabase'; // Cliente de Supabase para interactuar con la base de datos
import { Ionicons } from '@expo/vector-icons'; // Iconos

const WorkerDetailScreen = () => {
  // Obtener parámetros de navegación
  const route = useRoute();
  const { trabajador } = route.params || {};
  
  // Estados del componente
  const [registros, setRegistros] = useState([]); // Almacena los registros del trabajador
  const [loading, setLoading] = useState(true); // Estado de carga

  // Función para obtener los registros del trabajador desde Supabase
  const fetchRegistros = async () => {
    if (!trabajador?.id_usuario) {
      Alert.alert('Error', 'Trabajador no definido');
      setLoading(false);
      return;
    }
    try {
      // Consulta a Supabase: selecciona todos los registros del trabajador, ordenados por hora
      const { data, error } = await supabase
        .from('registro')
        .select('*')
        .eq('id_usuario', trabajador.id_usuario)
        .order('hora', { ascending: false });

      if (error) throw error;
      setRegistros(data);
    } catch (err) {
      console.error('Error al cargar registros:', err);
      Alert.alert('Error', 'No se pudieron cargar los registros');
    } finally {
      setLoading(false);
    }
  };

  // Función para aprobar/rechazar un registro
  const handleAprobacion = async (id_registro, estado) => {
    try {
      // Actualiza el estado de aprobación en Supabase
      const { error } = await supabase
        .from('registro')
        .update({ aprobado: estado })
        .eq('id_registro', id_registro);

      if (error) throw error;

      // Actualiza el estado localmente
      setRegistros(prev =>
        prev.map(reg =>
          reg.id_registro === id_registro ? { ...reg, aprobado: estado } : reg
        )
      );
    } catch {
      Alert.alert('Error', 'No se pudo actualizar el estado del turno');
    }
  };

  // Abre Google Maps con la ubicación del registro
  const abrirEnMapa = (lat, long) => {
    const url = `https://www.google.com/maps?q=${lat},${long}`;
    Linking.openURL(url);
  };

  // Efecto para cargar los registros al montar el componente
  useEffect(() => {
    fetchRegistros();
  }, []);

  // Mostrar spinner mientras carga
  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  // Manejo de caso donde no hay trabajador definido
  if (!trabajador) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Trabajador no definido</Text>
      </View>
    );
  }

  // Renderizado principal
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Historial de {trabajador.nombre}</Text>

      {/* Mapeo de todos los registros del trabajador */}
      {registros.map(item => (
        <View key={item.id_registro} style={styles.card}>
          {/* Detalles del registro */}
          <Text style={styles.label}>Hora registro:</Text>
          <Text>{new Date(item.hora).toLocaleString()}</Text>

          <Text style={styles.label}>Entrada:</Text>
          <Text>{item.entrada ? new Date(item.entrada).toLocaleString() : '—'}</Text>

          <Text style={styles.label}>Salida:</Text>
          <Text>{item.salida ? new Date(item.salida).toLocaleString() : '—'}</Text>

          <Text style={styles.label}>Ubicación:</Text>
          <Text>📍 Lat: {item.latitud} | Long: {item.longitud}</Text>

          {/* Botón para abrir mapa */}
          <TouchableOpacity onPress={() => abrirEnMapa(item.latitud, item.longitud)}>
            <Text style={styles.mapaLink}>Ver en mapa</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Dirección esperada:</Text>
          <Text>{item.direccion_esperada || '-'}</Text>

          <Text style={styles.label}>Radio permitido:</Text>
          <Text>{item.radio_permitido ? `${item.radio_permitido} m` : '-'}</Text>

          {/* Estado de aprobación (con estilos condicionales) */}
          <Text style={[
              styles.estado,
              item.aprobado === true ? styles.aprobado :
              item.aprobado === false ? styles.denegado :
              styles.pendiente
            ]}
          >
            {item.aprobado === true ? 'Aprobado ✅' :
             item.aprobado === false ? 'Rechazado ❌' :
             'Pendiente ⏳'}
          </Text>

          {/* Botones de aprobación/rechazo */}
          <View style={styles.botonesContainer}>
            <TouchableOpacity
              style={[styles.boton, styles.aprobar]}
              onPress={() => handleAprobacion(item.id_registro, true)}
            >
              <Ionicons name="checkmark" size={20} color="#fff" />
              <Text style={styles.botonTexto}>Aprobar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.boton, styles.rechazar]}
              onPress={() => handleAprobacion(item.id_registro, false)}
            >
              <Ionicons name="close" size={20} color="#fff" />
              <Text style={styles.botonTexto}>Rechazar</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

// Estilos del componente
const styles = StyleSheet.create({
  container: { padding: 16 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 2
  },
  label: { fontWeight: '600', marginTop: 8 },
  estado: { marginTop: 10, fontWeight: 'bold' },
  aprobado: { color: 'green' }, // Estilo para estado aprobado
  denegado: { color: 'red' },   // Estilo para estado rechazado
  pendiente: { color: '#999' }, // Estilo para estado pendiente
  mapaLink: { color: '#1e90ff', marginTop: 4, textDecorationLine: 'underline' },
  botonesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 6,
  },
  aprobar: { backgroundColor: 'green' }, // Estilo botón aprobar
  rechazar: { backgroundColor: 'red' },  // Estilo botón rechazar
  botonTexto: { color: '#fff', marginLeft: 6, fontWeight: '600' },
});

export default WorkerDetailScreen;