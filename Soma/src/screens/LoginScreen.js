import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../context/ThemeContext'; // Para usar currentTheme
import { Ionicons } from '@expo/vector-icons'; // Para los íconos de Google y Apple

const LoginScreen = ({ navigation }) => {
  const { currentTheme } = useTheme();


  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#EFEFEF', // Fondo general fuera del contenido principal
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      flex: 1,
      width: '100%',
      maxWidth: 400, // Ajustar a un tamaño de móvil típico
      borderRadius: 20, // Borde redondeado del "móvil" en la imagen
      overflow: 'hidden', // Para que el gato no se salga del borde
      backgroundColor: '#EFEFEF', // Fondo claro principal
    },
    contentWrapper: {
      flex: 1,
      backgroundColor: '#EFEFEF', // Fondo superior claro
      alignItems: 'center',
      paddingTop: 40, // Espacio superior
    },
    catContainer: {
      width: '100%',
      height: 280, // Altura del área del gato
      backgroundColor: '#6B5A66', // Color de fondo del gato
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative', // Para posicionar la imagen del gato
    },
    catImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
      position: 'absolute',
      top: 0,
      left: 0,
    },
    bottomSection: {
      backgroundColor: '#8E828A', // Fondo oscuro de la sección inferior
      paddingHorizontal: 20,
      paddingBottom: Platform.OS === 'ios' ? 30 : 20, // Espacio para el notch inferior en iOS
      paddingTop: 30, // Espacio entre los botones y el gato
      alignItems: 'center',
      width: '100%',
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFFFFF', // Fondo blanco de los botones
      borderRadius: 30, // Botones redondeados
      paddingVertical: 14,
      width: '90%', // Ancho de los botones
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
    registerText: {
      color: '#FFFFFF',
      fontSize: 14,
      marginTop: 20,
      marginBottom: 15,
    },
    registerLink: {
      fontWeight: 'bold',
      textDecorationLine: 'underline',
    },
    termsText: {
      color: '#FFFFFF',
      fontSize: 12,
      textAlign: 'center',
      lineHeight: 18,
    },
    termsLink: {
      fontWeight: 'bold',
      textDecorationLine: 'underline',
    },
  });

  return (
    <View style={styles.safeArea}> {/* Usamos View como wrapper para simular el "dispositivo" */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.contentWrapper}>
          {/* Sección del Gato */}
          <View style={styles.catContainer}>
            <Image 
              source={require('../../assets/gatos/gatoLogin.png')} 
              style={styles.catImage} 
              resizeMode='cover'
            />
          </View>
          
          {/* Sección Inferior con Botones y Textos */}
          <View style={styles.bottomSection}>
            <TouchableOpacity style={styles.button}>
              <Ionicons name="logo-google" size={24} color="#4285F4" />
              <Text style={styles.buttonText}>Entrar con Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
              <Ionicons name="logo-apple" size={24} color="#000000" />
              <Text style={styles.buttonText}>Entrar con Apple</Text>
            </TouchableOpacity>

            <Text style={styles.registerText}>
              ¿No tienes cuenta? <Text style={styles.registerLink} onPress={() => navigation.navigate('Register')}>Regístrate aquí</Text>
            </Text>

            <Text style={styles.termsText}>
              Al continuar aceptas los <Text style={styles.termsLink}>Términos</Text>
              {' y la '}
              <Text style={styles.termsLink}>Política de privacidad</Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;