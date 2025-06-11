// src/pages/Login.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('Empleado');

  const handleSession = () => {
    // Aquí deberías validar con Supabase Auth:
    // const { user, error } = await supabase.auth.signIn({ email, password })
    // y luego user.role
    
    if (!email || !password) {
      Alert.alert('Error', 'Debes completar email y contraseña');
      return;
    }
    // Para demo:
    if (rol === 'Empleado') {
      navigation.replace('Empleado');
    } else {
      navigation.replace('Admin');
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
      />

      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Text style={styles.label}>Rol</Text>
      <Picker
        selectedValue={rol}
        onValueChange={(itemValue) => setRol(itemValue)}
        style={styles.input}
      >
        <Picker.Item label="Empleado" value="Empleado" />
        <Picker.Item label="Admin o RRHH" value="Admin" />
      </Picker>

      <Button title="Iniciar Sesión" onPress={handleSession} />

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerText}>
          ¿No tienes cuenta? Regístrate aquí
        </Text>
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
