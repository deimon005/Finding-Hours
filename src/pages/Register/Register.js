// src/pages/Register/Register.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
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
      <Text style={styles.greeting}>¡Bienvenido!</Text>
      <Text style={styles.title}>Registro de usuario</Text>

      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese su nombre"
        placeholderTextColor="#999"
        value={form.name}
        onChangeText={(text) => setForm({ ...form, name: text })}
      />

      <Text style={styles.label}>Correo electrónico</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese su correo"
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
        value={form.email}
        onChangeText={(text) => setForm({ ...form, email: text })}
      />

      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese su contraseña"
        placeholderTextColor="#999"
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

      <TouchableOpacity
        onPress={handleRegister}
        disabled={loading}
        style={[
          styles.button,
          loading && styles.buttonDisabled,
        ]}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

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
  label: {
    alignSelf: 'flex-start',
    marginBottom: 4,
    fontWeight: '500',
    fontSize: 14,
    color: '#1B263B',
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
  button: {
    backgroundColor: '#2EC4B6',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    elevation: 4,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#88CCC9',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default Register;
