import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, TextInput, Image, Dimensions, ScrollView } from 'react-native';
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

  // Función de navegación actualizada
  const handleRegisterAndNavigate = () => {
    // Aquí iría tu lógica de registro real (validación, llamada a la API, etc.)
    // Por ahora, solo navegamos para la prueba visual:
    navigation.navigate('Personalization');
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
      marginBottom: 16,
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
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="email-outline" size={20} style={styles.icon} />
              <TextInput 
                placeholder="Escribe aquí tu email" 
                placeholderTextColor="#999"
                style={styles.inputText}
                autoCapitalize="none"
              />
            </View>

            {/* Input Contraseña */}
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="key-outline" size={20} style={styles.icon} />
              <TextInput 
                placeholder="Escribe aquí tu contraseña" 
                placeholderTextColor="#999"
                style={styles.inputText}
                secureTextEntry
              />
            </View>

            {/* Botón Principal */}
            <TouchableOpacity 
                style={styles.welcomeButton} 
                onPress={handleRegisterAndNavigate} // <-- NAVEGACIÓN AÑADIDA
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
