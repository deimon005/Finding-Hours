// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './context/AuthContext';

import Register from './src/pages/Register/Register';
import Login from './src/pages/Login/Login';
import CheckInScreen from './src/pages/Trabajador/CheckInScreen';
import DashboardScreen from './src/pages/Admin/DashboardScreen';
import DetalleTrabajador from './src/pages/Admin/DetalleTrabajador';
import RedirectScreen from './src/pages/Redirect/RedirectScreen';
import ProtectedRoute from './src/components/ProtectedRoute';

const Stack = createNativeStackNavigator();

function MainNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerTtleAlign: 'center' }}>
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
        name="Redirect" 
        component={RedirectScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Empleado" 
        options={{ title: 'Registro de Horario' }}
      >
        {() => (
          <ProtectedRoute allowedRoles={['Empleado', 'Admin']}>
            <CheckInScreen />
          </ProtectedRoute>
        )}
      </Stack.Screen>
      <Stack.Screen 
        name="Admin" 
        options={{ title: 'Panel Administrador' }}
      >
        {() => (
          <ProtectedRoute allowedRoles={['Admin']}>
            <DashboardScreen />
          </ProtectedRoute>
        )}
      </Stack.Screen>
      <Stack.Screen 
        name="DetalleTrabajador" 
        component={DetalleTrabajador} 
        options={{ title: 'Detalle del Trabajador' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}