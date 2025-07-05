import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const navigation = useNavigation();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!loading && !user && !redirecting) {
      setRedirecting(true);
      navigation.replace('Login'); // ✅ evita errores y reemplaza en el stack
    }
  }, [user, loading]);

  if (loading || (!user && !redirecting)) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Cargando...</Text>
      </View>
    );
  }

  if (user && allowedRoles.length > 0 && !allowedRoles.includes(user.rol)) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>No tienes permiso para acceder a esta pantalla</Text>
        <Button title="Volver" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  return children;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loading: {
    fontSize: 16,
    color: '#555',
  },
  error: {
    fontSize: 16,
    color: '#D32F2F',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default ProtectedRoute;
