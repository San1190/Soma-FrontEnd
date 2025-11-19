import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Dimensions, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

const { height, width } = Dimensions.get('window');

// --- CONSTANTES DE DISEÑO GENERAL ---
const CONTENT_HEIGHT = height * 0.95; 
const BORDER_RADIUS = 30; 
// Altura del área del gato (la imagen PNG define la forma)
const CAT_IMAGE_HEIGHT = height * 0.4; 
const NEXT_BUTTON_HEIGHT = 50; // Altura aproximada del botón "Comencemos"


// Componente auxiliar para un input con estilo de píldora (No modificado)
const PillInput = ({ label, value, onChangeText, smallWidth = false, editable = true, ...props }) => {
    // ... (El estilo del PillInput permanece igual)
    const styles = StyleSheet.create({
        pillInputContainer: { 
            width: smallWidth ? '48%' : '100%', 
            marginBottom: 15,
            marginRight: smallWidth ? '4%' : 0, 
        },
        label: { 
            fontSize: 14, 
            color: '#666', 
            marginBottom: 4,
        },
        input: {
            backgroundColor: '#E6E0F5', 
            borderRadius: 12, 
            paddingHorizontal: 12, 
            paddingVertical: 8, 
            fontSize: 14, 
            fontWeight: '600', 
            color: '#333333',
            opacity: editable ? 1 : 0.8,
        }
    });
    
    return (
        <View style={styles.pillInputContainer}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                editable={editable}
                placeholderTextColor="#5D4D60"
                {...props}
            />
        </View>
    );
};


