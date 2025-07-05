// Importaciones necesarias desde React y React Native
import React, { useState } from 'react';
import {View,Text,TextInput,StyleSheet,TouchableOpacity,Alert,} from 'react-native';

// Picker para selección de roles
import { Picker } from '@react-native-picker/picker';

// Navegación entre pantallas
import { useNavigation } from '@react-navigation/native';

// Contexto de autenticación (custom hook)
import { useAuth } from '../../../context/AuthContext';

// Componente principal de Login
const Login = () => {
  const navigation = useNavigation(); // Hook para navegación entre pantallas

  // Estados para el formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('Empleado'); // Valor inicial del picker

  // Funciones del contexto de autenticación
  const { login, loading } = useAuth();

  // Maneja el inicio de sesión
  const handleSession = async () => {
    try {
      await login(email, password); // Intenta iniciar sesión con las credenciales
      navigation.replace('Redirect'); // Redirige si es exitoso
    } catch (error) {
      // Muestra alerta en caso de error
      Alert.alert('Error', error.message || 'Credenciales incorrectas');
    }
  };

  return (
    <View style={styles.container}>
      {/* Título y subtítulo */}
      <Text style={styles.greeting}>Bienvenido</Text>
      <Text style={styles.title}>Inicio de Sesión</Text>

      {/* Campo de correo */}
      <Text style={styles.label}>Correo Electrónico</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="usuario@correo.com"
        placeholderTextColor="#999"
      />

      {/* Campo de contraseña */}
      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="••••••"
        placeholderTextColor="#999"
      />

      {/* Selector de rol */}
      <Text style={styles.label}>Rol</Text>
      <Picker
        selectedValue={rol}
        onValueChange={setRol}
        style={styles.input}
      >
        <Picker.Item label="Empleado" value="Empleado" />
        <Picker.Item label="Admin o RRHH" value="Admin" />
      </Picker>

      {/* Botón para iniciar sesión */}
      <TouchableOpacity
        onPress={handleSession}
        disabled={loading}
        style={[
          styles.button,
          loading && styles.buttonDisabled,
        ]}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </Text>
      </TouchableOpacity>

      {/* Enlace a pantalla de registro */}
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerText}>
          No tienes una cuenta, regístrate aquí
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Estilos de la interfaz
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
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#88CCC9',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  registerText: {
    color: '#007bff',
    textAlign: 'center',
    fontSize: 14,
  },
});

// Exporta el componente como default
export default Login;
