import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';

const BreathingExerciseCard = () => {
    const [isActive, setIsActive] = useState(false);
    const [phase, setPhase] = useState('Inhalar'); // 'Inhalar', 'Mantén', 'Exhalar'
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const phaseTimerRef = useRef(null);

    useEffect(() => {
        if (isActive) {
            startBreathingCycle();
        } else {
            // Reset
            if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();
            setPhase('Inhalar');
        }
        return () => {
            if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
        };
    }, [isActive]);

    const startBreathingCycle = () => {
        // Phase 1: Inhalar (4s)
        setPhase('Inhalar');
        Animated.timing(scaleAnim, {
            toValue: 1.4,
            duration: 4000,
            useNativeDriver: true,
        }).start();

        phaseTimerRef.current = setTimeout(() => {
            // Phase 2: Mantén (4s)
            setPhase('Mantén');

            phaseTimerRef.current = setTimeout(() => {
                // Phase 3: Exhalar (6s)
                setPhase('Exhalar');
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 6000,
                    useNativeDriver: true,
                }).start();

                phaseTimerRef.current = setTimeout(() => {
                    // Restart cycle if still active
                    if (isActive) {
                        startBreathingCycle();
                    }
                }, 6000);
            }, 4000);
        }, 4000);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ejercicios de respiración guiada</Text>
            <Text style={styles.description}>
                Te recomendamos realizar ejercicios de respiración a diario e introducirlos en tu rutina como ayuda para erradicar tu estrés digital. ¿Te ayudamos?
            </Text>

            <View style={styles.circleContainer}>
                {/* Background circles */}
                <View style={[styles.circleOuter, styles.circleOuterRing]} />
                <View style={[styles.circleOuter, styles.circleMiddleRing]} />

                {/* Animated pulsing circle */}
                <Animated.View
                    style={[
                        styles.circlePulse,
                        {
                            transform: [{ scale: scaleAnim }],
                        },
                    ]}
                >
                    <Text style={styles.phaseText}>{phase}</Text>
                </Animated.View>
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={() => setIsActive(!isActive)}
            >
                <Text style={styles.buttonText}>
                    {isActive ? 'Detener ejercicio' : 'Iniciar mis ejercicios de respiración'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        marginTop: 12,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2f3f47',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: '#6b7280',
        lineHeight: 20,
        marginBottom: 20,
    },
    circleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 240,
        marginVertical: 10,
        position: 'relative',
    },
    circleOuter: {
        position: 'absolute',
        borderRadius: 200,
        opacity: 0.15,
    },
    circleOuterRing: {
        width: 240,
        height: 240,
        backgroundColor: '#CFC4E9',
    },
    circleMiddleRing: {
        width: 200,
        height: 200,
        backgroundColor: '#BFAEE3',
        opacity: 0.2,
    },
    circlePulse: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: '#CFC4E9',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#4b3340',
        shadowOpacity: 0.3,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 4 },
        elevation: 8,
    },
    phaseText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#4b3340',
    },
    button: {
        marginTop: 10,
        paddingVertical: 12,
        borderRadius: 24,
        alignItems: 'center',
        backgroundColor: '#000',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
    },
});

export default BreathingExerciseCard;
