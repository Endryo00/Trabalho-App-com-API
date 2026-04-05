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
  Platform,
  Button
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
<<<<<<< HEAD
import { LinearGradient } from 'expo-linear-gradient';

// --- CONSTANTES MOVIDAS PARA FORA (OTIMIZAÇÃO DE MEMÓRIA) ---
const CLOUD_NAME = "dpcngtnv6"; 
const UPLOAD_PRESET = "ml_default";

const FILTERS = [
  { label: 'Sépia', value: 'e_sepia' },
  { label: 'P&B', value: 'e_grayscale' },
  { label: 'Cartoon', value: 'e_cartoonify' },
  { label: 'Vibrante', value: 'e_improve' },
  { label: 'Óleo', value: 'e_oil_paint:60' },
  { label: 'Pixel', value: 'e_pixelate:10' },
  { label: 'Nenhum', value: '' },
];

const ADJUSTMENTS = [
  { label: 'Brilhante', value: 'e_brightness:30' },
  { label: 'Contraste', value: 'e_contrast:40' },
  { label: 'Saturado', value: 'e_saturation:50' },
  { label: 'Vintage', value: 'e_vignette:40' },
  { label: 'Normal', value: '' },
];

const CROPS = [
  { label: 'Normal', value: 'c_limit' },
  { label: 'Quadrado', value: 'c_fill,h_500,w_500,g_auto' },
  { label: 'Rosto', value: 'c_thumb,g_face,w_400,h_400' },
  { label: 'Redondo', value: 'r_max,c_crop,g_center' },
];
=======
>>>>>>> ab0138c96779c0c86c3588eb8cc058093525e18c

