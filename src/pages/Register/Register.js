// src/pages/Register/Register.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../context/AuthContext';

const Register = () => {
  const navigation = useNavigation();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    rol: 'Empleado',
  });
  const { register, loading } = useAuth();

  const handleRegister = async () => {
    try {
      await register(form.email, form.password, {
        name: form.name,
        rol: form.rol,
      });

      Alert.alert('Registro exitoso', 'Confirma tu correo antes de iniciar sesión.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error) {
      Alert.alert('Error', error.message || 'Hubo un problema al registrarse');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de usuario</Text>

      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese su nombre"
        value={form.name}
        onChangeText={(text) => setForm({ ...form, name: text })}
      />

      <Text style={styles.label}>Correo electrónico</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese su correo"
        keyboardType="email-address"
        autoCapitalize="none"
        value={form.email}
        onChangeText={(text) => setForm({ ...form, email: text })}
      />

      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese su contraseña"
        secureTextEntry
        value={form.password}
        onChangeText={(text) => setForm({ ...form, password: text })}
      />

      <Text style={styles.label}>Rol</Text>
      <Picker
        selectedValue={form.rol}
        onValueChange={(itemValue) => setForm({ ...form, rol: itemValue })}
        style={styles.input}
      >
        <Picker.Item label="Empleado" value="Empleado" />
        <Picker.Item label="Admin o RRHH" value="Admin" />
      </Picker>

      <Button 
        title={loading ? "Registrando..." : "Registrarse"} 
        onPress={handleRegister} 
        disabled={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    alignSelf: 'center',
    padding: 24,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
  label: {
    marginTop: 12,
    fontWeight: '500',
    fontSize: 14,
  },
  input: {
    width: '100%',
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    fontSize: 16,
    marginTop: 4,
    backgroundColor: 'white',
  },
});

export default Register;
