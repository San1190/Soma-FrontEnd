import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import TopBar from '../components/TopBar';
import HabitUnlockedModal from '../components/HabitUnlockedModal'; // NEW
import axios from 'axios';
import API_BASE_URL from '../constants/api';

const WellnessPredictionScreen = () => {
    const { currentTheme } = useTheme();
    const navigation = useNavigation();
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [locked, setLocked] = useState(false);

    // Modal State
    const [modalVisible, setModalVisible] = useState(false);
    const [newHabit, setNewHabit] = useState(null);
    const [habitCreating, setHabitCreating] = useState(false);

    // Hardcoded User ID for demo
    const USER_ID = 1;

    const fetchPrediction = async () => {
        try {
            setLoading(true);
            setError(null);
            // Use API_BASE_URL if defined, else localhost
            const url = API_BASE_URL ? `${API_BASE_URL}/prediction/${USER_ID}` : `http://localhost:8080/api/prediction/${USER_ID}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error fetching prediction');
            }
            const data = await response.json();
            setPrediction(data);
        } catch (err) {
            console.error(err);
            setError('No se pudo cargar la predicción. Verifica tu conexión.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrediction();
    }, []);

    const handleAddHabit = async () => {
        if (!prediction) return;

        try {
            setHabitCreating(true);
            let title = "Nuevo Hábito";
            let desc = "Hábito sugerido por Somat";

            if (prediction.alertLevel === 'High') {
                title = "Descansos Activos";
                desc = "Programar descansos activos cada 2 horas";
            } else if (prediction.alertLevel === 'Medium') {
                title = "Desconexión Nocturna";
                desc = "Desconectar de pantallas 30 min antes de dormir";
            } else {
                title = "Mantenimiento";
                desc = "Mantener rutina actual de ejercicio";
            }

            const payload = {
                userId: USER_ID,
                title: title,
                description: desc,
                type: 'PREDICTION'
            };

            const res = await axios.post(`${API_BASE_URL}/habits`, payload);
            setNewHabit(res.data);
            setModalVisible(true);

        } catch (e) {
            console.error("Error creating habit", e);
        } finally {
            setHabitCreating(false);
        }
    };

    const getAlertColor = (level) => {
        switch (level) {
            case 'High': return '#f8d7da'; // Muted Red
            case 'Medium': return '#fff3cd'; // Muted Yellow
            case 'Low': return '#d1e7dd'; // Muted Green
            default: return '#e2e3e5';
        }
    };

    const getAlertText = (level) => {
        switch (level) {
            case 'High': return 'Riesgo Elevado';
            case 'Medium': return 'Riesgo Moderado';
            case 'Low': return 'Bajo Riesgo';
            default: return 'Estado Desconocido';
        }
    };

    const getAlertIcon = (level) => {
        switch (level) {
            case 'High': return 'warning';
            case 'Medium': return 'alert-circle';
            case 'Low': return 'checkmark-circle';
            default: return 'help-circle';
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.safeArea, { backgroundColor: '#F9FAFB' }]}>
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#000" />
                    <Text style={styles.loadingText}>Analizando tus datos biométricos...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: '#F9FAFB' }]}>
            <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>

                {/* Header Navigation */}
                <TopBar onAvatarPress={() => navigation.navigate('Profile')} variant="lock" active={locked} onToggle={() => setLocked(v => !v)} />

                <Text style={styles.mainTitle}>Predicción de Bienestar</Text>
                <Text style={styles.subtitle}>
                    Análisis de tendencias basado en tus últimos 30 días de actividad.
                </Text>

                {error ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity style={styles.retryButton} onPress={fetchPrediction}>
                            <Text style={styles.retryButtonText}>Reintentar</Text>
                        </TouchableOpacity>
                    </View>
                ) : prediction && (
                    <>
                        {/* Alert Card */}
                        <View style={[styles.card, { backgroundColor: getAlertColor(prediction.alertLevel) }]}>
                            <View style={styles.cardHeader}>
                                <Ionicons name={getAlertIcon(prediction.alertLevel)} size={24} color="#333" />
                                <Text style={styles.cardStatusTitle}>{getAlertText(prediction.alertLevel)}</Text>
                            </View>
                            <Text style={styles.cardDescription}>{prediction.message}</Text>
                            <Text style={styles.cardDate}>Actualizado hoy</Text>
                        </View>

                        {/* Trends Section */}
                        <Text style={styles.sectionTitle}>Tendencias Clave</Text>
                        <View style={styles.statsRow}>
                            {/* Stress Trend */}
                            <View style={styles.miniCard}>
                                <View style={styles.miniCardHeader}>
                                    <Text style={styles.miniCardTitle}>Estrés</Text>
                                    <Ionicons name="pulse" size={18} color="#4b3340" />
                                </View>
                                <Text style={[
                                    styles.miniCardValue,
                                    { color: prediction.predictedStressTrend > 0.05 ? '#D32F2F' : '#388E3C' }
                                ]}>
                                    {prediction.predictedStressTrend > 0 ? '↗' : '↘'} {Math.abs(prediction.predictedStressTrend * 100).toFixed(1)}%
                                </Text>
                                <Text style={styles.miniCardSub}>vs. mes anterior</Text>
                            </View>

                            {/* Sleep Trend */}
                            <View style={styles.miniCard}>
                                <View style={styles.miniCardHeader}>
                                    <Text style={styles.miniCardTitle}>Sueño</Text>
                                    <Ionicons name="moon" size={18} color="#5F7F92" />
                                </View>
                                <Text style={[
                                    styles.miniCardValue,
                                    { color: prediction.predictedSleepTrend < -0.05 ? '#FBC02D' : '#388E3C' }
                                ]}>
                                    {prediction.predictedSleepTrend > 0 ? '↗' : '↘'} {Math.abs(prediction.predictedSleepTrend * 100).toFixed(1)}%
                                </Text>
                                <Text style={styles.miniCardSub}>calidad promedio</Text>
                            </View>
                        </View>

                        {/* Recommendation Section */}
                        <Text style={styles.sectionTitle}>Recomendación Personalizada</Text>
                        <View style={[styles.card, styles.recommendationCard]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                                <Ionicons name="bulb-outline" size={22} color="#fff" />
                                <Text style={[styles.cardStatusTitle, { color: '#fff', marginLeft: 8 }]}>Consejo de Somat</Text>
                            </View>

                            <Text style={styles.recommendationText}>
                                {prediction.alertLevel === 'High'
                                    ? "Tus niveles de estrés muestran una tendencia al alza constante. Te recomendamos programar descansos activos cada 2 horas."
                                    : prediction.alertLevel === 'Medium'
                                        ? "Tu calidad de sueño podría estar afectando tu energía. Intenta desconectar de pantallas 30 minutos antes de dormir."
                                        : "¡Sigue así! Tus métricas indican un equilibrio saludable. Mantén tu rutina actual para conservar este estado."}
                            </Text>

                            <TouchableOpacity style={styles.actionButton} onPress={handleAddHabit}>
                                <Text style={styles.actionButtonText}>
                                    {habitCreating ? "Añadiendo..." : "Añadir hábito sugerido"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </ScrollView>
            {/* Modal */}
            <HabitUnlockedModal visible={modalVisible} onClose={() => setModalVisible(false)} habit={newHabit} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    content: { flex: 1 },
    scrollContent: { padding: 20, paddingBottom: 40 },

    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#666',
    },

    mainTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1a1a1a',
        marginTop: 10,
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 15,
        color: '#666',
        marginBottom: 24,
        lineHeight: 22,
    },

    errorContainer: {
        alignItems: 'center',
        marginTop: 40,
    },
    errorText: {
        fontSize: 16,
        color: '#D32F2F',
        marginBottom: 16,
    },
    retryButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#333',
        borderRadius: 20,
    },
    retryButtonText: {
        color: '#fff',
        fontWeight: '600',
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginTop: 24,
        marginBottom: 12,
    },

    card: {
        borderRadius: 24,
        padding: 20,
        marginBottom: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 10,
    },
    cardStatusTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a1a1a',
    },
    cardDescription: {
        fontSize: 15,
        color: '#333',
        lineHeight: 22,
        marginBottom: 12,
    },
    cardDate: {
        fontSize: 12,
        color: '#666',
        textAlign: 'right',
        fontStyle: 'italic',
    },

    statsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    miniCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    miniCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    miniCardTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    miniCardValue: {
        fontSize: 22,
        fontWeight: '800',
        marginBottom: 4,
    },
    miniCardSub: {
        fontSize: 11,
        color: '#999',
    },

    recommendationCard: {
        backgroundColor: '#4b3340', // Primary Dark Theme Color
    },
    recommendationText: {
        color: '#F0F0F0',
        fontSize: 15,
        lineHeight: 24,
        marginBottom: 20,
    },
    actionButton: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingVertical: 12,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    actionButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
    },
});

export default WellnessPredictionScreen;
