import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import colors from '../constants/colors';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    // Aquí irá la lógica para llamar al endpoint de registro de tu API
    console.log('Registro con:', name, email, password);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Crear Cuenta</Text>
        <Text style={styles.subtitle}>Empieza a conectar con tu bienestar</Text>

        <CustomInput
          placeholder="Nombre completo"
          value={name}
          onChangeText={setName}
        />
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

        <CustomButton title="Crear Cuenta" onPress={handleRegister} />

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>¿Ya tienes una cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Inicia Sesión</Text>
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
  title: {
    fontSize: 32,
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: colors.textPrimary,
    fontSize: 16,
  },
  loginLink: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;