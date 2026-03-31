import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
  Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [photoData, setPhotoData] = useState(null);

  // --- CONFIGURAÇÕES DO SEU CLOUDINARY ---
  const CLOUD_NAME = "dpcngtnv6"; 
  const UPLOAD_PRESET = "ml_default";

  const selectImage = async () => {
    // Solicita permissão de mídia
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert("Erro", "Precisamos de permissão para acessar suas fotos!");
      return;
    }

    // Abre a galeria
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      uploadToCloudinary(result.assets[0]);
    }
  };

  const uploadToCloudinary = async (file) => {
    setLoading(true);
    
    const data = new FormData();
    // No Expo, o objeto 'file' tem 'uri'. Ajustamos para o FormData:
    data.append('file', {
      uri: Platform.OS === 'android' ? file.uri : file.uri.replace('file://', ''),
      type: 'image/jpeg', // Tipo genérico para imagens
      name: 'upload.jpg',
    });
    data.append('upload_preset', UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: data,
          // IMPORTANTE: Não definir Content-Type manual aqui!
        }
      );
      
      const result = await res.json();
      
      if (result.secure_url) {
        setPhotoData(result);
      } else {
        throw new Error(result.error?.message || "Erro desconhecido");
      }
    } catch (error) {
      Alert.alert("Erro no Upload", error.message);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredUrl = (publicId) => {
    // Retorna a URL com o filtro sépia (e_sepia)
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/e_sepia/${publicId}.jpg`;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Filtro API Demo ✨</Text>

      <TouchableOpacity 
        style={[styles.button, loading && { backgroundColor: '#999' }]} 
        onPress={selectImage}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Processando..." : "Selecionar Foto"}
        </Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#6200ee" style={{marginTop: 20}} />}

      {photoData && !loading && (
        <View style={styles.resultContainer}>
          <Text style={styles.label}>Original:</Text>
          <Image source={{ uri: photoData.secure_url }} style={styles.preview} />

          <Text style={styles.label}>Com Filtro (Sépia):</Text>
          <Image 
            source={{ uri: getFilteredUrl(photoData.public_id) }} 
            style={styles.preview} 
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, marginTop: 40, color: '#333' },
  button: { backgroundColor: '#6200ee', padding: 18, borderRadius: 12, width: '100%', alignItems: 'center', elevation: 3 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  resultContainer: { marginTop: 30, width: '100%', alignItems: 'center' },
  label: { fontSize: 16, marginVertical: 10, fontWeight: 'bold', color: '#555' },
  preview: { width: 300, height: 300, borderRadius: 15, marginBottom: 20, backgroundColor: '#ddd' },
});