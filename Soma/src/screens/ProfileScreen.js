import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { getUserById, updateUser } from '../services/users';
import { useAuth } from '../context/AuthContext'; // Asumiendo que tienes un contexto de autenticación para obtener el ID del usuario

const ProfileScreen = () => {
  const { user } = useAuth(); // Obtener el usuario del contexto de autenticación
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Estados para los campos editables
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

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
        setName(data.name);
        setEmail(data.email);
        setWeight(data.biometricData?.weight ? String(data.biometricData.weight) : '');
        setHeight(data.biometricData?.height ? String(data.biometricData.height) : '');
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
      const updatedUserData = {
        ...userData,
        name,
        email,
        biometricData: {
          ...userData.biometricData,
          weight: parseFloat(weight),
          height: parseFloat(height),
        },
      };
      await updateUser(user.id, updatedUserData);
      setUserData(updatedUserData);
      setIsEditing(false);
      Alert.alert('Éxito', 'Perfil actualizado correctamente.');
    } catch (err) {
      Alert.alert('Error', 'No se pudo actualizar el perfil: ' + err.message);
      console.error('Error updating user data:', err);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando perfil...</Text>
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
    <View style={styles.container}>
      <Text style={styles.title}>Mi Perfil</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Nombre:</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
        ) : (
          <Text style={styles.value}>{userData.name}</Text>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Email:</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        ) : (
          <Text style={styles.value}>{userData.email}</Text>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Peso (kg):</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
          />
        ) : (
          <Text style={styles.value}>{userData.biometricData?.weight || 'N/A'}</Text>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Altura (cm):</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
          />
        ) : (
          <Text style={styles.value}>{userData.biometricData?.height || 'N/A'}</Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
      >
        <Text style={styles.buttonText}>{isEditing ? 'Guardar Cambios' : 'Editar Perfil'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    width: 100,
  },
  value: {
    fontSize: 18,
    color: '#666',
    flex: 1,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 5,
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
});

export default ProfileScreen;