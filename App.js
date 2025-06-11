// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import Register from './src/pages/screens/Register/Register';
import Login from './src/pages/screens/Login/Login';
import CheckInScreen from './src/pages/Trabajador/CheckInScreen';
import AdminScreen from './src/pages/AdminScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerTitleAlign: 'center' }}>
        <Stack.Screen 
          name="Register" 
          component={Register} 
          options={{ title: 'Registro' }}
        />
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ title: 'Inicio de Sesión' }}
        />
        <Stack.Screen 
          name="Empleado" 
          component={CheckInScreen} 
          options={{ title: 'Registro de Horario' }}
        />
        <Stack.Screen 
          name="Admin" 
          component={AdminScreen} 
          options={{ title: 'Panel Administrador' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
