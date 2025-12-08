import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, PanResponder } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import API_BASE_URL from '../constants/api';

export default function HydrationGoalScreen() {
    const { currentTheme } = useTheme();
    const { user } = useAuth();
    const navigation = useNavigation();
    const [colorOn, setColorOn] = useState(true);
    const [activeMode, setActiveMode] = useState('stress');
    const [goalLiters, setGoalLiters] = useState(1.5);
    const [ringPan, setRingPan] = useState(null);
    const [weeklyStats, setWeeklyStats] = useState({
        bestDayLiters: 0,
        worstDayLiters: 0,
        chartData: []
    });

    const arcStartDeg = -60;
    const arcSweepDeg = 300;
    const minLiters = 0.5;
    const maxLiters = 4.0;

    const palette = {
        off: { appBg: '#EFEFEF', cardBg: '#EFEFEF', accent: '#7a7a7a' },
        stress: { appBg: '#EAE5FF', cardBg: '#CFC4E9', accent: '#4b3340' },
        fatigue: { appBg: '#EAFBE8', cardBg: '#CFF3C9', accent: '#3f6f52' },
        insomnio: { appBg: '#DDEAF1', cardBg: '#DDEAF1', accent: '#5f7f92' },
    };

    const currentPalette = colorOn ? (palette[activeMode] || palette.stress) : palette.off;

    useEffect(() => {
        const loadHydrationGoal = async () => {
            const userId = user?.id;
            if (!userId) return;
            try {
                const res = await axios.get(`${API_BASE_URL}/hydration/needs`, { params: { userId } });
                const needsMl = Number(res.data?.dailyNeedsMl || 2000);
                setGoalLiters(Math.round((needsMl / 1000) * 4) / 4);
            } catch (err) {
                console.error('Error loading hydration goal:', err);
            }
        };
        loadHydrationGoal();
    }, [user?.id]);

    useEffect(() => {
        const loadStats = async () => {
            const userId = user?.id;
            if (!userId) return;
            try {
                const res = await axios.get(`${API_BASE_URL}/hydration/stats`, { params: { userId } });
                setWeeklyStats(res.data);
            } catch (err) {
                console.error('Error loading stats:', err);
            }
        };
        loadStats();
    }, [user?.id]);

    useEffect(() => {
        const responder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (evt) => {
                const x = evt.nativeEvent.locationX - 100;
                const y = evt.nativeEvent.locationY - 100;
                const ang = Math.atan2(y, x) * 180 / Math.PI;
                const degAbs = ang < 0 ? ang + 360 : ang;
                let rel = degAbs - arcStartDeg;
                while (rel < 0) rel += 360;
                if (rel > arcSweepDeg) rel = arcSweepDeg;
                const progress = rel / arcSweepDeg;
                const liters = minLiters + progress * (maxLiters - minLiters);
                setGoalLiters(Math.round(liters * 4) / 4);
            },
        });
        setRingPan(responder);
    }, []);

    const saveGoal = async () => {
        const userId = user?.id;
        if (!userId) return;
        try {
            await axios.post(`${API_BASE_URL}/hydration/goal`, null, { params: { userId, goalLiters } });
            navigation.goBack();
        } catch (err) {
            console.error('Error saving goal:', err);
        }
    };

    const incrementGoal = () => {
        setGoalLiters(prev => Math.min(maxLiters, Math.round((prev + 0.25) * 4) / 4));
    };

    const decrementGoal = () => {
        setGoalLiters(prev => Math.max(minLiters, Math.round((prev - 0.25) * 4) / 4));
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: currentPalette.appBg }]}>
            <ScrollView style={styles.container} contentContainerStyle={styles.content}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color={currentTheme.textPrimary} />
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                            style={[
                                styles.toggleTrack,
                                colorOn ? [
                                    styles.toggleOn,
                                    { backgroundColor: activeMode === 'stress' ? '#4b3340' : activeMode === 'insomnio' ? '#5f7f92' : '#3f6f52' }
                                ] : styles.toggleOff
                            ]}
                            onPress={() => setColorOn(v => !v)}
                        >
                            <View style={[styles.toggleKnob, colorOn ? styles.knobRight : styles.knobLeft]}>
                                <Ionicons name="person" size={16} color="#000" />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Title */}
                <Text style={[styles.screenTitle, { color: currentTheme.textPrimary }]}>Hidratación</Text>

                {/* Main Card */}
                <View style={[styles.card, { backgroundColor: currentPalette.cardBg, borderColor: currentPalette.cardBg }]}>

                    {/* Info Section */}
                    <View style={styles.infoSection}>
                        <Ionicons name="information-circle" size={24} color={currentPalette.accent} />
                        <Text style={[styles.infoText, { color: currentTheme.textPrimary }]}>
                            La hidratación es fundamental para el buen uso del día. Suma hidrata es un parámetro variable en función de multitud de características como el peso, la altura, la intensidad de ejercicio...
                        </Text>
                    </View>

                    {/* Circular Ring Selector */}
                    <View style={styles.ringSection}>
                        <Text style={[styles.sectionLabel, { color: currentPalette.accent }]}>Objetivo actual</Text>

                        <View style={styles.ringWrap} {...(ringPan ? ringPan.panHandlers : {})}>
                            {/* Base ring */}
                            <View style={[styles.ringBase, { borderColor: '#EAE5FF' }]} />
                            <View style={[styles.ringInner, { backgroundColor: currentPalette.cardBg }]} />

                            {/* Segments */}
                            {(() => {
                                const r = 86;
                                const total = 96;
                                const progress = (goalLiters - minLiters) / (maxLiters - minLiters);
                                const filledCount = Math.round(progress * total);
                                const segs = [];
                                for (let i = 0; i < total; i++) {
                                    const deg = arcStartDeg + (i * (arcSweepDeg / total));
                                    const rad = deg * Math.PI / 180;
                                    const cx = 100 + r * Math.cos(rad) - 8;
                                    const cy = 100 + r * Math.sin(rad) - 2;
                                    const filled = i <= filledCount;
                                    segs.push(
                                        <View key={`seg-${i}`} style={[styles.ringSegment, {
                                            left: cx,
                                            top: cy,
                                            backgroundColor: filled ? currentPalette.accent : 'transparent',
                                            transform: [{ rotate: `${deg + 90}deg` }]
                                        }]} />
                                    );
                                }
                                return segs;
                            })()}

                            {/* Handle */}
                            {(() => {
                                const r = 86;
                                const progress = (goalLiters - minLiters) / (maxLiters - minLiters);
                                const deg = arcStartDeg + Math.min(arcSweepDeg, progress * arcSweepDeg);
                                const rad = deg * Math.PI / 180;
                                const cx = 100 + r * Math.cos(rad) - 10;
                                const cy = 100 + r * Math.sin(rad) - 10;
                                return (
                                    <View style={[styles.ringHandle, { left: cx, top: cy, backgroundColor: currentPalette.accent }]}>
                                        <View style={styles.ringHandleInner} />
                                    </View>
                                );
                            })()}

                            {/* Center text */}
                            <View style={styles.centerText}>
                                <Text style={[styles.goalValue, { color: currentPalette.accent }]}>{goalLiters.toFixed(2)} L</Text>
                            </View>
                        </View>
                    </View>

                    {/* Weekly Chart Section */}
                    <View style={styles.chartSection}>
                        <Text style={[styles.chartTitle, { color: currentPalette.accent }]}>Gráfica de los últimos 7 días</Text>

                        {/* Simple bar chart */}
                        <View style={styles.chartContainer}>
                            {weeklyStats.chartData && weeklyStats.chartData.map((data, index) => {
                                const maxValue = Math.max(...weeklyStats.chartData.map(d => d.value), 1);
                                const height = (data.value / maxValue) * 80;
                                return (
                                    <View key={index} style={styles.barContainer}>
                                        <View style={[styles.bar, {
                                            height: height || 5,
                                            backgroundColor: currentPalette.accent
                                        }]} />
                                    </View>
                                );
                            })}
                        </View>

                        {/* Stats grid */}
                        <View style={styles.statsGrid}>
                            <View style={styles.statCard}>
                                <Text style={[styles.statCardLabel, { color: currentTheme.textSecondary }]}>Tu mejor día</Text>
                                <Text style={[styles.statCardValue, { color: currentTheme.textPrimary }]}>
                                    {weeklyStats.bestDayLiters?.toFixed(2) || '0.00'} L
                                </Text>
                            </View>
                            <View style={styles.statCard}>
                                <Text style={[styles.statCardLabel, { color: currentTheme.textSecondary }]}>Tu peor día</Text>
                                <Text style={[styles.statCardValue, { color: currentTheme.textPrimary }]}>
                                    {weeklyStats.worstDayLiters?.toFixed(2) || '0.00'} L
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Adjustment Buttons */}
                    <View style={styles.adjustSection}>
                        <TouchableOpacity
                            style={[styles.adjustBtn, { backgroundColor: '#EAE5FF' }]}
                            onPress={decrementGoal}
                        >
                            <Ionicons name="remove" size={24} color={currentPalette.accent} />
                        </TouchableOpacity>

                        <Text style={[styles.adjustLabel, { color: currentPalette.accent }]}>
                            Ajusta tu objetivo
                        </Text>

                        <TouchableOpacity
                            style={[styles.adjustBtn, { backgroundColor: '#EAE5FF' }]}
                            onPress={incrementGoal}
                        >
                            <Ionicons name="add" size={24} color={currentPalette.accent} />
                        </TouchableOpacity>
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity
                        style={[styles.saveBtn, { backgroundColor: currentPalette.accent }]}
                        onPress={saveGoal}
                    >
                        <Text style={styles.saveBtnText}>Guardar mi objetivo</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        ...(Platform.OS === 'web' ? { minHeight: '100vh' } : {})
    },
    container: {
        flex: 1
    },
    content: {
        padding: 16,
        paddingBottom: 40,
        paddingTop: Platform.OS === 'ios' ? 8 : 0
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
        marginBottom: 16,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.06)'
    },
    toggleTrack: {
        width: 78,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        paddingHorizontal: 4
    },
    toggleOn: {
        backgroundColor: '#000'
    },
    toggleOff: {
        backgroundColor: '#E6E6E6'
    },
    toggleKnob: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    knobLeft: {
        alignSelf: 'flex-start'
    },
    knobRight: {
        alignSelf: 'flex-end'
    },
    screenTitle: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 16
    },
    card: {
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 4,
    },
    infoSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        marginBottom: 24
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        lineHeight: 18
    },
    ringSection: {
        alignItems: 'center',
        marginBottom: 16
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 16
    },
    ringWrap: {
        width: 200,
        height: 200,
        position: 'relative',
        marginBottom: 20
    },
    ringBase: {
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 14
    },
    ringInner: {
        position: 'absolute',
        left: 28,
        top: 28,
        width: 144,
        height: 144,
        borderRadius: 72
    },
    ringSegment: {
        position: 'absolute',
        width: 16,
        height: 6,
        borderRadius: 3
    },
    ringHandle: {
        position: 'absolute',
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        alignItems: 'center',
        justifyContent: 'center',
    },
    ringHandleInner: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#fff'
    },
    centerText: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: 200,
        height: 200,
        alignItems: 'center',
        justifyContent: 'center'
    },
    goalValue: {
        fontSize: 32,
        fontWeight: '800'
    },
    chartSection: {
        marginTop: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 0, 0, 0.1)',
    },
    chartTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 16,
        textAlign: 'center',
    },
    chartContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: 100,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    barContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginHorizontal: 2,
    },
    bar: {
        width: '100%',
        borderRadius: 4,
        minHeight: 5,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        padding: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
        borderRadius: 12,
    },
    statCardLabel: {
        fontSize: 11,
        marginBottom: 4,
    },
    statCardValue: {
        fontSize: 16,
        fontWeight: '700',
    },
    adjustSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20,
        marginBottom: 20
    },
    adjustBtn: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
    },
    adjustLabel: {
        fontSize: 15,
        fontWeight: '600'
    },
    saveBtn: {
        paddingVertical: 14,
        borderRadius: 24,
        alignItems: 'center'
    },
    saveBtnText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 15
    },
});
