import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../context/AuthContext';

const RedirectScreen = () => {
  const { user, loading } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (!loading) {
      if (user?.rol === 'Admin') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Admin' }],
        });
      } else if (user?.rol === 'Empleado') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Empleado' }],
        });
      } else {

        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    }
  }, [user, loading]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
      <Text style={styles.text}>Redirigiendo según tu rol...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default RedirectScreen;