import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, Image, Dimensions, TextInput, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const { height, width } = Dimensions.get('window');

// --- CONSTANTES DE DISEÑO ---
const CAT_CONTAINER_OVERFLOW_WIDTH = width * 1.8; 
const CAT_CONTAINER_OVERFLOW_HEIGHT = height * 1.0; 
const DARK_SECTION_TOP_OFFSET = height * 0.45; 

// --- VALORES CLAVE AJUSTADOS ---
const CAT_VERTICAL_OFFSET = 0.35; // EL GATO NO SE TOCA
const EXTENSION_ALIGNMENT_POINT = height * 0.50; 
const CAT_EXTENSION_HEIGHT = height - EXTENSION_ALIGNMENT_POINT;

const LoginScreen = ({ navigation, onAuthSuccess }) => {
  const { currentTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const styles = StyleSheet.create({
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
      backgroundColor: '#EFEFEF', // Fondo claro principal
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
      backgroundColor: '#8E828A', // Color de fondo oscuro original
    },

    // 2. CAPA DEL GATO (Imagen PNG - NO SE TOCA)
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

    // 3. RECTÁNGULO DE EXTENSIÓN DEL GATO (TAMAÑO MODIFICADO)
    catExtensionRectangle: {
      position: 'absolute',
      left: -(CAT_CONTAINER_OVERFLOW_WIDTH - width) / 2, 
      width: CAT_CONTAINER_OVERFLOW_WIDTH,
      
      // PUNTO DE UNIÓN MODIFICADO (para hacerlo más pequeño)
      top: EXTENSION_ALIGNMENT_POINT, 
      height: CAT_EXTENSION_HEIGHT, 
      
      backgroundColor: '#59404E', // Color de la extensión del gato
      zIndex: 1, 
    },

    // 4. CAPA DE BOTONES Y TEXTOS 
    bottomSection: {
      position: 'absolute',
      bottom: 70,
      width: '100%',
      paddingHorizontal: width * 0.05,
      paddingBottom: Platform.OS === 'ios' ? 30 : 20,
      paddingTop: height * 0.04,
      alignItems: 'center',
      zIndex: 3, 
    },
    input: {
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 14,
      width: '80%',
      marginBottom: 12,
      color: '#333333',
    },

    // --- ESTILOS DE BOTONES Y TEXTOS (Mantenidos) ---
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: 30,
      paddingVertical: 14,
      width: '80%',
      marginBottom: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    buttonText: {
      color: '#333333',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 10,
    },
    registerText: { color: '#FFFFFF', fontSize: 14, marginTop: 20, marginBottom: 15, },
    registerLink: { fontWeight: 'bold', textDecorationLine: 'underline', },
    termsText: { color: '#FFFFFF', fontSize: 12, textAlign: 'center', lineHeight: 18, },
    termsLink: { fontWeight: 'bold', textDecorationLine: 'underline', },
  });

  const handleEmailLogin = async () => {
    const emailTrimmed = email.trim();
    if (!emailTrimmed || !password) {
      Alert.alert('Campos requeridos', 'Introduce tu correo y contraseña.');
      return;
    };
    try {
      setSubmitting(true);
      const ok = await onAuthSuccess(emailTrimmed, password);
      if (!ok) {
        Alert.alert('Error de acceso', 'Correo o contraseña incorrectos.');
      }
    } catch (e) {
      Alert.alert('Error', 'No se pudo iniciar sesión.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.outerContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.contentWrapper}>

          {/* 1. Fondo Oscuro General */}
          <View style={styles.darkBackground} />

          {/* 2. Rectángulo de Extensión del Gato */}
          <View style={styles.catExtensionRectangle} />

          {/* 3. Imagen del Gato (Capa Media - NO SE TOCA) */}
          <View style={styles.catContainer}>
            <Image
              source={require('../../assets/gatos/gatoLogin.png')}
              style={styles.catImage}
            />
          </View>
          
          {/* 4. Botones y Textos (Capa Superior) */}
          <View style={styles.bottomSection}>
            <TouchableOpacity style={styles.button} onPress={handleEmailLogin} disabled={submitting}>
              <Ionicons name="log-in-outline" size={24} color="#333333" />
              <Text style={styles.buttonText}>{submitting ? 'Entrando…' : 'Entrar con correo'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Ionicons name="logo-google" size={24} color="#4285F4" />
              <Text style={styles.buttonText}>Entrar con Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
              <Ionicons name="logo-apple" size={24} color="#000000" />
              <Text style={styles.buttonText}>Entrar con Apple</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <Text style={styles.registerText}>
              ¿No tienes cuenta? <Text style={styles.registerLink} onPress={() => navigation.navigate('Register')}>Regístrate aquí</Text>
            </Text>

            <Text style={styles.termsText}>
              Al continuar aceptas los <Text style={styles.termsLink}>Términos</Text>
              {'\n y la '}
              <Text style={styles.termsLink}>Política de privacidad</Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;
