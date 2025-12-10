import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Modal, TextInput, Switch, PanResponder } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import FooterNav from '../components/FooterNav';
import { useTheme } from '../context/ThemeContext';

export default function SmartAlarmScreen() {
    const { currentTheme } = useTheme();
    const navigation = useNavigation();
    const [alarmEnabled, setAlarmEnabled] = useState(true);

    // State for main clock display
    const [sleepTime, setSleepTime] = useState('23:00');
    const [wakeTime, setWakeTime] = useState('06:30');

    // Circular clock angles (0-360 degrees) - for interactive dragging
    const [moonAngle, setMoonAngle] = useState(345); // 23:00 = 345°
    const [sunAngle, setSunAngle] = useState(97.5);  // 06:30 = 97.5°

    // Convert angle to time (0° = 0:00 at top, clockwise)
    const angleToTime = (angle) => {
        const normalizedAngle = ((angle % 360) + 360) % 360;
        const totalMinutes = Math.round((normalizedAngle / 360) * (24 * 60));
        const hours = Math.floor(totalMinutes / 60) % 24;
        const minutes = totalMinutes % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };

    // Convert time to angle
    const timeToAngle = (timeStr) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes;
        return (totalMinutes / (24 * 60)) * 360;
    };

    // Calculate icon position on circle
    const getIconPosition = (angle, radius) => {
        const radians = (angle - 90) * (Math.PI / 180); // -90 to start from top
        return {
            x: Math.cos(radians) * radius,
            y: Math.sin(radians) * radius
        };
    };

    const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
    const daysFullNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    // State for alarm management
    const [alarms, setAlarms] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingAlarmId, setEditingAlarmId] = useState(null); // null = new alarm, otherwise editing

    // State for alarm configuration in modal
    const [alarmName, setAlarmName] = useState('');
    const [selectedDays, setSelectedDays] = useState([]);
    const [tempSleepHour, setTempSleepHour] = useState('23');
    const [tempSleepMinute, setTempSleepMinute] = useState('00');
    const [tempWakeHour, setTempWakeHour] = useState('06');
    const [tempWakeMinute, setTempWakeMinute] = useState('30');

    // Store circle center position using ref
    const circleLayoutRef = useRef({ x: 0, y: 0, measured: false });

    // Handle circle layout measurement
    const onCircleLayout = (event) => {
        const { x, y, width, height } = event.nativeEvent.layout;
        // Measure position relative to window
        event.target.measure((fx, fy, w, h, px, py) => {
            circleLayoutRef.current = {
                x: px + w / 2,
                y: py + h / 2,
                measured: true
            };
        });
    };

    // Create PanResponder with proper angle calculation
    const createIconPanResponder = (angleState, setAngle, setTime) => {
        return PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (evt, gestureState) => {
                if (!circleLayoutRef.current.measured) return;

                const { pageX, pageY } = evt.nativeEvent;
                const { x: centerX, y: centerY } = circleLayoutRef.current;

                // Calculate angle from center to touch point
                const dx = pageX - centerX;
                const dy = pageY - centerY;

                // Calculate angle in degrees (0° at top, clockwise)
                let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
                if (angle < 0) angle += 360;

                // Update angle and time
                setAngle(angle);
                setTime(angleToTime(angle));
            },
        });
    };

    const moonPanResponder = createIconPanResponder(moonAngle, setMoonAngle, setSleepTime);
    const sunPanResponder = createIconPanResponder(sunAngle, setSunAngle, setWakeTime);

    // Load alarms from AsyncStorage on mount
    useEffect(() => {
        loadAlarms();
    }, []);

    // Save alarms to AsyncStorage whenever they change
    useEffect(() => {
        if (alarms.length >= 0) {
            saveAlarms();
        }
    }, [alarms]);

    const loadAlarms = async () => {
        try {
            const savedAlarms = await AsyncStorage.getItem('@alarms');
            if (savedAlarms !== null) {
                setAlarms(JSON.parse(savedAlarms));
            }
        } catch (error) {
            console.error('Error loading alarms:', error);
        }
    };

    const saveAlarms = async () => {
        try {
            await AsyncStorage.setItem('@alarms', JSON.stringify(alarms));
        } catch (error) {
            console.error('Error saving alarms:', error);
        }
    };

    // Open modal for alarm configuration
    const handleSetAlarm = () => {
        // Initialize temp values with current display values
        const [sh, sm] = sleepTime.split(':');
        const [wh, wm] = wakeTime.split(':');
        setTempSleepHour(sh);
        setTempSleepMinute(sm);
        setTempWakeHour(wh);
        setTempWakeMinute(wm);
        setAlarmName('');
        setSelectedDays([]);
        setModalVisible(true);
    };

    // Edit existing alarm
    const editAlarm = (alarm) => {
        const [sh, sm] = alarm.sleepTime.split(':');
        const [wh, wm] = alarm.wakeTime.split(':');
        setTempSleepHour(sh);
        setTempSleepMinute(sm);
        setTempWakeHour(wh);
        setTempWakeMinute(wm);
        setAlarmName(alarm.name);
        setSelectedDays(alarm.days);
        setEditingAlarmId(alarm.id);
        setModalVisible(true);
    };

    // Toggle day selection
    const toggleDay = (index) => {
        if (selectedDays.includes(index)) {
            setSelectedDays(selectedDays.filter(d => d !== index));
        } else {
            setSelectedDays([...selectedDays, index].sort());
        }
    };

    // Calculate sleep duration
    const calculateDuration = (sleep, wake) => {
        const [sh, sm] = sleep.split(':').map(Number);
        const [wh, wm] = wake.split(':').map(Number);

        let totalMinutes = (wh * 60 + wm) - (sh * 60 + sm);
        if (totalMinutes < 0) totalMinutes += 24 * 60; // Handle overnight

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const cycles = Math.round(totalMinutes / 90);

        return { hours, minutes, cycles };
    };

    // Create or update alarm
    const createAlarm = () => {
        const sleepTimeStr = `${tempSleepHour}:${tempSleepMinute}`;
        const wakeTimeStr = `${tempWakeHour}:${tempWakeMinute}`;
        const duration = calculateDuration(sleepTimeStr, wakeTimeStr);

        if (editingAlarmId) {
            // Update existing alarm
            setAlarms(alarms.map(alarm =>
                alarm.id === editingAlarmId ? {
                    ...alarm,
                    name: alarmName || alarm.name,
                    sleepTime: sleepTimeStr,
                    wakeTime: wakeTimeStr,
                    days: selectedDays,
                    duration: `${duration.hours}h ${duration.minutes}m`,
                    cycles: duration.cycles,
                } : alarm
            ));
        } else {
            // Create new alarm
            const newAlarm = {
                id: Date.now().toString(),
                name: alarmName || `Alarma ${alarms.length + 1}`,
                sleepTime: sleepTimeStr,
                wakeTime: wakeTimeStr,
                days: selectedDays,
                duration: `${duration.hours}h ${duration.minutes}m`,
                cycles: duration.cycles,
                enabled: true
            };
            setAlarms([...alarms, newAlarm]);
        }

        setSleepTime(sleepTimeStr);
        setWakeTime(wakeTimeStr);
        setModalVisible(false);
        setEditingAlarmId(null);
    };

    // Toggle alarm on/off
    const toggleAlarm = (id) => {
        setAlarms(alarms.map(alarm =>
            alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
        ));
    };

    // Delete alarm
    // Calculate time until alarm rings (considering selected days)
    const getTimeUntilAlarm = (alarmTime, selectedDays) => {
        const now = new Date();
        const [alarmHour, alarmMinute] = alarmTime.split(':').map(Number);

        // If no days selected, alarm rings every day
        if (!selectedDays || selectedDays.length === 0) {
            const alarm = new Date();
            alarm.setHours(alarmHour, alarmMinute, 0, 0);

            // If alarm time is earlier than current time, it's tomorrow
            if (alarm <= now) {
                alarm.setDate(alarm.getDate() + 1);
            }

            const diffMs = alarm - now;
            const diffMins = Math.floor(diffMs / 60000);
            const totalHours = Math.floor(diffMins / 60);
            const minutes = diffMins % 60;
            const days = Math.floor(totalHours / 24);
            const hours = totalHours % 24;

            if (days > 0) {
                return `En ${days}d ${hours}h ${minutes}m`;
            } else if (hours > 0) {
                return `En ${hours}h ${minutes}m`;
            } else if (minutes > 0) {
                return `En ${minutes}m`;
            } else {
                return '¡Sonando!';
            }
        }

        // Find next occurrence of alarm based on selected days
        const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        // Convert to our format: 0 = Lunes, 1 = Martes, ..., 6 = Domingo
        const currentDayIndex = currentDay === 0 ? 6 : currentDay - 1;

        let nextAlarmDate = null;
        let daysUntilAlarm = 0;

        // Check if alarm is today
        if (selectedDays.includes(currentDayIndex)) {
            const todayAlarm = new Date();
            todayAlarm.setHours(alarmHour, alarmMinute, 0, 0);

            if (todayAlarm > now) {
                nextAlarmDate = todayAlarm;
                daysUntilAlarm = 0;
            }
        }

        // If not today or already passed today, find next day
        if (!nextAlarmDate) {
            for (let i = 1; i <= 7; i++) {
                const checkDayIndex = (currentDayIndex + i) % 7;
                if (selectedDays.includes(checkDayIndex)) {
                    daysUntilAlarm = i;
                    nextAlarmDate = new Date();
                    nextAlarmDate.setDate(now.getDate() + i);
                    nextAlarmDate.setHours(alarmHour, alarmMinute, 0, 0);
                    break;
                }
            }
        }

        if (!nextAlarmDate) {
            return 'Sin días seleccionados';
        }

        const diffMs = nextAlarmDate - now;
        const diffMins = Math.floor(diffMs / 60000);
        const totalHours = Math.floor(diffMins / 60);
        const minutes = diffMins % 60;
        const days = Math.floor(totalHours / 24);
        const hours = totalHours % 24;

        if (days > 0) {
            return `En ${days}d ${hours}h ${minutes}m`;
        } else if (hours > 0) {
            return `En ${hours}h ${minutes}m`;
        } else if (minutes > 0) {
            return `En ${minutes}m`;
        } else {
            return '¡Sonando!';
        }
    };

    const deleteAlarm = (id) => {
        setAlarms(alarms.filter(alarm => alarm.id !== id));
    };

    // Calculate current and ideal sleep cycle data (7 days)
    // Current cycle based on actual sleep time from sleepTime to wakeTime
    const calculateSleepDuration = () => {
        const [sh, sm] = sleepTime.split(':').map(Number);
        const [wh, wm] = wakeTime.split(':').map(Number);
        let totalMinutes = (wh * 60 + wm) - (sh * 60 + sm);
        if (totalMinutes < 0) totalMinutes += 24 * 60;
        return totalMinutes / 60; // hours
    };

    const currentSleepHours = calculateSleepDuration();
    const idealSleepHours = 8; // Ideal sleep duration

    // Generate realistic sleep data for last 7 days
    // Current shows variation around actual sleep time
    const currentCycleData = [
        { day: 'L', hours: Math.max(4, currentSleepHours - 1.5 + Math.random() * 0.5) },
        { day: 'M', hours: Math.max(4, currentSleepHours - 0.5 + Math.random() * 0.5) },
        { day: 'X', hours: Math.max(4, currentSleepHours + 0.3 + Math.random() * 0.5) },
        { day: 'J', hours: Math.max(4, currentSleepHours - 1.0 + Math.random() * 0.5) },
        { day: 'V', hours: Math.max(4, currentSleepHours - 0.8 + Math.random() * 0.5) },
        { day: 'S', hours: Math.max(4, currentSleepHours + 1.2 + Math.random() * 0.5) },
        { day: 'D', hours: Math.max(4, currentSleepHours + 0.5 + Math.random() * 0.5) }
    ];

    // Ideal shows consistent good sleep
    const idealCycleData = [
        { day: 'L', hours: idealSleepHours },
        { day: 'M', hours: idealSleepHours },
        { day: 'X', hours: idealSleepHours },
        { day: 'J', hours: idealSleepHours },
        { day: 'V', hours: idealSleepHours },
        { day: 'S', hours: idealSleepHours + 0.5 }, // Slightly more on weekend
        { day: 'D', hours: idealSleepHours + 0.5 }
    ];

    // Calculate max for graph scaling
    const maxHours = Math.max(...currentCycleData.map(d => d.hours), ...idealCycleData.map(d => d.hours));
    const graphScale = 70 / maxHours; // Scale to fit in 70px height

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container} contentContainerStyle={styles.content}>

                {/* Header */}
                <View style={styles.topBar}>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.avatar}>
                        <Ionicons name="person" size={20} color="#000" />
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                            style={[styles.toggleTrack, alarmEnabled ? styles.toggleOn : styles.toggleOff]}
                            onPress={() => setAlarmEnabled(v => !v)}
                        >
                            <View style={[styles.toggleKnob, alarmEnabled ? styles.knobRight : styles.knobLeft]}>
                                <Ionicons name="person" size={16} color="#000" />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Title Section */}
                <Text style={styles.title}>Alarma inteligente</Text>
                <Text style={styles.subtitle}>
                    Modifica la alarma conociendo las diferentes fases de tu sueño o permite a Soma tomar el control de
                    esto para disfrutar de una transición en un sueño reparador
                </Text>

                {/* Circular Control with Draggable Sleep/Wake Icons */}
                <View style={styles.circularControlContainer}>
                    <View
                        style={styles.circularControl}
                        onLayout={onCircleLayout}
                    >
                        <View style={styles.circularControlInner}>
                            {/* Draggable Moon Icon - Sleep Time */}
                            <View
                                {...moonPanResponder.panHandlers}
                                style={[
                                    styles.controlIcon,
                                    {
                                        left: 110 + getIconPosition(moonAngle, 90).x - 24,
                                        top: 110 + getIconPosition(moonAngle, 90).y - 24,
                                    }
                                ]}
                            >
                                <Ionicons name="moon" size={32} color="#FFF" />
                            </View>

                            {/* Center Circle with Clock Icon */}
                            <View style={styles.centerCircle}>
                                <Ionicons name="time-outline" size={32} color="#889DAB" />
                            </View>

                            {/* Draggable Sun Icon - Wake Time */}
                            <View
                                {...sunPanResponder.panHandlers}
                                style={[
                                    styles.controlIcon,
                                    {
                                        left: 110 + getIconPosition(sunAngle, 90).x - 24,
                                        top: 110 + getIconPosition(sunAngle, 90).y - 24,
                                    }
                                ]}
                            >
                                <Ionicons name="sunny" size={32} color="#FFD700" />
                            </View>
                        </View>
                    </View>
                </View>

                {/* Time Displays */}
                <View style={styles.timeContainer}>
                    <View style={styles.timeBox}>
                        <Text style={styles.timeLabel}>Hora de dormir 🌙</Text>
                        <Text style={styles.timeValue}>{sleepTime}</Text>
                    </View>
                    <View style={styles.timeBox}>
                        <Text style={styles.timeLabel}>Hora de despertar ☀️</Text>
                        <Text style={styles.timeValue}>{wakeTime}</Text>
                    </View>
                </View>

                {/* Set Alarm Button */}
                <TouchableOpacity style={styles.setAlarmButton} onPress={handleSetAlarm}>
                    <Text style={styles.setAlarmButtonText}>Establecer alarma automática</Text>
                </TouchableOpacity>

                {/* Sleep Quality Message */}
                <View style={styles.messageBox}>
                    <Text style={styles.messageTitle}>Tu sueño es deficiente :(</Text>
                    <Text style={styles.messageText}>
                        Te explicamos por qué y que puedes hacer
                    </Text>
                </View>

                {/* Sleep Cycle Graph Card */}
                <View style={styles.graphCard}>
                    <Text style={styles.graphTitle}>Horas de sueño - Última semana 💤</Text>
                    <Text style={styles.graphSubtitle}>Compara tu sueño real vs ideal (7.5-8.5h recomendadas)</Text>

                    {/* Bar Chart Representation */}
                    <View style={styles.graphContainer}>
                        {currentCycleData.map((current, index) => {
                            const ideal = idealCycleData[index];
                            return (
                                <View key={index} style={styles.barGroup}>
                                    {/* Day label */}
                                    <Text style={styles.dayLabel}>{current.day}</Text>

                                    {/* Bars container */}
                                    <View style={styles.barsContainer}>
                                        {/* Ideal bar (background) */}
                                        <View
                                            style={[
                                                styles.idealBar,
                                                { height: ideal.hours * graphScale }
                                            ]}
                                        />
                                        {/* Current bar (foreground) */}
                                        <View
                                            style={[
                                                styles.currentBar,
                                                {
                                                    height: current.hours * graphScale,
                                                    backgroundColor: current.hours >= 7.5 ? '#4CAF50' : '#FF9800'
                                                }
                                            ]}
                                        />
                                    </View>

                                    {/* Hours value */}
                                    <Text style={styles.hoursLabel}>{current.hours.toFixed(1)}h</Text>
                                </View>
                            );
                        })}
                    </View>

                    {/* Graph Legend */}
                    <View style={styles.legendContainer}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
                            <Text style={styles.legendText}>Bueno (\u003e7.5h)</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: '#FF9800' }]} />
                            <Text style={styles.legendText}>Insuficiente (\u003c7.5h)</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: '#E0E0E0' }]} />
                            <Text style={styles.legendText}>Ideal (8h)</Text>
                        </View>
                    </View>
                </View>

                {/* Bottom CTA Button */}
                <TouchableOpacity
                    style={styles.ctaButton}
                    onPress={() => navigation.navigate('Chat')}
                >
                    <Text style={styles.ctaButtonText}>Pregunta sobre tu sueño a Soma!</Text>
                </TouchableOpacity>

                {/* Alarms List Section */}
                {alarms.length > 0 && (
                    <View style={styles.alarmsSection}>
                        <Text style={styles.alarmsSectionTitle}>Mis Alarmas 🔔</Text>
                        {alarms.map((alarm) => (
                            <TouchableOpacity
                                key={alarm.id}
                                style={styles.alarmCard}
                                onPress={() => editAlarm(alarm)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.alarmCardLeft}>
                                    <Text style={styles.alarmLabel}>{alarm.name}</Text>
                                    <View style={styles.alarmTimesRow}>
                                        <View style={styles.alarmTimeInfo}>
                                            <Text style={styles.alarmTimeLabel}>Dormir:</Text>
                                            <Text style={styles.alarmTime}>{alarm.sleepTime}</Text>
                                        </View>
                                        <Ionicons name="arrow-forward" size={16} color="#666" style={{ marginHorizontal: 8 }} />
                                        <View style={styles.alarmTimeInfo}>
                                            <Text style={styles.alarmTimeLabel}>Despertar:</Text>
                                            <Text style={styles.alarmTime}>{alarm.wakeTime}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.alarmDuration}>
                                        {alarm.cycles} ciclos • {alarm.duration}
                                    </Text>
                                    {alarm.days.length > 0 && (
                                        <Text style={styles.alarmDays}>
                                            {alarm.days.map(d => days[d]).join(', ')}
                                        </Text>
                                    )}
                                    {alarm.enabled && (
                                        <Text style={styles.alarmCountdown}>
                                            ⏰ {getTimeUntilAlarm(alarm.wakeTime, alarm.days)}
                                        </Text>
                                    )}
                                </View>
                                <View style={styles.alarmCardRight}>
                                    <Switch
                                        value={alarm.enabled}
                                        onValueChange={() => toggleAlarm(alarm.id)}
                                        trackColor={{ false: '#ddd', true: '#4CAF50' }}
                                        thumbColor="#fff"
                                    />
                                    <TouchableOpacity
                                        style={styles.deleteButton}
                                        onPress={(e) => {
                                            e.stopPropagation(); // Prevent edit when deleting
                                            deleteAlarm(alarm.id);
                                        }}
                                    >
                                        <Ionicons name="trash-outline" size={20} color="#FF5252" />
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

            </ScrollView>

            {/* Alarm Configuration Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <ScrollView style={styles.modalScrollView}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>
                                    {editingAlarmId ? 'Editar Alarma' : 'Configurar Alarma'}
                                </Text>
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <Ionicons name="close" size={28} color="#000" />
                                </TouchableOpacity>
                            </View>

                            {/* Alarm Name Input */}
                            <View style={styles.inputSection}>
                                <Text style={styles.inputLabel}>Nombre de la alarma</Text>
                                <TextInput
                                    style={styles.textInput}
                                    value={alarmName}
                                    onChangeText={setAlarmName}
                                    placeholder="Ej: Despertar trabajo"
                                    placeholderTextColor="#999"
                                />
                            </View>

                            {/* Sleep Time Picker */}
                            <View style={styles.timePickerSection}>
                                <Text style={styles.timePickerLabel}>Hora de dormir 🌙</Text>
                                <View style={styles.timePicker}>
                                    <TextInput
                                        style={styles.timeInput}
                                        value={tempSleepHour}
                                        onChangeText={(text) => {
                                            if (text === '') {
                                                setTempSleepHour('0');
                                            } else {
                                                const num = parseInt(text);
                                                if (!isNaN(num) && num >= 0 && num <= 23) {
                                                    setTempSleepHour(text);
                                                }
                                            }
                                        }}
                                        onBlur={() => {
                                            setTempSleepHour(tempSleepHour.padStart(2, '0'));
                                        }}
                                        keyboardType="number-pad"
                                        maxLength={2}
                                    />
                                    <Text style={styles.timeSeparator}>:</Text>
                                    <TextInput
                                        style={styles.timeInput}
                                        value={tempSleepMinute}
                                        onChangeText={(text) => {
                                            if (text === '') {
                                                setTempSleepMinute('0');
                                            } else {
                                                const num = parseInt(text);
                                                if (!isNaN(num) && num >= 0 && num <= 59) {
                                                    setTempSleepMinute(text);
                                                }
                                            }
                                        }}
                                        onBlur={() => {
                                            setTempSleepMinute(tempSleepMinute.padStart(2, '0'));
                                        }}
                                        keyboardType="number-pad"
                                        maxLength={2}
                                    />
                                </View>
                            </View>

                            {/* Wake Time Picker */}
                            <View style={styles.timePickerSection}>
                                <Text style={styles.timePickerLabel}>Hora de despertar ☀️</Text>
                                <View style={styles.timePicker}>
                                    <TextInput
                                        style={styles.timeInput}
                                        value={tempWakeHour}
                                        onChangeText={(text) => {
                                            if (text === '') {
                                                setTempWakeHour('0');
                                            } else {
                                                const num = parseInt(text);
                                                if (!isNaN(num) && num >= 0 && num <= 23) {
                                                    setTempWakeHour(text);
                                                }
                                            }
                                        }}
                                        onBlur={() => {
                                            setTempWakeHour(tempWakeHour.padStart(2, '0'));
                                        }}
                                        keyboardType="number-pad"
                                        maxLength={2}
                                    />
                                    <Text style={styles.timeSeparator}>:</Text>
                                    <TextInput
                                        style={styles.timeInput}
                                        value={tempWakeMinute}
                                        onChangeText={(text) => {
                                            if (text === '') {
                                                setTempWakeMinute('0');
                                            } else {
                                                const num = parseInt(text);
                                                if (!isNaN(num) && num >= 0 && num <= 59) {
                                                    setTempWakeMinute(text);
                                                }
                                            }
                                        }}
                                        onBlur={() => {
                                            setTempWakeMinute(tempWakeMinute.padStart(2, '0'));
                                        }}
                                        keyboardType="number-pad"
                                        maxLength={2}
                                    />
                                </View>
                            </View>

                            {/* Day Selection */}
                            <View style={styles.daySelectionSection}>
                                <Text style={styles.daySelectionLabel}>Repetir</Text>
                                <View style={styles.daysContainer}>
                                    {days.map((day, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={[
                                                styles.dayButton,
                                                selectedDays.includes(index) && styles.dayButtonSelected
                                            ]}
                                            onPress={() => toggleDay(index)}
                                        >
                                            <Text style={[
                                                styles.dayButtonText,
                                                selectedDays.includes(index) && styles.dayButtonTextSelected
                                            ]}>
                                                {day}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Save Button */}
                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={createAlarm}
                            >
                                <Text style={styles.saveButtonText}>Guardar Alarma</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </Modal>

            {/* Fixed Footer Navigation */}
            <FooterNav />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        ...(Platform.OS === 'web' ? { minHeight: '100vh' } : {}),
    },
    container: {
        flex: 1,
    },
    content: {
        padding: 20,
        paddingBottom: 180,
        paddingTop: Platform.OS === 'ios' ? 8 : 0,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
        marginBottom: 20,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E0E0E0',
    },
    toggleTrack: {
        width: 78,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#000',
        justifyContent: 'center',
        paddingHorizontal: 4,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
    },
    toggleOn: {
        backgroundColor: '#000',
    },
    toggleOff: {
        backgroundColor: '#E6E6E6',
    },
    toggleKnob: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    knobLeft: {
        alignSelf: 'flex-start',
    },
    knobRight: {
        alignSelf: 'flex-end',
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        color: '#000',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 24,
    },
    circularControlContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    circularControl: {
        width: 240,
        height: 240,
        borderRadius: 120,
        backgroundColor: '#889DAB',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 15,
        shadowOffset: { width: 0, height: 8 },
        elevation: 8,
    },
    circularControlInner: {
        width: 220,
        height: 220,
        borderRadius: 110,
        backgroundColor: '#A3B5C2',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    centerCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    controlIcon: {
        position: 'absolute',
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    controlIconLeft: {
        left: 20,
    },
    controlIconRight: {
        right: 20,
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 20,
        gap: 16,
    },
    timeBox: {
        flex: 1,
        alignItems: 'center',
    },
    timeLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 8,
    },
    timeValue: {
        fontSize: 32,
        fontWeight: '700',
        color: '#000',
    },
    setAlarmButton: {
        backgroundColor: '#000',
        borderRadius: 24,
        paddingVertical: 14,
        paddingHorizontal: 24,
        alignItems: 'center',
        marginVertical: 16,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    setAlarmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    messageBox: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        marginVertical: 16,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    messageTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
        marginBottom: 8,
    },
    messageText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    graphCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        marginVertical: 16,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    graphTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    graphSubtitle: {
        fontSize: 12,
        color: '#666',
        marginBottom: 20,
    },
    graphContainer: {
        height: 120,
        marginVertical: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
    },
    barGroup: {
        flex: 1,
        alignItems: 'center',
        gap: 4,
    },
    dayLabel: {
        fontSize: 10,
        fontWeight: '600',
        color: '#666',
        marginBottom: 4,
    },
    barsContainer: {
        width: 32,
        height: 80,
        position: 'relative',
        justifyContent: 'flex-end',
    },
    idealBar: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
    },
    currentBar: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        borderRadius: 4,
    },
    hoursLabel: {
        fontSize: 9,
        color: '#888',
        marginTop: 4,
    },
    legendContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 16,
        gap: 12,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 6,
    },
    legendText: {
        fontSize: 11,
        color: '#666',
    },
    ctaButton: {
        backgroundColor: '#000',
        borderRadius: 24,
        paddingVertical: 14,
        paddingHorizontal: 24,
        alignItems: 'center',
        marginVertical: 16,
        marginBottom: 32,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    ctaButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    // Alarms List Styles
    alarmsSection: {
        marginTop: 24,
        marginBottom: 32,
    },
    alarmsSectionTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#000',
        marginBottom: 16,
    },
    alarmCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    alarmCardLeft: {
        flex: 1,
    },
    alarmLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 8,
    },
    alarmTimesRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    alarmTimeInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    alarmTimeLabel: {
        fontSize: 12,
        color: '#666',
    },
    alarmTime: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    alarmDuration: {
        fontSize: 11,
        color: '#999',
        marginTop: 4,
    },
    alarmDays: {
        fontSize: 11,
        color: '#4CAF50',
        marginTop: 2,
        fontWeight: '600',
    },
    alarmCountdown: {
        fontSize: 12,
        color: '#FF9800',
        marginTop: 4,
        fontWeight: '600',
    },
    alarmCardRight: {
        flexDirection: 'column',
        gap: 12,
        alignItems: 'center',
    },
    deleteButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFEBEE',
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalScrollView: {
        maxHeight: '90%',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
    },
    inputSection: {
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        marginBottom: 8,
    },
    textInput: {
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#000',
    },
    timePickerSection: {
        marginBottom: 24,
    },
    timePickerLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        marginBottom: 12,
        textAlign: 'center',
    },
    timePicker: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    timeInput: {
        width: 80,
        height: 80,
        backgroundColor: '#F5F5F5',
        borderRadius: 16,
        fontSize: 36,
        fontWeight: '700',
        textAlign: 'center',
        color: '#000',
    },
    timeSeparator: {
        fontSize: 36,
        fontWeight: '700',
        color: '#000',
        marginHorizontal: 12,
    },
    daySelectionSection: {
        marginBottom: 24,
    },
    daySelectionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        marginBottom: 12,
    },
    daysContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    dayButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayButtonSelected: {
        backgroundColor: '#000',
    },
    dayButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    dayButtonTextSelected: {
        color: '#fff',
    },
    saveButton: {
        backgroundColor: '#000',
        borderRadius: 20,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
