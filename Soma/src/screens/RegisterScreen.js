import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, TextInput, Image } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Usamos estos iconos que se parecen más a la foto

const RegisterScreen = ({ navigation }) => {
  const { currentTheme } = useTheme();

  // Definimos los estilos específicos para replicar la imagen
  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#EFEFEF', // Fondo claro superior
    },
    container: {
      flex: 1,
    },
    // Contenedor de la imagen del gato
    catContainer: {
      flex: 1,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'flex-end', // Alineamos la imagen al fondo
      marginTop: 40, // Espacio superior
    },
    catImage: {
      width: '100%',
      height: '100%', // Ocupa todo el espacio disponible
      resizeMode: 'stretch', // O 'cover', ajustamos para que el cuerpo baje hasta el final
    },
    // Capa superpuesta para los controles (Formulario)
    formOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '55%', // Los controles ocupan la mitad inferior sobre el cuerpo oscuro
      alignItems: 'center',
      paddingHorizontal: 30,
      justifyContent: 'center',
    },
    // Estilo de los Inputs (Píldoras blancas)
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F0F0F0', // Fondo casi blanco/gris muy claro
      borderRadius: 30,
      paddingVertical: 12,
      paddingHorizontal: 20,
      width: '100%',
      marginBottom: 16,
    },
    icon: {
      marginRight: 10,
    },
    inputText: {
      flex: 1,
      color: '#666',
      fontSize: 15,
    },
    // Botón de Bienvenida (Lila claro)
    welcomeButton: {
      backgroundColor: '#E6E0F5', // Color lila claro de la imagen
      borderRadius: 30,
      paddingVertical: 14,
      width: '100%',
      alignItems: 'center',
      marginBottom: 20,
      marginTop: 10,
    },
    welcomeButtonText: {
      color: '#5D4D60', // Texto oscuro suave
      fontSize: 16,
      fontWeight: '600',
    },
    // Link inferior
    forgotText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '500',
    },
  });

  return (
    <View style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Imagen del Gato de fondo (Cuerpo oscuro) */}
        <View style={styles.catContainer}>
            <Image 
              source={require('../../assets/gatos/gatoRegister.png')} 
              style={styles.catImage} 
              resizeMode='cover'
            />
        </View>

        {/* Formulario Superpuesto sobre el cuerpo del gato */}
        <View style={styles.formOverlay}>
          
          {/* Input Email */}
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="email-outline" size={20} color="#4b3340" style={styles.icon} />
            <TextInput 
              placeholder="Escribe aquí tu email" 
              placeholderTextColor="#999"
              style={styles.inputText}
              autoCapitalize="none"
            />
          </View>

          {/* Input Contraseña */}
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="key-outline" size={20} color="#4b3340" style={styles.icon} />
            <TextInput 
              placeholder="Escribe aquí tu contraseña" 
              placeholderTextColor="#999"
              style={styles.inputText}
              secureTextEntry
            />
          </View>

          {/* Botón Principal */}
          <TouchableOpacity style={styles.welcomeButton} onPress={() => {}}>
            <Text style={styles.welcomeButtonText}>¡Bienvenid@ a Soma!</Text>
          </TouchableOpacity>

          {/* Texto inferior */}
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.forgotText}>¿Ya tienes cuenta? Inicia sesión :(</Text>
          </TouchableOpacity>

        </View>

      </KeyboardAvoidingView>
    </View>
  );
};

export default RegisterScreen;