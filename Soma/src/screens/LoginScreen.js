import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { currentTheme } = useTheme();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, ingresa tu correo y contraseña.');
      return;
    }

    setLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        Alert.alert('Éxito', 'Inicio de sesión exitoso.');
      } else {
        Alert.alert('Error', 'Credenciales inválidas. Inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error en el login:', error.response ? error.response.data : error.message);
      Alert.alert('Error', 'Ocurrió un error durante el inicio de sesión.');
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentTheme.background,
      padding: 16,
    },
    innerContainer: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 16,
    },
    logo: {
      fontSize: 32,
      fontWeight: 'bold',
      color: currentTheme.textPrimary,
      textAlign: 'center',
      marginBottom: 12,
    },
    subtitle: {
      fontSize: 16,
      color: currentTheme.textSecondary,
      textAlign: 'center',
      marginBottom: 16,
    },
    registerContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 20,
    },
    registerText: {
      color: currentTheme.textSecondary,
      fontSize: 16,
    },
    registerLink: {
      color: currentTheme.primary,
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.logo}>SOMA</Text>
        <Text style={styles.subtitle}>La pantalla que respira contigo</Text>

        <CustomInput
          placeholder="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <CustomInput
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <CustomButton title="Iniciar Sesión" onPress={handleLogin} disabled={loading} />

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>¿No tienes una cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}>Regístrate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