export default function App() {
  const [loading, setLoading] = useState(false);
  const [localPhoto, setLocalPhoto] = useState(null); 
  const [photoData, setPhotoData] = useState(null); 
  
  // --- ESTADOS DE TRANSFORMAÇÃO ---
  const [filterType, setFilterType] = useState('e_sepia'); 
<<<<<<< HEAD
  const [adjustment, setAdjustment] = useState('');
=======
>>>>>>> ab0138c96779c0c86c3588eb8cc058093525e18c
  const [rotation, setRotation] = useState(0); 
  const [isFlippedH, setIsFlippedH] = useState(false);
  const [isFlippedV, setIsFlippedV] = useState(false);
  const [cropType, setCropType] = useState('c_limit'); 

<<<<<<< HEAD
  // --- OTIMIZAÇÃO: Função única para resetar edições ---
  const resetEdits = () => {
    setRotation(0);
    setIsFlippedH(false);
    setIsFlippedV(false);
    setFilterType('e_sepia');
    setAdjustment('');
    setCropType('c_limit');
  };
=======
  // --- CONFIGURAÇÕES DO SEU CLOUDINARY ---
  const CLOUD_NAME = "dpcngtnv6"; 
  const UPLOAD_PRESET = "ml_default";

  const filters = [
    { label: 'Sépia', value: 'e_sepia' },
    { label: 'P&B', value: 'e_grayscale' },
    { label: 'Cartoon', value: 'e_cartoonify' },
    { label: 'Vibrante', value: 'e_improve' },
    { label: 'Nenhum', value: '' },
  ];

  const crops = [
    { label: 'Normal', value: 'c_limit' },
    { label: 'Rosto (400x400)', value: 'c_thumb,g_face,w_400,h_400' },
    { label: 'Corte Central', value: 'c_crop,w_0.8,h_0.8,g_center' },
  ];
>>>>>>> ab0138c96779c0c86c3588eb8cc058093525e18c

  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Erro", "Precisamos de permissão para acessar suas fotos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false, 
      quality: 1,
    });

    if (!result.canceled) {
      setLocalPhoto(result.assets[0]);
      setPhotoData(null);
<<<<<<< HEAD
      resetEdits();
=======
      // Resetar opções ao escolher nova foto
      setRotation(0);
      setIsFlippedH(false);
      setIsFlippedV(false);
      setFilterType('e_sepia');
      setCropType('c_limit');
>>>>>>> ab0138c96779c0c86c3588eb8cc058093525e18c
    }
  };

  const uploadOriginal = async () => {
    setLoading(true);
    const data = new FormData();
    data.append('file', {
      uri: Platform.OS === 'android' ? localPhoto.uri : localPhoto.uri.replace('file://', ''),
      type: 'image/jpeg',
      name: 'upload.jpg',
    });
    data.append('upload_preset', UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: 'POST', body: data }
      );
      const result = await res.json();
      if (result.secure_url) {
        setPhotoData(result);
        setLocalPhoto(null);
      } else {
        throw new Error(result.error?.message || "Erro no Cloudinary");
      }
    } catch (error) {
      Alert.alert("Erro no Upload", error.message);
    } finally {
      setLoading(false);
    }
  };

  const shareTransformedImage = async () => {
    setLoading(true);
    try {
      const finalUrl = getFinalTransformedUrl(photoData.public_id);
<<<<<<< HEAD
      const fileUri = FileSystem.cacheDirectory + `foto_editada_${Date.now()}.jpg`;
=======
      // Criamos um caminho temporário para o arquivo
      const fileUri = FileSystem.cacheDirectory + `foto_editada_${Date.now()}.jpg`;

      // Faz o download usando a API legacy
>>>>>>> ab0138c96779c0c86c3588eb8cc058093525e18c
      const downloadResult = await FileSystem.downloadAsync(finalUrl, fileUri);

      if (downloadResult.status === 200) {
        await Sharing.shareAsync(downloadResult.uri);
      } else {
        throw new Error("Erro ao baixar imagem do servidor.");
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível processar a imagem: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getFinalTransformedUrl = (publicId) => {
    const transforms = [];
    if (cropType) transforms.push(cropType);
    if (filterType) transforms.push(filterType);
<<<<<<< HEAD
    if (adjustment) transforms.push(adjustment);
=======
>>>>>>> ab0138c96779c0c86c3588eb8cc058093525e18c
    if (rotation !== 0) transforms.push(`a_${rotation}`);
    if (isFlippedH) transforms.push('a_hflip');
    if (isFlippedV) transforms.push('a_vflip');

<<<<<<< HEAD
    transforms.push('f_auto', 'q_auto'); // Otimização via Cloudinary

=======
>>>>>>> ab0138c96779c0c86c3588eb8cc058093525e18c
    const transformString = transforms.filter(t => t !== '').join(',');
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformString}/${publicId}.jpg`;
  };

  return (
<<<<<<< HEAD
    <LinearGradient
      // Fundo topo mais claro (#9E9898) indo para o fundo escuro (#292929)
      colors={['#9E9898', '#292929']}
      style={styles.gradientContainer}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Filter Photo Pro Max Ultra Mega Blaster</Text>

        {/* TELA INICIAL */}
        {!localPhoto && !photoData && (
          <TouchableOpacity style={styles.button} onPress={selectImage}>
            <Text style={styles.buttonText}>[ SELECIONAR FOTO ]</Text>
          </TouchableOpacity>
        )}

        {/* MENU DE OPÇÕES (PÓS SELEÇÃO) */}
        {localPhoto && !loading && (
          <View style={styles.menuContainer}>
            <Text style={styles.label}>1. Efeito:</Text>
            <View style={styles.row}>
              {FILTERS.map(f => (
                <TouchableOpacity 
                  key={f.label} 
                  style={[styles.miniButton, filterType === f.value && styles.active]} 
                  onPress={() => setFilterType(f.value)}
                >
                  <Text style={[styles.miniText, filterType === f.value && styles.activeText]}>
                    {f.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>2. Ajustes de Cor:</Text>
            <View style={styles.row}>
              {ADJUSTMENTS.map(a => (
                <TouchableOpacity 
                  key={a.label} 
                  style={[styles.miniButton, adjustment === a.value && styles.active]} 
                  onPress={() => setAdjustment(a.value)}
                >
                  <Text style={[styles.miniText, adjustment === a.value && styles.activeText]}>
                    {a.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>3. Rotação e Flip:</Text>
            <View style={styles.row}>
              <TouchableOpacity style={styles.miniButton} onPress={() => setRotation((rotation + 90) % 360)}>
                <Text style={styles.miniText}>Girar {rotation}°</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.miniButton, isFlippedH && styles.active]} onPress={() => setIsFlippedH(!isFlippedH)}>
                <Text style={[styles.miniText, isFlippedH && styles.activeText]}>Flip H</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>4. Estilo de Corte:</Text>
            <View style={styles.row}>
              {CROPS.map(c => (
                <TouchableOpacity 
                  key={c.label} 
                  style={[styles.miniButton, cropType === c.value && styles.active]} 
                  onPress={() => setCropType(c.value)}
                >
                  <Text style={[styles.miniText, cropType === c.value && styles.activeText]}>
                    {c.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Image source={{ uri: localPhoto.uri }} style={styles.preview} />

            <TouchableOpacity style={styles.uploadButton} onPress={uploadOriginal}>
              <Text style={styles.buttonTextDark}>GERAR RESULTADO FINAL</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.cancelButton} onPress={() => setLocalPhoto(null)}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        )}

        {loading && <ActivityIndicator size="large" color="#39FF14" style={{marginTop: 50}} />}

        {/* RESULTADO FINAL */}
        {photoData && !loading && (
          <View style={styles.resultContainer}>
            <Text style={styles.label}>Imagem Transformada (Nuvem):</Text>
            <Image 
              source={{ uri: getFinalTransformedUrl(photoData.public_id) }} 
              style={styles.resultImage} 
            />
            <TouchableOpacity style={styles.button} onPress={shareTransformedImage}>
              <Text style={styles.buttonText}>SALVAR / COMPARTILHAR</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.cancelButton, {marginTop: 20}]} onPress={() => setPhotoData(null)}>
              <Text style={styles.cancelText}>Nova Foto</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

// --- ESTILOS VISUAIS NEON/CYBERPUNK ---
const NEON_GREEN = '#39FF14';

const styles = StyleSheet.create({
  gradientContainer: { 
    flex: 1 
  },
  scrollContent: { 
    flexGrow: 1, 
    alignItems: 'center', 
    padding: 20,
    paddingTop: 50, // Espaço extra pro Notch/Status Bar
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 30, 
    color: NEON_GREEN,
    textShadowColor: NEON_GREEN,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10, // Efeito de brilho
    letterSpacing: 2,
  },
  button: { 
    backgroundColor: 'rgba(57, 255, 20, 0.1)', // Fundo verde transparente
    padding: 18, 
    borderRadius: 8, 
    width: '100%', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: NEON_GREEN,
    shadowColor: NEON_GREEN,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  uploadButton: { 
    backgroundColor: NEON_GREEN, 
    padding: 18, 
    borderRadius: 8, 
    width: '100%', 
    alignItems: 'center', 
    marginBottom: 15,
    shadowColor: NEON_GREEN,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 10,
  },
  cancelButton: {
    padding: 15,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#ff4444',
    borderRadius: 8,
    backgroundColor: 'rgba(255, 68, 68, 0.1)'
  },
  cancelText: {
    color: '#ff4444',
    fontWeight: 'bold',
    textShadowColor: '#ff4444',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  buttonText: { 
    color: NEON_GREEN, 
    fontWeight: '900', 
    fontSize: 16,
    letterSpacing: 1,
    textShadowColor: NEON_GREEN,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  buttonTextDark: {
    color: '#1a1a1a', // Texto escuro no botão claro
    fontWeight: '900', 
    fontSize: 16,
    letterSpacing: 1,
  },
  menuContainer: { 
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)', // Fundo escuro semitransparente pro menu
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(57, 255, 20, 0.3)'
  },
  label: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginTop: 15, 
    marginBottom: 10, 
    color: NEON_GREEN,
    textShadowColor: NEON_GREEN,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3,
  },
  row: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    marginBottom: 5 
  },
  miniButton: { 
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1, 
    borderColor: NEON_GREEN, 
    borderRadius: 6, 
    marginRight: 8, 
    marginBottom: 8,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  active: { 
    backgroundColor: NEON_GREEN,
    shadowColor: NEON_GREEN,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  miniText: { 
    color: NEON_GREEN, 
    fontSize: 13, 
    fontWeight: 'bold' 
  },
  activeText: {
    color: '#1a1a1a', // Contraste com o fundo verde ativo
  },
  preview: { 
    width: '100%', 
    height: 250, 
    borderRadius: 8, 
    marginVertical: 20, 
    backgroundColor: '#111', 
    resizeMode: 'contain',
    borderWidth: 1,
    borderColor: NEON_GREEN
  },
  resultContainer: { 
    width: '100%', 
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: NEON_GREEN
  },
  resultImage: { 
    width: '100%', 
    height: 400, 
    borderRadius: 8, 
    marginBottom: 20, 
    backgroundColor: '#111', 
    resizeMode: 'contain',
    borderWidth: 2,
    borderColor: NEON_GREEN
  },
=======
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Filtro API Pro ✨</Text>

      {/* TELA INICIAL */}
      {!localPhoto && !photoData && (
        <TouchableOpacity style={styles.button} onPress={selectImage}>
          <Text style={styles.buttonText}>Selecionar Foto</Text>
        </TouchableOpacity>
      )}

      {/* MENU DE OPÇÕES (PÓS SELEÇÃO) */}
      {localPhoto && !loading && (
        <View style={styles.menuContainer}>
          <Text style={styles.label}>1. Efeito:</Text>
          <View style={styles.row}>
            {filters.map(f => (
              <TouchableOpacity 
                key={f.label} 
                style={[styles.miniButton, filterType === f.value && styles.active]} 
                onPress={() => setFilterType(f.value)}
              >
                <Text style={[styles.miniText, filterType === f.value && {color: '#fff'}]}>{f.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>2. Rotação e Flip:</Text>
          <View style={styles.row}>
            <TouchableOpacity style={styles.miniButton} onPress={() => setRotation((rotation + 90) % 360)}>
              <Text style={styles.miniText}>Girar {rotation}°</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.miniButton, isFlippedH && styles.active]} onPress={() => setIsFlippedH(!isFlippedH)}>
              <Text style={[styles.miniText, isFlippedH && {color: '#fff'}]}>Flip H</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>3. Estilo de Corte:</Text>
          <View style={styles.row}>
            {crops.map(c => (
              <TouchableOpacity 
                key={c.label} 
                style={[styles.miniButton, cropType === c.value && styles.active]} 
                onPress={() => setCropType(c.value)}
              >
                <Text style={[styles.miniText, cropType === c.value && {color: '#fff'}]}>{c.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Image source={{ uri: localPhoto.uri }} style={styles.preview} />

          <TouchableOpacity style={styles.uploadButton} onPress={uploadOriginal}>
            <Text style={styles.buttonText}>Gerar Resultado Final</Text>
          </TouchableOpacity>
          <Button title="Cancelar" color="red" onPress={() => setLocalPhoto(null)} />
        </View>
      )}

      {loading && <ActivityIndicator size="large" color="#6200ee" style={{marginTop: 50}} />}

      {/* RESULTADO FINAL */}
      {photoData && !loading && (
        <View style={styles.resultContainer}>
          <Text style={styles.label}>Imagem Transformada via Cloudinary:</Text>
          <Image 
            source={{ uri: getFinalTransformedUrl(photoData.public_id) }} 
            style={styles.resultImage} 
          />
          <TouchableOpacity style={styles.button} onPress={shareTransformedImage}>
            <Text style={styles.buttonText}>Salvar ou Compartilhar</Text>
          </TouchableOpacity>
          <View style={{marginTop: 20}}>
            <Button title="Nova Foto" color="#666" onPress={() => setPhotoData(null)} />
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', padding: 20, backgroundColor: '#f9f9f9' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 30, marginTop: 40, color: '#333' },
  button: { backgroundColor: '#6200ee', padding: 18, borderRadius: 12, width: '100%', alignItems: 'center' },
  uploadButton: { backgroundColor: '#2ecc71', padding: 18, borderRadius: 12, width: '100%', alignItems: 'center', marginBottom: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  menuContainer: { width: '100%' },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 15, marginBottom: 8, color: '#555' },
  row: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
  miniButton: { padding: 10, borderWidth: 1, borderColor: '#6200ee', borderRadius: 8, marginRight: 8, marginBottom: 8 },
  active: { backgroundColor: '#6200ee' },
  miniText: { color: '#6200ee', fontSize: 13, fontWeight: '600' },
  preview: { width: '100%', height: 250, borderRadius: 12, marginVertical: 15, backgroundColor: '#eee', resizeMode: 'contain' },
  resultContainer: { width: '100%', alignItems: 'center' },
  resultImage: { width: '100%', height: 400, borderRadius: 15, marginBottom: 20, backgroundColor: '#eee', resizeMode: 'contain' },
>>>>>>> ab0138c96779c0c86c3588eb8cc058093525e18c
});