import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import API_BASE_URL from '../constants/api';
import { useAuth } from '../context/AuthContext';

export default function ChatScreen() {
    const { currentTheme } = useTheme();
    const navigation = useNavigation();
    const { user } = useAuth();
    const [messages, setMessages] = useState([
        { id: '0', text: '¡Hola! Soy Somat. ¿En qué puedo ayudarte hoy?', sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const flatListRef = useRef();

    const sendMessage = async () => {
        if (!input.trim()) return;
        const userMsg = { id: Date.now().toString(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await axios.post(`${API_BASE_URL}/chat/message`, {
                userId: user?.id || 1,
                message: userMsg.text
            });
            const botMsg = { id: (Date.now() + 1).toString(), text: res.data.response, sender: 'bot' };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            const errMsg = { id: (Date.now() + 1).toString(), text: 'Lo siento, hubo un error de conexión.', sender: 'bot' };
            setMessages(prev => [...prev, errMsg]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    const renderItem = ({ item }) => (
        <View style={[
            styles.bubble,
            item.sender === 'user' ? styles.userBubble : styles.botBubble,
            item.sender === 'bot' && { backgroundColor: currentTheme.cardBackground }
        ]}>
            <Text style={[
                styles.text,
                item.sender === 'user' ? styles.userText : { color: currentTheme.textPrimary }
            ]}>{item.text}</Text>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={currentTheme.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: currentTheme.textPrimary }]}>Somat</Text>
                <View style={{ width: 24 }} />
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderItem}
                keyExtractor={(item, index) => (item.id ? `${item.id}-${index}` : `${index}`)}
                contentContainerStyle={styles.list}
            />

            {loading && (
                <View style={styles.typing}>
                    <ActivityIndicator size="small" color={currentTheme.primary} />
                    <Text style={{ marginLeft: 8, color: currentTheme.textSecondary }}>Somat está escribiendo...</Text>
                </View>
            )}

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={10}>
                <View style={[styles.inputContainer, { backgroundColor: currentTheme.cardBackground }]}>
                    <TextInput
                        style={[styles.input, { color: currentTheme.textPrimary }]}
                        placeholder="Escribe un mensaje..."
                        placeholderTextColor={currentTheme.textSecondary}
                        value={input}
                        onChangeText={setInput}
                        onSubmitEditing={sendMessage}
                    />
                    <TouchableOpacity onPress={sendMessage} style={[styles.sendBtn, { backgroundColor: '#000' }]}>
                        <Ionicons name="send" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
    title: { fontSize: 18, fontWeight: '700' },
    list: { padding: 16, paddingBottom: 20 },
    bubble: { padding: 12, borderRadius: 16, maxWidth: '80%', marginBottom: 12 },
    userBubble: { alignSelf: 'flex-end', backgroundColor: '#000', borderBottomRightRadius: 4 },
    botBubble: { alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
    text: { fontSize: 16, lineHeight: 22 },
    userText: { color: '#fff' },
    inputContainer: { flexDirection: 'row', padding: 12, alignItems: 'center' },
    input: { flex: 1, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16 },
    sendBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
    typing: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 10 },
});
