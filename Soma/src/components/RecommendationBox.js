import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Linking } from 'react-native';

export default function RecommendationBox({ title, imageUrl, owner, url }) {
  const open = () => { if (url) Linking.openURL(url).catch(() => {}); };
  return (
    <View style={styles.card}> 
      {imageUrl ? <Image source={{ uri: imageUrl }} style={styles.cover} /> : <View style={styles.cover} />}
      <View style={{ flex:1 }}>
        <Text style={styles.title}>{title}</Text>
        {!!owner && <Text style={styles.owner}>{owner}</Text>}
        <TouchableOpacity style={styles.button} onPress={open}><Text style={styles.btnText}>Abrir en Spotify</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection:'row', alignItems:'center', backgroundColor:'#fff', borderRadius:14, padding:12, marginRight:10, width:280 },
  cover: { width:64, height:64, borderRadius:8, marginRight:12, backgroundColor:'#eee' },
  title: { fontSize:14, fontWeight:'700', color:'#1a1a1a' },
  owner: { fontSize:12, color:'#666', marginTop:4 },
  button: { marginTop:8, backgroundColor:'#1DB954', borderRadius:16, paddingVertical:6, paddingHorizontal:12, alignSelf:'flex-start' },
  btnText: { color:'#fff', fontWeight:'700' }
});