const PersonalizationScreen = ({ navigation }) => {
  const { currentTheme } = useTheme();
  const [selectedButton, setSelectedButton] = useState(null); 
  const [goalText, setGoalText] = useState('');
  const [expectationText, setExpectationText] = useState('');
    
  // --- ESTADOS PARA LOS CAMPOS 'SOY...' --- (Simplificados para el ejemplo)
  const [nombre, setNombre] = useState('Ana María');
  const [apellidos, setApellidos] = useState('García Márquez');
  const [edad, setEdad] = useState('28');
  const [fechaNac, setFechaNac] = useState('25/11/1997');
  const [sexo, setSexo] = useState('XX');
  const [pais, setPais] = useState('España');
  const [ciudad, setCiudad] = useState('Valencia');
  const [ocupacion, setOcupacion] = useState('Diseñadora UX');
  const [telefono, setTelefono] = useState('+ 34 622 09 77 47');


  const handleButtonPress = (buttonId) => {
    setSelectedButton(buttonId === selectedButton ? null : buttonId); 
  };
  
  const styles = StyleSheet.create({
    outerContainer: { flex: 1, backgroundColor: '#DCDCDC', justifyContent: 'center', alignItems: 'center', },
    container: {
      width: '100%', height: CONTENT_HEIGHT, borderRadius: BORDER_RADIUS, overflow: 'hidden',
      backgroundColor: '#EFEFEF', 
      position: 'relative', // Necesario para el botón flotante (nextButton)
    },

    // 1. Contenido desplazable (ScrollView)
    scrollContainer: {
      flexGrow: 1, paddingHorizontal: 20, paddingTop: 30, 
      // Padding mínimo, ya que el gato y el botón están ahora DENTRO del flujo
      paddingBottom: NEXT_BUTTON_HEIGHT + 40, // Espacio para el botón y margen final
    },
    
    mainTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 4, textAlign: 'center', },
    subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 30, paddingHorizontal: 20, },
    sectionHeading: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10, marginTop: 20, },
    
    // 2. Estilos de los botones inclinados (Se mantienen)
    buttonRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', marginBottom: 15, },
    button: {
      backgroundColor: '#E6E0F5', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, 
      alignItems: 'center', justifyContent: 'center', marginRight: 8, marginBottom: 8,
    },
    buttonLeftSelected: { backgroundColor: '#6F4E85', transform: [{ skewY: '3deg' }], borderBottomLeftRadius: 0, },
    buttonRightSelected: { backgroundColor: '#6F4E85', transform: [{ skewY: '-3deg' }], borderBottomRightRadius: 0, },
    buttonText: { color: '#5D4D60', fontWeight: '600', fontSize: 13, textAlign: 'center', },
    selectedButtonText: { color: '#FFFFFF', },

    // 3. Estilos de datos personales "Soy..." (Input rows)
    dataSection: { marginTop: 10, },
    dataRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', },
    infoText: { fontSize: 12, color: '#888', textAlign: 'center', marginTop: 20, marginBottom: 10, },
    inputGroup: { marginTop: 20, marginBottom: 30, },
    inputLabel: { fontSize: 16, color: '#444', marginBottom: 8, },
    textInput: { 
        backgroundColor: '#FFFFFF', borderRadius: 10, paddingHorizontal: 15, paddingVertical: 12, 
        fontSize: 15, color: '#333', borderWidth: 1, borderColor: '#E0E0E0', 
        marginBottom: 15, minHeight: 80, textAlignVertical: 'top', 
    },
    
    // 4. Botón flotante al final del contenido
    nextButton: {
      backgroundColor: currentTheme.primary, 
      borderRadius: 30, paddingVertical: 15, alignItems: 'center',
      marginTop: 20, marginBottom: 40,
      width: '90%', 
      alignSelf: 'center',
    },
    nextButtonText: { color: currentTheme.cardBackground, fontSize: 18, fontWeight: '700', },
    
    // 5. Imagen del Gato (Ahora es parte del flujo del scroll)
    catImageContainer: {
      height: CAT_IMAGE_HEIGHT, // Mantiene la altura
      zIndex: 1, 
      marginTop: 40, // Separación del contenido
    },
    catImage: { width: '100%', height: '100%', resizeMode: 'cover', }, 
    
  });

  return (
    <View style={styles.outerContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1, width: '100%', borderRadius: BORDER_RADIUS, overflow: 'hidden' }}
      >
        <View style={styles.container}>
            
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.mainTitle}>¡Cuéntanos sobre ti!</Text>
            <Text style={styles.subtitle}>Para que Soma te dé una gran experiencia personalizada queremos conocerte muuucho</Text>

            <Text style={styles.sectionHeading}>Quiero...</Text>
            <View style={styles.buttonRow}>
              {['dormir mejor', 'ser productivo', 'beber más agua', 'aprender', 'reducir mis niveles de cortisol', 'una relación saludable con la tecnología', 'mejorar mis hábitos', 'conocerme', 'una interfaz adaptada a mí', 'otro', 'manejar la ansiedad', 'sentir calma'].map((label, index) => (
                <TouchableOpacity
                    key={index}
                    style={[ styles.button, selectedButton === label && (index % 2 === 0 ? styles.buttonLeftSelected : styles.buttonRightSelected), ]}
                    onPress={() => handleButtonPress(label)}
                >
                    <Text style={[styles.buttonText, selectedButton === label && styles.selectedButtonText]}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* --- SECCIÓN DATOS PERSONALES INPUTS --- */}
            <Text style={styles.sectionHeading}>Soy...</Text>
            <View style={styles.dataSection}>
                <View style={styles.dataRow}>
                    <PillInput label="nombre" value={nombre} onChangeText={setNombre} smallWidth={true} />
                    <PillInput label="apellidos" value={apellidos} onChangeText={setApellidos} smallWidth={true} />
                    <PillInput label="edad" value={edad} onChangeText={setEdad} smallWidth={true} keyboardType="numeric" />
                    <PillInput label="fecha de nacimiento" value={fechaNac} onChangeText={setFechaNac} smallWidth={true} placeholder="DD/MM/YYYY" />
                    <PillInput label="sexo" value={sexo} onChangeText={setSexo} smallWidth={true} placeholder="XX/XY" />
                    <PillInput label="país" value={pais} onChangeText={setPais} smallWidth={true} />
                    <PillInput label="ciudad" value={ciudad} onChangeText={setCiudad} smallWidth={true} />
                    <PillInput label="ocupación" value={ocupacion} onChangeText={setOcupacion} smallWidth={true} />
                    <PillInput label="teléfono" value={telefono} onChangeText={setTelefono} smallWidth={true} keyboardType="phone-pad" />
                </View>
                <Text style={styles.infoText}>Todos estos apartados puedes modificarlos posteriormente en tu perfil</Text>
            </View>


          {/* Inputs adicionales (Largos) */}
          <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>¿Qué te gustaría lograr?</Text>
                <TextInput
                    value={goalText} onChangeText={setGoalText}
                    style={styles.textInput}
                    placeholder="Ej: Ser más paciente, meditar más..."
                    placeholderTextColor="#999" multiline numberOfLines={3}
                />
                <Text style={styles.inputLabel}>¿Qué esperas de esta experiencia?</Text>
                <TextInput
                    value={expectationText} onChangeText={setExpectationText}
                    style={styles.textInput}
                    placeholder="Ej: Herramientas para gestionar la ansiedad"
                    placeholderTextColor="#999" multiline numberOfLines={3}
                />
          </View>
          
          {/* 1. Botón Flotante (Ahora parte del Scroll) */}
          <TouchableOpacity style={styles.nextButton} onPress={() => console.log('Finalizar personalización')}>
            <Text style={styles.nextButtonText}>¡Comencemos!</Text>
          </TouchableOpacity>

          {/* 2. Fondo Fijo: Imagen del Gato (Ahora parte del Scroll) */}
          <View style={styles.catImageContainer}>
            <Image
              source={require('../../assets/gatos/gatoCola.png')}
              style={styles.catImage}
            />
          </View>
          
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
    </View>
  );
};

export default PersonalizationScreen;
