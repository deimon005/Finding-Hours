import React, { createContext, useContext, useEffect, useState } from 'react';
import supabase from '../lib/supabase';
import { Alert } from 'react-native';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (session?.user) {
        await fetchUserProfile(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await fetchUserProfile(session.user);
        } else {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (authUser) => {
    try {
      const { data, error } = await supabase
        .from('usuario')
        .select('*')
        .eq('auth_id', authUser.id)
        .single();

      if (error) throw error;

      const fullUser = { ...authUser, ...data };
      setUser(fullUser);
      console.log('✅ Usuario autenticado:', fullUser); // Para F12
    } catch (error) {
      console.error('Error al obtener perfil de usuario:', error);
      setUser(null);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Email not confirmed")) {
          throw new Error("Por favor confirma tu correo electrónico antes de iniciar sesión.");
        }
        throw error;
      }

      // El perfil será cargado desde onAuthStateChange
      return data.user;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, userData) => {
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      const { error: profileError } = await supabase
        .from('usuario')
        .insert([{
          auth_id: authData.user.id,
          nombre: userData.name,
          email,
          rol: userData.rol || 'Empleado',
        }]);

      if (profileError) throw profileError;

      Alert.alert("Confirma tu correo", "Revisa tu correo para completar el registro.");

      return authData.user;
    } catch (error) {
      console.error('Error al registrar:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

// deploy