import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, TextInput, Image, Dimensions, ScrollView, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { height, width } = Dimensions.get('window');

// --- CONSTANTES DE DISEÑO (COPIADAS DEL LOGIN) ---
const CAT_CONTAINER_OVERFLOW_WIDTH = width * 1.8;
const CAT_CONTAINER_OVERFLOW_HEIGHT = height * 1.0;
const DARK_SECTION_TOP_OFFSET = height * 0.45;

// --- VALORES CLAVE DE POSICIÓN ---
const CAT_VERTICAL_OFFSET = 0.35;
const EXTENSION_ALIGNMENT_POINT = height * 0.50;
const CAT_EXTENSION_HEIGHT = height - EXTENSION_ALIGNMENT_POINT;

// Ajuste para levantar el formulario del borde inferior
const FORM_BOTTOM_LIFT = 70;

const RegisterScreen = ({ navigation }) => {
  const { currentTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // Validación de email en tiempo real
  const validateEmail = (text) => {
    setEmail(text);
    if (!emailTouched) setEmailTouched(true);

    if (!text.trim()) {
      setEmailError('El email es requerido');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(text.trim())) {
      setEmailError('Email inválido');
      return false;
    }

    setEmailError('');
    return true;
  };

  // Validación de contraseña en tiempo real
  const validatePassword = (text) => {
    setPassword(text);
    if (!passwordTouched) setPasswordTouched(true);

    if (!text) {
      setPasswordError('La contraseña es requerida');
      return false;
    }

    if (text.length < 6) {
      setPasswordError('Mínimo 6 caracteres');
      return false;
    }

    setPasswordError('');
    return true;
  };

  // Función de navegación actualizada con validación
  const handleRegisterAndNavigate = () => {
    const emailTrimmed = email.trim();

    // Marcar todos los campos como tocados
    setEmailTouched(true);
    setPasswordTouched(true);

    // Validar ambos campos
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      Alert.alert('Datos inválidos', 'Por favor, corrige los errores antes de continuar.');
      return;
    }

    // Navegamos a personalización pasando credenciales
    navigation.navigate('Personalization', {
      email: emailTrimmed,
      password: password
    });
  };

  const styles = StyleSheet.create({
    // --- ESTRUCTURA DE CONTENEDORES EXTERNOS ---
    outerContainer: {
      flex: 1,
      backgroundColor: '#DCDCDC',
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      flex: 1,
      width: '100%',
      borderRadius: 30,
      overflow: 'hidden',
      backgroundColor: '#EFEFEF',
    },
    contentWrapper: {
      flex: 1,
      width: '100%',
    },

    // 1. Fondo Oscuro General
    darkBackground: {
      position: 'absolute',
      top: DARK_SECTION_TOP_OFFSET,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#8E828A',
    },

    // 2. RECTÁNGULO DE EXTENSIÓN DEL GATO 
    catExtensionRectangle: {
      position: 'absolute',
      left: -(CAT_CONTAINER_OVERFLOW_WIDTH - width) / 2,
      width: CAT_CONTAINER_OVERFLOW_WIDTH,

      top: EXTENSION_ALIGNMENT_POINT,
      height: CAT_EXTENSION_HEIGHT,

      backgroundColor: '#59404E',
      zIndex: 1,
    },

    // 3. CAPA DEL GATO (Imagen PNG)
    catContainer: {
      position: 'absolute',
      left: -(CAT_CONTAINER_OVERFLOW_WIDTH - width) / 2,
      width: CAT_CONTAINER_OVERFLOW_WIDTH,
      height: CAT_CONTAINER_OVERFLOW_HEIGHT,

      bottom: height - DARK_SECTION_TOP_OFFSET - (height * CAT_VERTICAL_OFFSET),

      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2,
    },
    catImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },

    // 4. FORMULARIO SUPERPUESTO (Controles)
    formOverlay: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: FORM_BOTTOM_LIFT,
      alignItems: 'center',
      paddingHorizontal: 40,
      zIndex: 3,
    },

    // --- ESTILOS DE INPUTS Y BOTONES ---
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F0F0F0',
      borderRadius: 30,
      paddingVertical: 12,
      paddingHorizontal: 20,
      width: '100%',
      marginBottom: 4,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    inputContainerError: {
      borderColor: '#FF6B6B',
    },
    inputContainerSuccess: {
      borderColor: '#51CF66',
    },
    errorText: {
      color: '#FF6B6B',
      fontSize: 12,
      marginBottom: 12,
      marginLeft: 20,
      alignSelf: 'flex-start',
    },
    icon: {
      marginRight: 10,
      color: '#4b3340',
    },
    inputText: {
      flex: 1,
      color: '#666',
      fontSize: 15,
    },
    welcomeButton: {
      backgroundColor: '#E6E0F5',
      borderRadius: 30,
      paddingVertical: 14,
      width: '100%',
      alignItems: 'center',
      marginBottom: 20,
      marginTop: 10,
    },
    welcomeButtonText: {
      color: '#5D4D60',
      fontSize: 16,
      fontWeight: '600',
    },
    forgotText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '500',
      textDecorationLine: 'underline',
    },
  });

  return (
    <View style={styles.outerContainer}>
      <KeyboardAvoidingView
        behavior={'padding'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.contentWrapper}>

          {/* 1. Fondo Oscuro General */}
          <View style={styles.darkBackground} />

          {/* 2. Rectángulo de Extensión del Gato */}
          <View style={styles.catExtensionRectangle} />

          {/* 3. Imagen del Gato (Capa Media - Gato Register) */}
          <View style={styles.catContainer}>
            <Image
              source={require('../../assets/gatos/gatoRegister.png')}
              style={styles.catImage}
            />
          </View>

          {/* 4. Formulario Superpuesto (Email/Pass y Botón) */}
          <View style={styles.formOverlay}>

            {/* Input Email */}
            <View style={[
              styles.inputContainer,
              emailTouched && emailError && styles.inputContainerError,
              emailTouched && !emailError && email && styles.inputContainerSuccess,
            ]}>
              <MaterialCommunityIcons name="email-outline" size={20} style={styles.icon} />
              <TextInput
                placeholder="Escribe aquí tu email"
                placeholderTextColor="#999"
                style={styles.inputText}
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={validateEmail}
              />
            </View>
            {emailTouched && emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

            {/* Input Contraseña */}
            <View style={[
              styles.inputContainer,
              passwordTouched && passwordError && styles.inputContainerError,
              passwordTouched && !passwordError && password && styles.inputContainerSuccess,
            ]}>
              <MaterialCommunityIcons name="key-outline" size={20} style={styles.icon} />
              <TextInput
                placeholder="Escribe aquí tu contraseña"
                placeholderTextColor="#999"
                style={styles.inputText}
                secureTextEntry
                value={password}
                onChangeText={validatePassword}
              />
            </View>
            {passwordTouched && passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

            {/* Botón Principal */}
            <TouchableOpacity
              style={styles.welcomeButton}
              onPress={handleRegisterAndNavigate}
            >
              <Text style={styles.welcomeButtonText}>¡Bienvenid@ a Soma!</Text>
            </TouchableOpacity>

            {/* Link inferior */}
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.forgotText}>¿Ya tienes cuenta? Inicia sesión</Text>
            </TouchableOpacity>

          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default RegisterScreen;
