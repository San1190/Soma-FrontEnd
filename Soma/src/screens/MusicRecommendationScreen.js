import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import API_BASE_URL from '../constants/api';
import { useTheme } from '../context/ThemeContext';

export default function MusicRecommendationScreen() {
    const { currentTheme } = useTheme();
    const navigation = useNavigation();
    const route = useRoute();
    const { mood } = route.params || { mood: 'calm' };
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMusic = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/music/suggestions`, { params: { mood } });
                setPlaylists(res.data);
            } catch (error) {
                console.log('Error fetching music:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMusic();
    }, [mood]);

    const openLink = (url) => {
        if (url) Linking.openURL(url).catch(() => { });
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={[styles.card, { backgroundColor: currentTheme.cardBackground }]} onPress={() => openLink(item.url)}>
            <Image source={{ uri: item.imageUrl }} style={styles.cover} />
            <View style={styles.info}>
                <Text style={[styles.name, { color: currentTheme.textPrimary }]} numberOfLines={1}>{item.name}</Text>
                <Text style={[styles.owner, { color: currentTheme.textSecondary }]}>by {item.owner}</Text>
                <Text style={[styles.desc, { color: currentTheme.textSecondary }]} numberOfLines={2}>{item.description}</Text>
                <View style={styles.providerBadge}>
                    <Ionicons name="musical-notes" size={12} color="#fff" />
                    <Text style={styles.providerText}>Spotify</Text>
                </View>
            </View>
            <Ionicons name="play-circle" size={32} color="#1DB954" style={styles.playIcon} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={currentTheme.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: currentTheme.textPrimary }]}>Música para tu estado</Text>
            </View>
            <Text style={[styles.subtitle, { color: currentTheme.textSecondary }]}>
                Recomendaciones basadas en: <Text style={{ fontWeight: '700', textTransform: 'capitalize' }}>{mood}</Text>
            </Text>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={currentTheme.primary} />
                </View>
            ) : (
                <FlatList
                    data={playlists}
                    keyExtractor={(item, index) => (item.id ? `${item.id}-${index}` : `${index}`)}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20, color: currentTheme.textSecondary }}>No se encontraron playlists.</Text>}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', padding: 16 },
    backBtn: { marginRight: 16 },
    title: { fontSize: 20, fontWeight: '700' },
    subtitle: { paddingHorizontal: 16, marginBottom: 16, fontSize: 14 },
    list: { padding: 16 },
    card: { flexDirection: 'row', borderRadius: 12, marginBottom: 16, padding: 10, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
    cover: { width: 80, height: 80, borderRadius: 8 },
    info: { flex: 1, marginLeft: 12, justifyContent: 'center' },
    name: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
    owner: { fontSize: 12, marginBottom: 4 },
    desc: { fontSize: 12, opacity: 0.8 },
    providerBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1DB954', alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginTop: 6 },
    providerText: { color: '#fff', fontSize: 10, fontWeight: '700', marginLeft: 4 },
    playIcon: { marginLeft: 12 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
