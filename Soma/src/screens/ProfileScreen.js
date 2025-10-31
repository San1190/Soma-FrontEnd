import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator, Button, Platform } from 'react-native';
import { getUserById, updateUser } from '../services/users';
import { useAuth } from '../context/AuthContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableUserData, setEditableUserData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    weight_kg: '',
    height_cm: '',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user || !user.id) {
        setError('User not authenticated or user ID not available.');
        setLoading(false);
        return;
      }
      try {
        const data = await getUserById(user.id);
        setUserData(data);
        setEditableUserData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          date_of_birth: data.date_of_birth || '',
          gender: data.gender || '',
          weight_kg: String(data.weight_kg) || '',
          height_cm: String(data.height_cm) || '',
        });
      } catch (err) {
        setError('Failed to fetch user data: ' + err.message);
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleSave = async () => {
    try {
      const dataToUpdate = {
        ...editableUserData,
        weight_kg: parseFloat(editableUserData.weight_kg),
        height_cm: parseFloat(editableUserData.height_cm),
      };
      await updateUser(user.id, dataToUpdate);
      setUserData(dataToUpdate);
      setIsEditing(false);
      Alert.alert('Éxito', 'Datos actualizados correctamente.');
    } catch (error) {
      console.error('Error al guardar los datos:', error);
      Alert.alert('Error', 'No se pudieron guardar los datos.');
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setEditableUserData({ ...editableUserData, date_of_birth: formattedDate });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mi Perfil</Text>
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
          <Text style={styles.editButtonText}>{isEditing ? 'Cancelar' : 'Editar'}</Text>
        </TouchableOpacity>
      </View>

      <Button title="Cerrar Sesión" onPress={logout} color="#FF6347" />

      <Text style={styles.sectionTitle}>Información de Login</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Correo de Login:</Text>
        <TextInput
          style={styles.value}
          value={user?.email}
          editable={false}
        />
      </View>

      <Text style={styles.sectionTitle}>Información Personal</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Nombre:</Text>
        <TextInput
          style={isEditing ? styles.editableValue : styles.value}
          value={editableUserData?.first_name}
          onChangeText={(text) => setEditableUserData({ ...editableUserData, first_name: text })}
          editable={isEditing}
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Apellido:</Text>
        <TextInput
          style={isEditing ? styles.editableValue : styles.value}
          value={editableUserData?.last_name}
          onChangeText={(text) => setEditableUserData({ ...editableUserData, last_name: text })}
          editable={isEditing}
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Fecha de Nacimiento:</Text>
        {isEditing ? (
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.editableValue}>
            <Text>{editableUserData.date_of_birth || 'Seleccionar Fecha'}</Text>
          </TouchableOpacity>
        ) : (
          <TextInput
            style={styles.value}
            value={editableUserData?.date_of_birth}
            editable={false}
          />
        )}
        {showDatePicker && (
          <DateTimePicker
            value={editableUserData.date_of_birth ? new Date(editableUserData.date_of_birth) : new Date()}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Género:</Text>
        {isEditing ? (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={editableUserData.gender}
              onValueChange={(itemValue) => setEditableUserData({ ...editableUserData, gender: itemValue })}
              style={styles.picker}
            >
              <Picker.Item label="Seleccionar Género" value="" />
              <Picker.Item label="Hombre" value="Hombre" />
              <Picker.Item label="Mujer" value="Mujer" />
              <Picker.Item label="Otro" value="Otro" />
            </Picker>
          </View>
        ) : (
          <TextInput
            style={styles.value}
            value={editableUserData?.gender}
            editable={false}
          />
        )}
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Peso (kg):</Text>
        <TextInput
          style={isEditing ? styles.editableValue : styles.value}
          value={editableUserData?.weight_kg?.toString()}
          onChangeText={(text) => setEditableUserData({ ...editableUserData, weight_kg: parseFloat(text) })}
          keyboardType="numeric"
          editable={isEditing}
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Altura (cm):</Text>
        <TextInput
          style={isEditing ? styles.editableValue : styles.value}
          value={editableUserData?.height_cm?.toString()}
          onChangeText={(text) => setEditableUserData({ ...editableUserData, height_cm: parseFloat(text) })}
          keyboardType="numeric"
          editable={isEditing}
        />
      </View>

      {isEditing && (
        <Button title="Guardar Cambios" onPress={handleSave} color="#007BFF" />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  editButtonText: {
    fontSize: 18,
    color: '#007BFF',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 20,
    marginBottom: 10,
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    boxShadow: '0px 1px 1.41px rgba(0, 0, 0, 0.2)',
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#666',
    paddingVertical: 5,
  },
  editableValue: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default ProfileScreen;