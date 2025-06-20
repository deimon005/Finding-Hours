// src/pages/Login/Login.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../context/AuthContext';

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('Empleado');
  const { login, loading } = useAuth();

  const handleSession = async () => {
    try {
      await login(email, password);
      navigation.replace('Redirect'); // Redirecciona automaticamente por rol
    } catch (error) {
      Alert.alert('Error', error.message || 'Credenciales incorrectas');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inicio de Sesión</Text>

      <Text style={styles.label}>Correo Electrónico</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="usuario@correo.com"
      />

      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="••••••"
      />

      <Text style={styles.label}>Rol</Text>
      <Picker
        selectedValue={rol}
        onValueChange={setRol}
        style={styles.input}
      >
        <Picker.Item label="Empleado" value="Empleado" />
        <Picker.Item label="Admin o RRHH" value="Admin" />
      </Picker>

      <Button 
        title={loading ? "Iniciando sesión..." : "Iniciar Sesión"} 
        onPress={handleSession} 
        disabled={loading}
      />

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerText}>No tienes una cuenta, regístrate aquí</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    marginTop: 10,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 5,
  },
  registerText: {
    marginTop: 20,
    color: '#007bff',
    textAlign: 'center',
  },
});

export default Login;
