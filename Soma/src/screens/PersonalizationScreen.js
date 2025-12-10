import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Dimensions, ScrollView, Platform, KeyboardAvoidingView, Alert, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/ThemeContext';
// import { MaterialCommunityIcons } from '@expo/vector-icons'; // Si lo necesitas
import { useAuth } from '../context/AuthContext';
import { register } from '../services/auth';

const { height, width } = Dimensions.get('window');

// --- CONSTANTES DE DISEÑO ---
const CONTENT_HEIGHT = height * 1;
const BORDER_RADIUS = 30;
const CAT_IMAGE_HEIGHT = height * 0.5; 
const CAT_IMAGE_WIDTH = width * 2;

// --- COMPONENTE INPUT PERSONALIZADO (Estilo Gris) ---
const PillInput = ({ label, value, onChangeText, containerStyle, editable = true, ...props }) => {
  return (
    <View style={[styles.pillInputContainer, containerStyle]}>
      <Text style={styles.pillLabel}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.pillTextInput}
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          placeholderTextColor="#999"
          textAlign="center" // Texto centrado como en el diseño
          {...props}
        />
      </View>
    </View>
  );
};

// --- COMPONENTE SELECTOR DE SEXO (Círculos) ---
const GenderSelector = ({ label, selected, onSelect }) => {
  return (
    <View style={styles.genderContainer}>
      <Text style={styles.pillLabel}>{label}</Text>
      <View style={styles.genderRow}>
        <TouchableOpacity 
          style={[styles.genderBubble, selected === 'XX' ? styles.genderBubbleSelected : styles.genderBubbleUnselected]} 
          onPress={() => onSelect('XX')}
        >
          <Text style={[styles.genderText, selected === 'XX' ? styles.genderTextSelected : styles.genderTextUnselected]}>XX</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.genderBubble, selected === 'XY' ? styles.genderBubbleSelected : styles.genderBubbleUnselected]} 
          onPress={() => onSelect('XY')}
        >
          <Text style={[styles.genderText, selected === 'XY' ? styles.genderTextSelected : styles.genderTextUnselected]}>XY</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const PersonalizationScreen = ({ navigation, route }) => {
  const { currentTheme } = useTheme();
  const { login } = useAuth();
  const { email, password } = route.params || {};
  
  const [selectedButtons, setSelectedButtons] = useState([]); 
  const [goalText, setGoalText] = useState('');
  const [expectationText, setExpectationText] = useState('');
  const [loading, setLoading] = useState(false);

  // --- ESTADOS DE DATOS PERSONALES ---
  const [nombre, setNombre] = useState('Ana María');
  const [apellidos, setApellidos] = useState('García Márquez');
  const [edad, setEdad] = useState('28');
  const [fechaNac, setFechaNac] = useState('25/11/1997');
  const [sexo, setSexo] = useState('XX'); // 'XX' o 'XY'
  const [pais, setPais] = useState('España');
  const [ciudad, setCiudad] = useState('Valencia');
  const [ocupacion, setOcupacion] = useState('Diseñadora UX');
  const [telefono, setTelefono] = useState('+ 34 622 09 77 47');

  const handleButtonPress = (buttonId) => {
    if (selectedButtons.includes(buttonId)) {
      setSelectedButtons(selectedButtons.filter(id => id !== buttonId));
    } else {
      setSelectedButtons([...selectedButtons, buttonId]);
    }
  };

  const handleFinishPersonalization = async () => {
    // ... (Tu lógica de registro original se mantiene igual) ...
    // Solo por brevedad en la respuesta, asumo que mantienes tu lógica aquí
    console.log("Registrando...");
  };

  const buttonOptions = [
    'dormir mejor', 'ser productivo', 'beber más agua', 'aprender', 
    'reducir mis niveles de cortisol', 'una relación saludable con la tecnología', 
    'mejorar mis hábitos', 'conocerme', 'una interfaz adaptada a mí', 
    'otro', 'manejar la ansiedad', 'sentir calma'
  ];

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
              {buttonOptions.map((label, index) => {
                const isSelected = selectedButtons.includes(label);
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.button,
                      isSelected && (index % 2 === 0 ? styles.buttonLeftSelected : styles.buttonRightSelected),
                    ]}
                    onPress={() => handleButtonPress(label)}
                  >
                    <Text style={[styles.buttonText, isSelected && styles.selectedButtonText]}>{label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* --- SECCIÓN DATOS PERSONALES (Nuevo Diseño) --- */}
            <Text style={styles.sectionHeading}>Soy...</Text>
            
            <View style={styles.formContainer}>
              
              {/* FILA 1: Nombre (corto) + Apellidos (largo) */}
              <View style={styles.row}>
                <PillInput 
                  label="nombre" 
                  value={nombre} 
                  onChangeText={setNombre} 
                  containerStyle={{ flex: 0.4, marginRight: 10 }} 
                />
                <PillInput 
                  label="apellidos" 
                  value={apellidos} 
                  onChangeText={setApellidos} 
                  containerStyle={{ flex: 0.6 }} 
                />
              </View>

              {/* FILA 2: Edad (muy corto) + Fecha (medio) + Sexo (custom) */}
              <View style={styles.row}>
                <PillInput 
                  label="edad" 
                  value={edad} 
                  onChangeText={setEdad} 
                  containerStyle={{ width: 60, marginRight: 10 }} 
                  keyboardType="numeric"
                />
                <PillInput 
                  label="fecha de nacimiento" 
                  value={fechaNac} 
                  onChangeText={setFechaNac} 
                  containerStyle={{ flex: 1, marginRight: 10 }} 
                />
                <GenderSelector 
                  label="sexo" 
                  selected={sexo} 
                  onSelect={setSexo} 
                />
              </View>

              {/* FILA 3: País (corto) + Ciudad (largo) */}
              <View style={styles.row}>
                <PillInput 
                  label="país" 
                  value={pais} 
                  onChangeText={setPais} 
                  containerStyle={{ flex: 0.4, marginRight: 10 }} 
                />
                <PillInput 
                  label="ciudad" 
                  value={ciudad} 
                  onChangeText={setCiudad} 
                  containerStyle={{ flex: 0.6 }} 
                />
              </View>

              {/* FILA 4: Ocupación (medio) + Teléfono (medio) */}
              <View style={styles.row}>
                <PillInput 
                  label="ocupación" 
                  value={ocupacion} 
                  onChangeText={setOcupacion} 
                  containerStyle={{ flex: 0.45, marginRight: 10 }} 
                />
                <PillInput 
                  label="teléfono" 
                  value={telefono} 
                  onChangeText={setTelefono} 
                  containerStyle={{ flex: 0.55 }} 
                  keyboardType="phone-pad"
                />
              </View>

              <Text style={styles.infoText}>Todos estos apartados puedes modificarlos posteriormente en tu perfil</Text>
            </View>

            {/* --- FIN SECCIÓN DATOS --- */}

            <View style={styles.inputGroup}>
              {/* Resto de inputs (objetivos) */}
            </View>

            <TouchableOpacity
              style={[styles.nextButton, loading && { opacity: 0.6 }]}
              onPress={handleFinishPersonalization}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={currentTheme.cardBackground} size="small" />
              ) : (
                <Text style={styles.nextButtonText}>¡Comencemos!</Text>
              )}
            </TouchableOpacity>

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

