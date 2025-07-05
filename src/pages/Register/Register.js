// Importaciones necesarias desde React y React Native
import React, { useState } from 'react';
import {View,Text,TextInput,TouchableOpacity,StyleSheet,Alert,} from 'react-native';

// Componente Picker para selección de rol
import { Picker } from '@react-native-picker/picker';

// Hook de navegación entre pantallas
import { useNavigation } from '@react-navigation/native';

// Hook de contexto personalizado para autenticación
import { useAuth } from '../../../context/AuthContext';

// Componente principal para registro de usuario
const Register = () => {
  const navigation = useNavigation(); // Permite navegar entre pantallas

  // Estado local del formulario con campos: nombre, email, contraseña y rol
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    rol: 'Empleado', // Valor por defecto del rol
  });

  // Función y estado de carga desde el contexto de autenticación
  const { register, loading } = useAuth();

  // Función que maneja el registro del usuario
  const handleRegister = async () => {
    try {
      // Llama a la función register del contexto con email, password y metadatos adicionales
      await register(form.email, form.password, {
        name: form.name,
        rol: form.rol,
      });

      // Si tiene éxito, muestra alerta y redirige al login
      Alert.alert('Registro exitoso', 'Confirma tu correo antes de iniciar sesión.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error) {
      // Muestra un mensaje de error en caso de fallar
      Alert.alert('Error', error.message || 'Hubo un problema al registrarse');
    }
  };

  // Render del componente
  return (
    <View style={styles.container}>
      {/* Encabezado de bienvenida */}
      <Text style={styles.greeting}>¡Bienvenido!</Text>
      <Text style={styles.title}>Registro de usuario</Text>

      {/* Campo para nombre */}
      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese su nombre"
        placeholderTextColor="#999"
        value={form.name}
        onChangeText={(text) => setForm({ ...form, name: text })}
      />

      {/* Campo para correo electrónico */}
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

      {/* Campo para contraseña */}
      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese su contraseña"
        placeholderTextColor="#999"
        secureTextEntry
        value={form.password}
        onChangeText={(text) => setForm({ ...form, password: text })}
      />

      {/* Selector de rol (Empleado o Admin) */}
      <Text style={styles.label}>Rol</Text>
      <Picker
        selectedValue={form.rol}
        onValueChange={(itemValue) => setForm({ ...form, rol: itemValue })}
        style={styles.input}
      >
        <Picker.Item label="Empleado" value="Empleado" />
        <Picker.Item label="Admin o RRHH" value="Admin" />
      </Picker>

      {/* Botón de registro */}
      <TouchableOpacity
        onPress={handleRegister}
        disabled={loading}
        style={[
          styles.button,
          loading && styles.buttonDisabled, // Estilo adicional si está cargando
        ]}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Estilos del componente
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

// Exportación del componente Register
export default Register;
