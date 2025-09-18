// src/screens/LoginScreen.js

import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import colors from '../constants/colors';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

// El prop "navigation" nos lo da React Navigation para poder movernos entre pantallas
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Aquí irá la lógica para llamar a tu API de Spring Boot
    console.log('Login con:', email, password);
    // Si el login es exitoso, navegarías a la app principal
  };

  return (
    // KeyboardAvoidingView es un componente clave para que el teclado
    // no tape los inputs cuando se abre.
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
          secureTextEntry // Esto oculta la contraseña
        />

        <CustomButton title="Iniciar Sesión" onPress={handleLogin} />

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  logo: {
    fontSize: 60,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: colors.accent1,
    textAlign: 'center',
    marginBottom: 40,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    color: colors.textPrimary,
    fontSize: 16,
  },
  registerLink: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;