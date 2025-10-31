import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const API_BASE_URL = 'http://192.168.1.31:8080/api/hydration'; // Asegúrate de que esta URL sea correcta

const HydrationScreen = () => {
    const [hydrationStatus, setHydrationStatus] = useState('Cargando estado...');
    const [waterAmount, setWaterAmount] = useState('');
    const userId = 1; // Placeholder: En una aplicación real, obtendrías el ID del usuario autenticado

    useEffect(() => {
        fetchHydrationStatus();
        // Eliminar la alerta de prueba después de verificar su funcionalidad
        // Alert.alert('Test Alert', 'This is a test alert to check Alert.alert functionality.');
    }, []);

    const fetchHydrationStatus = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/status`, {
                params: { userId: userId }
            });
            setHydrationStatus(translateHydrationStatus(response.data));
        } catch (error) {
            console.error('Error fetching hydration status:', error);
            setHydrationStatus('Error al cargar el estado de hidratación.');
            Alert.alert('Error', 'No se pudo cargar el estado de hidratación.');
        }
    };

    const logWaterIntake = async () => {
        if (!waterAmount || isNaN(waterAmount) || parseFloat(waterAmount) <= 0) {
            Alert.alert('Entrada inválida', 'Por favor, introduce una cantidad de agua válida.');
            return;
        }

        try {
            await axios.post(`${API_BASE_URL}/log`, {
                userId: userId,
                amountMl: parseFloat(waterAmount)
            });
            Alert.alert('Éxito', 'Ingesta de agua registrada correctamente.');
            setWaterAmount('');
            fetchHydrationStatus(); // Actualizar el estado después de registrar
        } catch (error) {
            console.error('Error logging water intake:', error);
            Alert.alert('Error', 'No se pudo registrar la ingesta de agua.');
        }
    };

    const triggerHydrationReminder = async () => {
        console.log('triggerHydrationReminder called');
        try {
            console.log('Attempting to send hydration reminder...');
            const response = await axios.post(`${API_BASE_URL}/trigger-reminder`, { userId: userId });
            console.log('Hydration reminder response:', response.data);
             console.log('Attempting to show Alert.alert for success.');
             Alert.alert('Recordatorio enviado', 'Se ha intentado enviar un recordatorio de hidratación.');
         } catch (error) {
             console.error('Error triggering reminder:', error.response ? error.response.data : error.message);
             console.log('Attempting to show Alert.alert for error.');
             Alert.alert('Error', 'No se pudo enviar el recordatorio.');
         }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Estado de Hidratación</Text>
            <Text style={styles.statusText}>{hydrationStatus}</Text>

            <TextInput
                style={styles.input}
                placeholder="Cantidad de agua (ml)"
                keyboardType="numeric"
                value={waterAmount}
                onChangeText={setWaterAmount}
            />
            <Button title="Registrar Ingesta de Agua" onPress={logWaterIntake} />

            <View style={styles.spacer} />

            <Button title="Enviar Recordatorio (Test)" onPress={triggerHydrationReminder} color="#841584" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    statusText: {
        fontSize: 18,
        marginBottom: 30,
        textAlign: 'center',
        color: '#555',
    },
    input: {
        width: '80%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 20,
        backgroundColor: '#fff',
    },
    spacer: {
        height: 30,
    },
});

const translateHydrationStatus = (statusMessage) => {
    const regex = /Current hydration status for user (\d+): ([\d,.]+) ml remaining to reach goal./;
    const match = statusMessage.match(regex);

    if (match) {
        const userId = match[1];
        const amount = match[2];
        return `Estado de hidratación actual para el usuario ${userId}: ${amount} ml restantes para alcanzar la meta.`;
    } else {
        return statusMessage; // Retorna el mensaje original si no coincide con el patrón
    }
};

export default HydrationScreen;