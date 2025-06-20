import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const navigation = useNavigation();

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (!user) {
    navigation.navigate('Login');
    return null;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.rol)) {
    return (
      <View style={styles.container}>
        <Text>No tienes permiso para acceder a esta pantalla</Text>
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
});

export default ProtectedRoute;