const styles = StyleSheet.create({
  outerContainer: { flex: 1, backgroundColor: '#DCDCDC', justifyContent: 'center', alignItems: 'center', },
  container: {
    width: '100%', height: CONTENT_HEIGHT, borderRadius: BORDER_RADIUS, overflow: 'hidden',
    backgroundColor: '#F5F5F5', // Fondo general más claro
    position: 'relative',
  },
  scrollContainer: {
    flexGrow: 1, paddingHorizontal: 20, paddingTop: 30,
    paddingBottom: CAT_IMAGE_HEIGHT + 100, 
  },
  mainTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 4, textAlign: 'center', },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 30, paddingHorizontal: 20, },
  sectionHeading: { fontSize: 20, fontWeight: 'bold', color: '#000', marginBottom: 15, marginTop: 10, },

  // --- ESTILOS DE BOTONES (QUÉ QUIERO) ---
  buttonRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', marginBottom: 15, },
  button: {
    backgroundColor: '#E6E0F5', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center', marginRight: 8, marginBottom: 8,
  },
  buttonLeftSelected: { backgroundColor: '#6F4E85', transform: [{ skewY: '3deg' }], borderBottomLeftRadius: 0, },
  buttonRightSelected: { backgroundColor: '#6F4E85', transform: [{ skewY: '-3deg' }], borderBottomRightRadius: 0, },
  buttonText: { color: '#5D4D60', fontWeight: '600', fontSize: 13, textAlign: 'center', },
  selectedButtonText: { color: '#FFFFFF', },

  // --- ESTILOS DE FORMULARIO (SOY...) ---
  formContainer: {
    marginTop: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end', // Alinea las etiquetas y inputs abajo
    marginBottom: 15,
  },
  
  // Estilos PillInput
  pillInputContainer: {
    justifyContent: 'center',
  },
  pillLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 6,
    marginLeft: 4, // Pequeño ajuste visual
  },
  inputWrapper: {
    backgroundColor: '#E0E0E0', // Gris del input
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
  },
  pillTextInput: {
    paddingHorizontal: 15,
    fontSize: 14,
    color: '#444',
    width: '100%',
  },

  // Estilos GenderSelector
  genderContainer: {
    alignItems: 'flex-start',
  },
  genderRow: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
  },
  genderBubble: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    backgroundColor: '#E0E0E0',
  },
  genderBubbleSelected: {
    backgroundColor: '#555', // Gris oscuro seleccionado
  },
  genderBubbleUnselected: {
    backgroundColor: '#E0E0E0', // Gris claro default
  },
  genderText: {
    fontWeight: '600',
    fontSize: 12,
  },
  genderTextSelected: {
    color: '#FFF',
  },
  genderTextUnselected: {
    color: '#555',
  },

  infoText: { fontSize: 13, fontWeight: '600', color: '#000', textAlign: 'center', marginTop: 20, marginBottom: 10, },
  
  // --- OTROS ---
  inputGroup: { marginTop: 20, marginBottom: 30, },
  
  // Imagen Gato
  catImageContainer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: CAT_IMAGE_HEIGHT, zIndex: 1,
    justifyContent: 'flex-end', alignItems: 'center',
    overflow: 'hidden', 
    borderBottomLeftRadius: BORDER_RADIUS, borderBottomRightRadius: BORDER_RADIUS,
  },
  catImage: { width: CAT_IMAGE_WIDTH, height: '100%', resizeMode: 'contain', },
  
  nextButton: {
    backgroundColor: '#6F4E85', // Color hardcodeado para ejemplo, usa currentTheme
    borderRadius: 30, paddingVertical: 15, alignItems: 'center',
    position: 'absolute',
    bottom: CAT_IMAGE_HEIGHT / 2 + 60,
    left: 40, right: 40, zIndex: 2,
  },
  nextButtonText: { color: '#FFF', fontSize: 18, fontWeight: '700', },
});

export default PersonalizationScreen;