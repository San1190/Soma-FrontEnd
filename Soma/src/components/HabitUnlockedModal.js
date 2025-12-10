import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const HabitUnlockedModal = ({ visible, onClose, habit }) => {
    const scaleValue = useRef(new Animated.Value(0)).current;
    const opacityValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(scaleValue, {
                    toValue: 1,
                    friction: 5,
                    tension: 40,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityValue, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            scaleValue.setValue(0);
            opacityValue.setValue(0);
        }
    }, [visible]);

    if (!visible || !habit) return null;

    return (
        <Modal transparent visible={visible} animationType="none">
            <View style={styles.overlay}>
                <Animated.View style={[styles.container, { opacity: opacityValue, transform: [{ scale: scaleValue }] }]}>
                    <LinearGradient
                        colors={['#4b3340', '#2f3f47']}
                        style={styles.gradient}
                    >
                        <View style={styles.iconContainer}>
                            <Ionicons name="trophy" size={50} color="#FFD700" />
                        </View>

                        <Text style={styles.title}>NUEVO PROTOCOLO</Text>
                        <Text style={styles.subtitle}>Has iniciado el hábito:</Text>

                        <View style={styles.habitCard}>
                            <Text style={styles.habitTitle}>{habit.title}</Text>
                            <Text style={styles.habitDesc}>{habit.description}</Text>
                        </View>

                        <Text style={styles.footer}>¡Mantén la racha para desbloquear recompensas!</Text>

                        <TouchableOpacity style={styles.button} onPress={onClose}>
                            <Text style={styles.buttonText}>¡VAMOS!</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    container: {
        width: '100%',
        maxWidth: 340,
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    gradient: {
        padding: 30,
        alignItems: 'center',
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#FFD700',
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: 2,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 20,
    },
    habitCard: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        width: '100%',
        padding: 16,
        borderRadius: 16,
        marginBottom: 24,
        borderLeftWidth: 4,
        borderLeftColor: '#CFF3C9',
    },
    habitTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 4,
    },
    habitDesc: {
        fontSize: 14,
        color: '#E0E0E0',
    },
    footer: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.5)',
        marginBottom: 24,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    button: {
        backgroundColor: '#fff',
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 30,
        elevation: 5,
    },
    buttonText: {
        color: '#4b3340',
        fontWeight: '800',
        fontSize: 16,
    },
});

export default HabitUnlockedModal;
