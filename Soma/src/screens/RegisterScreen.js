import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, Alert, ScrollView, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import colors from '../constants/colors';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { register } from '../services/auth';

const GENDERS = [
  { label: 'Hombre', value: 'Hombre' },
  { label: 'Mujer', value: 'Mujer' },
  
  
];

const isWeb = Platform.OS === 'web';

const RegisterScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const yyyy = selectedDate.getFullYear();
      const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const dd = String(selectedDate.getDate()).padStart(2, '0');
      setDateOfBirth(`${yyyy}-${mm}-${dd}`);
    }
  };

  const handleRegister = async () => {
    if (!firstName || !email || !password || !gender || !dateOfBirth) {
      Alert.alert('Error', 'Por favor, completa todos los campos obligatorios.');
      return;
    }
    const userData = {
      first_name: firstName,
      last_name: lastName || undefined,
      date_of_birth: dateOfBirth,
      gender,
      weight_kg: weight ? parseFloat(weight) : undefined,
      height_cm: height ? parseFloat(height) : undefined,
      email,
      password_hash: password,
    };
    setLoading(true);
    try {
      const user = await register(userData);
      Alert.alert('¡Éxito!', 'Usuario registrado correctamente. Inicia sesión.');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al registrar el usuario. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Selector de género visual tipo "pill"
  const renderGenderPills = () => (
    <View style={styles.genderPillContainer}>
      {GENDERS.map(opt => (
        <TouchableOpacity
          key={opt.value}
          style={[
            styles.genderPill,
            gender === opt.value && styles.selectedPill,
          ]}
          onPress={() => setGender(opt.value)}
        >
          <Text style={[styles.genderPillText, gender === opt.value && styles.selectedPillText]}>
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.innerContainer} keyboardShouldPersistTaps="handled">

        <Text style={styles.title}>Crear Cuenta</Text>
        <Text style={styles.subtitle}>Empieza a conectar con tu bienestar</Text>

        <CustomInput
          placeholder="Nombre (obligatorio)"
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
        />
        <CustomInput
          placeholder="Apellido"
          value={lastName}
          onChangeText={setLastName}
          style={styles.input}
        />

        {/* Fecha de nacimiento: calendario cross-platform */}
        <TouchableOpacity onPress={() => isWeb ? null : setShowDatePicker(true)} style={styles.dateInput}>
          {isWeb ? (
            <TextInput
              placeholder="Fecha de nacimiento (obligatorio)"
              type="date"
              style={{height: 40, fontSize: 16, color: dateOfBirth ? colors.textPrimary : '#aaa'}}
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
              onFocus={e => { e.target.type = 'date'; }}
              onBlur={e => { if(!dateOfBirth) e.target.type = 'text'; }}
            />
          ) : (
            <Text style={{ color: dateOfBirth ? colors.textPrimary : '#aaa', fontSize: 16 }}>
              {dateOfBirth ? `Nacido el: ${dateOfBirth}` : 'Fecha de nacimiento (obligatorio)'}
            </Text>
          )}
        </TouchableOpacity>
        {!isWeb && showDatePicker && (
          <DateTimePicker
            value={dateOfBirth ? new Date(dateOfBirth) : new Date(2000, 0, 1)}
            mode="date"
            display="default"
            maximumDate={new Date()}
            onChange={handleDateChange}
            locale="es-ES"
          />
        )}

        {/* Selector visual de género */}
        <Text style={styles.label}>Género (obligatorio):</Text>
        {renderGenderPills()}

        <CustomInput
          placeholder="Peso (kg)"
          value={weight}
          onChangeText={setWeight}
          keyboardType="decimal-pad"
          style={styles.input}
        />
        <CustomInput
          placeholder="Altura (cm)"
          value={height}
          onChangeText={setHeight}
          keyboardType="decimal-pad"
          style={styles.input}
        />
        <CustomInput
          placeholder="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        <CustomInput
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <CustomButton title={loading ? "Registrando..." : "Crear Cuenta"} onPress={handleRegister} disabled={loading} />

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>¿Ya tienes una cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Inicia Sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eef8f3' },
  innerContainer: { flexGrow: 1, justifyContent: 'center', padding: 20, paddingBottom: 30 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#184e46', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 17, color: '#317a6c', textAlign: 'center', marginBottom: 40 },
  input: { marginBottom: 18 },
  dateInput: {
    borderWidth: 1,
    borderColor: '#b4dbce',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 14,
  },
  label: { color: '#317a6c', fontWeight: '600', marginBottom: 7, marginLeft: 4 },
  genderPillContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15 },
  genderPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#b4dbce',
    backgroundColor: '#fff',
    marginHorizontal: 4,
  },
  genderPillText: { color: '#184e46', fontWeight: '500' },
  selectedPill: { backgroundColor: '#317a6c' },
  selectedPillText: { color: '#fff' },
  loginContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 22 },
  loginText: { color: '#184e46', fontSize: 16 },
  loginLink: { color: '#317a6c', fontSize: 16, fontWeight: 'bold' },
});

export default RegisterScreen;
