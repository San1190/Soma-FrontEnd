import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HabitUnlockedModal = ({ visible, onClose, habit }) => {
    const scaleValue = useRef(new Animated.Value(0)).current;
    const opacityValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(scaleValue, {
                    toValue: 1,
                    friction: 8,
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
                    {/* Close button */}
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close" size={24} color="#6b7280" />
                    </TouchableOpacity>

                    {/* Icon */}
                    <View style={styles.iconContainer}>
                        <Ionicons name="checkmark-circle" size={64} color="#4b3340" />
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>Nuevo hábito añadido</Text>

                    {/* Habit info */}
                    <View style={styles.habitCard}>
                        <Text style={styles.habitTitle}>{habit.title}</Text>
                        <Text style={styles.habitDesc}>{habit.description}</Text>
                    </View>

                    {/* Encouragement */}
                    <Text style={styles.encouragement}>
                        Complétalo cada día para crear una racha y mejorar tu bienestar
                    </Text>

                    {/* Button */}
                    <TouchableOpacity style={styles.button} onPress={onClose}>
                        <Text style={styles.buttonText}>Entendido</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    container: {
        width: '100%',
        maxWidth: 340,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 10 },
        elevation: 10,
    },
    closeButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f3f4f6',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    iconContainer: {
        marginTop: 20,
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 20,
        textAlign: 'center',
    },
    habitCard: {
        backgroundColor: '#f9fafb',
        width: '100%',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        borderLeftWidth: 3,
        borderLeftColor: '#4b3340',
    },
    habitTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 6,
    },
    habitDesc: {
        fontSize: 14,
        color: '#6b7280',
        lineHeight: 20,
    },
    encouragement: {
        fontSize: 13,
        color: '#9ca3af',
        marginBottom: 24,
        textAlign: 'center',
        lineHeight: 18,
        paddingHorizontal: 8,
    },
    button: {
        backgroundColor: '#000',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 24,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 15,
    },
});

export default HabitUnlockedModal;
