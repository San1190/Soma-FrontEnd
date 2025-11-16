// Archivo: san1190/soma-frontend/San1190-Soma-FrontEnd-12276c962af8134a3da9e0f3cfd941ba48025b46/Soma/src/screens/HydrationScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import API_BASE_URL from '../constants/api'; // Importamos la URL central
import { useAuth } from '../context/AuthContext';

const HYDRATION_API_URL = `${API_BASE_URL}/hydration`; // URL completa
const ML_PER_CUP = 250; // Cantidad de ml por vaso


const HydrationScreen = () => {
    const [hydrationStatus, setHydrationStatus] = useState('Cargando estado...');
    const [waterAmount, setWaterAmount] = useState('');
    const [cups, setCups] = useState(0);
    const [goal, setGoal] = useState(8); // Meta de vasos (por defecto 8 = 2000ml)
    const { user } = useAuth();
    const userId = user?.id || 1;

    useEffect(() => {
        fetchHydrationStatus();
        // Eliminar la alerta de prueba después de verificar su funcionalidad
        // Alert.alert('Test Alert', 'This is a test alert to check Alert.alert functionality.');
    }, []);

    const fetchHydrationStatus = async () => {
        try {
            const response = await axios.get(`${HYDRATION_API_URL}/status`, { params: { userId } });
            const payload = response.data;
            // Si por alguna razón llega el index.html del dev server, considerarlo error
            if (typeof payload === 'string' && /<!DOCTYPE html|<html/i.test(payload)) {
                throw new Error('Respuesta HTML inesperada desde la API de hidratación');
            }
            const statusStr = typeof payload === 'string' ? payload : (payload && payload.status ? payload.status : '');
            setHydrationStatus(translateHydrationStatus(statusStr));

            // Intentar obtener las necesidades diarias para calcular la meta
            try {
                const needsResponse = await axios.get(`${HYDRATION_API_URL}/needs`, { params: { userId } });
                const dailyNeedsMl = needsResponse.data.dailyNeedsMl || 2000;
                const calculatedGoal = Math.ceil(dailyNeedsMl / ML_PER_CUP);
                setGoal(calculatedGoal);
            } catch (error) {
                console.log('No se pudo obtener las necesidades diarias, usando valor por defecto');
            }
        } catch (error) {
            console.error('Error fetching hydration status:', error);
            setHydrationStatus('Error al cargar el estado de hidratación.');
            Alert.alert('Error', 'No se pudo cargar el estado de hidratación.');
        }
    };

    const addCup = async () => {
        if (cups < goal) {
            const newCups = cups + 1;
            setCups(newCups);

            // Registrar en la API automáticamente
            try {
                await axios.post(`${HYDRATION_API_URL}/log`, null, { params: { userId, amountMl: ML_PER_CUP } });
                fetchHydrationStatus(); // Actualizar el estado
            } catch (error) {
                console.error('Error logging water intake:', error);
                Alert.alert('Error', 'No se pudo registrar la ingesta de agua.');
                setCups(cups);
            }
        }
    };

    const removeCup = async () => {
        if (cups > 0) {
            const newCups = cups - 1;
            setCups(newCups);
            // Nota: En una implementación real, podrías querer registrar una "remoción" o simplemente dejar que el usuario ajuste manualmente
            // Por ahora, solo actualizamos el estado local
        }
    };

    const logWaterIntake = async () => {
        if (!waterAmount || isNaN(waterAmount) || parseFloat(waterAmount) <= 0) {
            Alert.alert('Entrada inválida', 'Por favor, introduce una cantidad de agua válida.');
            return;
        }

        try {
            await axios.post(`${HYDRATION_API_URL}/log`, null, { params: { userId, amountMl: parseFloat(waterAmount) } });
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
            const response = await axios.post(`${HYDRATION_API_URL}/trigger-reminder`, null, { params: { userId } });
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
        <View style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Text style={styles.title}>Estado de Hidratación</Text>
            <Text style={styles.statusText}>{hydrationStatus}</Text>

            {/* Tracker de Vasos */}
            <View style={styles.cupsSection}>
                <Text style={styles.cupsTitle}>Water Tracker</Text>
                <Text style={styles.cupsSubtitle}>Meta: {goal} vasos ({goal * ML_PER_CUP} ml)</Text>
                <Text style={styles.cupsTotal}>Total: {cups} vaso{cups !== 1 ? 's' : ''} ({cups * ML_PER_CUP} ml)</Text>

                <View style={styles.cupsRow}>
                    <TouchableOpacity onPress={removeCup} style={styles.cupButton}>
                        <Text style={styles.cupButtonText}>–</Text>
                    </TouchableOpacity>

                    <View style={styles.cupsContainer}>
                        {Array.from({ length: goal }).map((_, index) => (
                            <MaterialCommunityIcons
                                key={index}
                                name={index < cups ? "cup-water" : "cup-outline"}
                                size={40}
                                color={index < cups ? "#007AFF" : "#CCCCCC"}
                                style={styles.cupIcon}
                            />
                        ))}
                    </View>

                    <TouchableOpacity onPress={addCup} style={styles.cupButton}>
                        <Text style={styles.cupButtonText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.spacer} />

            {/* Entrada Manual */}
            <Text style={styles.sectionTitle}>Registro Manual</Text>
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
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    contentContainer: {
        padding: 20,
        alignItems: 'center',
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
    cupsSection: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 30,
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cupsTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    cupsSubtitle: {
        fontSize: 16,
        marginBottom: 5,
        color: '#666',
    },
    cupsTotal: {
        fontSize: 16,
        marginBottom: 15,
        fontWeight: '600',
        color: '#007AFF',
    },
    cupsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cupsContainer: {
        flexDirection: 'row',
        marginHorizontal: 10,
        flexWrap: 'wrap',
        justifyContent: 'center',
        maxWidth: '100%',
    },
    cupIcon: {
        marginHorizontal: 5,
        marginVertical: 3,
    },
    cupButton: {
        backgroundColor: '#007AFF',
        borderRadius: 25,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cupButtonText: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
        color: '#333',
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
    if (typeof statusMessage !== 'string') {
        return 'Estado de hidratación no disponible';
    }
    return statusMessage;
};

export default HydrationScreen;
