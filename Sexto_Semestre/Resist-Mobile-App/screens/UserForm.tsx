import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import {ipurl} from '@/services/url'
import { View, Text, StyleSheet, Image, Alert, ScrollView, Pressable, Modal } from 'react-native';
import CustomRadio from '@/components/CustomRadio';
import CustomText from '@/components/CustomText';
import InputText from '@/components/InputText';
import Header from '@/components/Header';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CustomButton } from '@/components/CustomButton';
import { CustomTextInput } from '@/components/CustomTextInput';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { launchImageLibrary } from 'react-native-image-picker';
import { PermissionsAndroid, Platform } from 'react-native';
import Colors from '@/constants/Colors';
import { IconButton } from '@/components/IconButton';
import { getUser } from '@/services/auth';

  
type RootStackParamList = {
  Login: undefined;
  List: { userId: string };
  Register: undefined;
  Form: undefined;
  Details: { suggestion: { url: string; situacao: boolean; motivo: string; foto: string } };
};

type UserFormScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Form'>;
};

type FraseItem = {
  texto: string;
  ofensiva: boolean;
};

export default function UserForm({ navigation }: UserFormScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLookupLoading, setIsLookupLoading] = useState(false);
  const [status, setStatus] = useState<'bloqueado' | 'desbloqueado'>('bloqueado');
  const [url, setUrl] = useState('');
  const [foto, setFoto] = useState<string | null>(null);
  const [motivo, setMotivo] = useState('');
  const [userLevel, setUserLevel] = useState<number>(0);
  const [existingIndexacaoId, setExistingIndexacaoId] = useState<string | null>(null);
  const [existingFrases, setExistingFrases] = useState<FraseItem[]>([]);
  const [selectedFrasesMap, setSelectedFrasesMap] = useState<Record<string, boolean>>({});
  const [manualFraseDraft, setManualFraseDraft] = useState('');
  const [manualFrases, setManualFrases] = useState<FraseItem[]>([]);
  const route = useRoute();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [imageInfo, setImageInfo] = useState<{name: string, type: string} | null>(null);

  const { userId } = route.params as { userId: string };


  
  // Pegando o parâmetro 'scannedUrl' passado via navegação
  const scannedUrl = (route.params as any)?.scannedUrl;

  useEffect(()=>{
    if (scannedUrl){
      setUrl(scannedUrl);
    }
  }, [scannedUrl])

  useEffect(() => {
    async function loadUserLevel() {
      const user = await getUser();
      setUserLevel(Number(user?.permissoes ?? 0));
    }
    loadUserLevel();
  }, []);

  const normalizeFrases = (rawFrases: any[]): FraseItem[] => {
    if (!Array.isArray(rawFrases)) return [];
    return rawFrases
      .map((item): FraseItem | null => {
        if (typeof item === 'string') {
          const texto = item.trim();
          return texto ? { texto, ofensiva: true } : null;
        }
        if (item && typeof item === 'object') {
          const texto = String(item.texto || '').trim();
          if (!texto) return null;
          return { texto, ofensiva: item.ofensiva !== undefined ? Boolean(item.ofensiva) : true };
        }
        return null;
      })
      .filter((item): item is FraseItem => !!item);
  };

  const loadIndexacaoByUrl = async (currentUrl: string) => {
    const trimmedUrl = currentUrl.trim();
    if (!trimmedUrl) {
      setExistingIndexacaoId(null);
      setExistingFrases([]);
      setSelectedFrasesMap({});
      setManualFrases([]);
      return;
    }
    try {
      setIsLookupLoading(true);
      const token = await AsyncStorage.getItem('@resist_token');
      const headers: any = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await axios.get(`${ipurl}/bloqueios/lookup`, {
        params: { url: trimmedUrl },
        headers,
      });

      const data = response.data?.data;
      if (!data) {
        setExistingIndexacaoId(null);
        setExistingFrases([]);
        setSelectedFrasesMap({});
        return;
      }

      const frases = normalizeFrases(data.frases || []);

      setExistingIndexacaoId(data._id || null);
      setExistingFrases(frases);
      setSelectedFrasesMap(
        frases.reduce((acc: Record<string, boolean>, frase: FraseItem) => {
          acc[frase.texto] = true;
          return acc;
        }, {})
      );
    } catch (error) {
      setExistingIndexacaoId(null);
      setExistingFrases([]);
      setSelectedFrasesMap({});
      setManualFrases([]);
    } finally {
      setIsLookupLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadIndexacaoByUrl(url);
    }, 600);
    return () => clearTimeout(timer);
  }, [url]);

  const toggleFraseSelection = (frase: string) => {
    setSelectedFrasesMap((prev) => ({
      ...prev,
      [frase]: !prev[frase],
    }));
  };

  const addManualFrase = () => {
    const texto = manualFraseDraft.trim();
    if (!texto) return;
    if (manualFrases.some((item) => item.texto.toLowerCase() === texto.toLowerCase())) {
      setManualFraseDraft('');
      return;
    }
    setManualFrases((prev) => [...prev, { texto, ofensiva: true }]);
    setManualFraseDraft('');
  };

  const toggleManualFrase = (texto: string) => {
    setManualFrases((prev) =>
      prev.map((item) => (item.texto === texto ? { ...item, ofensiva: !item.ofensiva } : item))
    );
  };

  const removeManualFrase = (texto: string) => {
    setManualFrases((prev) => prev.filter((item) => item.texto !== texto));
  };

  
  const handleSendSuggestion = async () => {
    // if (!url || !motivo) {
     if (!url) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }
    // if (!foto) {
      // Alert.alert('Erro', 'Selecione uma imagem.');
      // return;
    // }
    setIsLoading(true);

    try {
      if (!userId) {
        Alert.alert('Erro', 'Usuário não identificado.');
        setIsLoading(false);
        return;
      }

      const data: {
        idUser: string;
        dataHora: string;
        url: string;
        motivo: string;
        tipo: boolean;
        situacao: string;
        frases: string[];
      } = {
        idUser: userId,
        dataHora: new Date().toISOString(),
        url: url,
        motivo: motivo,
        tipo: status === 'bloqueado',
        situacao: 'Pendente',
        frases: [],
      };

      const frasesSelecionadas = existingFrases.filter((frase) => selectedFrasesMap[frase.texto]);
      const draftTexto = manualFraseDraft.trim();
      const manualFrasesPayload = draftTexto
        ? [...manualFrases, { texto: draftTexto, ofensiva: true }]
        : manualFrases;
      const isAdminFlow = userLevel >= 1;
      const hasExistingIndexacao = Boolean(existingIndexacaoId);
      const isBlockingRequest = status === 'bloqueado';

      if (!isBlockingRequest && !hasExistingIndexacao && manualFrasesPayload.length === 0) {
        Alert.alert('Erro', 'Informe ao menos uma frase para desbloqueio (pressione Enter para adicionar).');
        setIsLoading(false);
        return;
      }

      if (isAdminFlow) {
        const token = await AsyncStorage.getItem('@resist_token');
        if (!token) {
          Alert.alert('Erro', 'Token inválido. Faça login novamente.');
          setIsLoading(false);
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        if (hasExistingIndexacao) {
          if (!isBlockingRequest && frasesSelecionadas.length === 0) {
            Alert.alert('Erro', 'Selecione ao menos uma frase.');
            setIsLoading(false);
            return;
          }

          if (isBlockingRequest) {
            await axios.put(
              `${ipurl}/bloqueios/${existingIndexacaoId}`,
              {
                url: url,
                motivo: motivo || 'Atualizado via app',
                flag: true,
                bloqueioTotal: true,
              },
              { headers }
            );
          } else {
            const frasesAtualizadas = existingFrases.map((frase) => {
              if (!selectedFrasesMap[frase.texto]) return frase;
              return {
                ...frase,
                ofensiva: false,
              };
            });

            const flagBlocked = frasesAtualizadas.some((frase) => frase.ofensiva);
            await axios.put(
              `${ipurl}/bloqueios/${existingIndexacaoId}`,
              {
                url: url,
                motivo: motivo || 'Atualizado via app',
                frases: frasesAtualizadas,
                flag: flagBlocked,
                bloqueioTotal: true,
              },
              { headers }
            );
          }
        } else {
          const flagBlocked = isBlockingRequest;
          await axios.post(
            `${ipurl}/bloqueios`,
            {
              url: url,
              urlWeb: url,
              motivo: motivo || 'Criado via app',
              ...(isBlockingRequest
                ? {}
                : {
                    frases: manualFrasesPayload.map((frase) => ({
                      texto: frase.texto,
                      ofensiva: false,
                    })),v 
                  }),
              flag: flagBlocked,
              tipoInsercao: 'Manual',
              bloqueioTotal: true,
            },
            { headers }
          );
        }

        Alert.alert('Sucesso', 'Bloqueio atualizado com sucesso!');
        setUrl('');
        setFoto('');
        setMotivo('');
        setManualFraseDraft('');
        setManualFrases([]);
        setStatus('bloqueado');
        setExistingIndexacaoId(null);
        setExistingFrases([]);
        setSelectedFrasesMap({});
        navigation.navigate('List', {userId} );
        return;
      }

      if (!isBlockingRequest && hasExistingIndexacao) {
        if (frasesSelecionadas.length === 0) {
          Alert.alert('Erro', 'Selecione ao menos uma frase.');
          setIsLoading(false);
          return;
        }
        data.frases = frasesSelecionadas.map((frase) => frase.texto);
      } else if (!isBlockingRequest && !hasExistingIndexacao) {
        data.frases = manualFrasesPayload.map((frase) => frase.texto);
      }

      const formData = new FormData();
      formData.append('dados', JSON.stringify(data));

      // Align with working test app: append image URI directly as an object for Axios in React Native
      if (foto){
      formData.append('foto', {
        uri: foto,
        name: imageInfo?.name || `photo_${Date.now()}.jpg`,
        type: imageInfo?.type || 'image/jpeg',
      } as any);}

      //console.log("FORMDATA ",formData)

      // Remove custom boundary logic, let Axios handle multipart/form-data header
      // const boundary = `----ReactNativeFormBoundary${Math.random().toString(36).substring(2)}`;

      //console.log("Axios POST to URL:", `${ipurl}/sugestao`);
      // //console.log("Axios POST Headers (explicit):", { 'Content-Type': `multipart/form-data; boundary=${boundary}` }); // Removed

      // --- DEBUG: Test GET /sugestao endpoint --- //
      try {
        //console.log("Attempting Axios GET to URL:", `${ipurl}/sugestao`);
        const getResponse = await axios.get(`${ipurl}/sugestao`, {
          timeout: 10000, // Shorter timeout for GET test
        });
        //console.log("Axios GET Success! Status:", getResponse.status, "Data length:", getResponse.data.length);
      } catch (getError: any) {
        console.error("Axios GET Error:", getError.message);
        if (getError.response) {
          console.error("Axios GET Response Error:", getError.response.data);
          console.error("Axios GET Response Status:", getError.response.status);
        } else if (getError.request) {
          console.error("Axios GET Request Error (No Response):", getError);
        }
      }
      // --- END DEBUG --- //

      const token = await AsyncStorage.getItem('@resist_token');
      const headers: any = {
        'Content-Type': 'multipart/form-data',
      };

      if (token) headers.Authorization = `Bearer ${token}`

      await axios.post(`${ipurl}/sugestao`, formData, {
        headers,
        timeout: 30000, // Add a timeout of 30 seconds
      });

      Alert.alert('Sucesso', 'Sugestão enviada com sucesso!');
      setUrl('');
      setFoto('');
      setMotivo('');
      setManualFraseDraft('');
      setManualFrases([]);
      setStatus('bloqueado');
      navigation.navigate('List', {userId} );
    } catch (error: any) { // Cast error to any for easier debugging here
      console.error("Axios POST Error:", error.message);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Axios Response Error:", error.response.data, );
        console.error("Axios Response Status:", error.response.status);
        console.error("Axios Response Headers:", error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.error("Axios Request Error (No Response):");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Axios Setup Error:", error.message);
      }
      Alert.alert('Erro', 'Falha ao enviar sugestão. Verifique a conexão e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

    const requestPermission = async () => {
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        // Android 13+ requires READ_MEDIA_IMAGES
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          {
            title: 'Permissão de acesso à galeria',
            message: 'O app precisa acessar sua galeria para selecionar imagens.',
            buttonNeutral: 'Perguntar depois',
            buttonNegative: 'Cancelar',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true;
    };

    const handleSelectImage = async () => {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'O app precisa de acesso à galeria para selecionar imagens.');
        return;
      }

      // Open image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        const selectedImage = result.assets[0];
        setFoto(selectedImage.uri);
        setImageInfo({ name: selectedImage.fileName || `photo_${Date.now()}.jpg`, type: selectedImage.mimeType || 'image/jpeg' });
        //console.log('Selected image:', selectedImage.uri);
      }
    };
  return (
    <View style={styles.generalcontainer}>
      <Header />

      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
        <CustomText title="Nova Sugestão:" />
        <CustomTextInput placeholder='URL do site' value={url} onChangeText={setUrl} style={styles.input}/>
        {isLookupLoading ? (
          <Text style={styles.helperText}>Verificando indexação existente...</Text>
        ) : (
          <Text style={styles.helperText}>
            {existingIndexacaoId ? 'Indexação encontrada para esta URL.' : 'Nenhuma indexação encontrada para esta URL.'}
          </Text>
        )}
        <CustomText title="Eu gostaria que esse site fosse:" />
        <View style={styles.checkboxContainer}>
          <View style={styles.radioGroup}>
            <CustomRadio
              label="Bloqueado"
              selected={status === 'bloqueado'}
              onPress={() => setStatus('bloqueado')}
            />
            <CustomRadio
              label="Desbloqueado"
              selected={status === 'desbloqueado'}
              onPress={() => setStatus('desbloqueado')}
            />
          </View>
        </View>

        <CustomText title="Qual o motivo da solicitação?" />
        <CustomTextInput
          style={styles.textArea}
          placeholder="Escreva aqui"
          multiline
          value={motivo}
          onChangeText={setMotivo}
        />

        {status === 'desbloqueado' && existingIndexacaoId && (
          <View style={styles.frasesSection}>
            <CustomText title="Selecione as frases para desbloquear:" />
            {existingFrases.length === 0 ? (
              <Text style={styles.helperText}>Esta indexação não possui frases cadastradas.</Text>
            ) : (
              existingFrases.map((frase) => (
                <Pressable key={frase.texto} style={styles.fraseItem} onPress={() => toggleFraseSelection(frase.texto)}>
                  <View style={[styles.checkbox, selectedFrasesMap[frase.texto] && styles.checkboxSelected]}>
                    {selectedFrasesMap[frase.texto] && <Text style={styles.checkboxMark}>✓</Text>}
                  </View>
                  <Text style={styles.fraseText}>{frase.texto}</Text>
                  <Text style={frase.ofensiva ? styles.tagOfensiva : styles.tagExcecao}>
                    {frase.ofensiva ? 'Ofensiva' : 'Excecao'}
                  </Text>
                </Pressable>
              ))
            )}
          </View>
        )}

        {status === 'desbloqueado' && !existingIndexacaoId && (
          <View style={styles.frasesSection}>
            <CustomText title="Frases para desbloquear (digite e pressione Enter para adicionar):" />
            <CustomTextInput
              style={styles.sentencesArea}
              placeholder="Digite uma frase e pressione Enter"
              value={manualFraseDraft}
              onChangeText={setManualFraseDraft}
              returnKeyType="done"
              onSubmitEditing={addManualFrase}
            />
            {manualFrases.map((frase) => (
              <View key={frase.texto} style={styles.fraseItem}>
                <Pressable onPress={() => toggleManualFrase(frase.texto)} style={[styles.checkbox, frase.ofensiva && styles.checkboxSelected]}>
                  {frase.ofensiva && <Text style={styles.checkboxMark}>✓</Text>}
                </Pressable>
                <Text style={styles.fraseText}>{frase.texto}</Text>
                <Pressable onPress={() => removeManualFrase(frase.texto)} style={styles.removePill}>
                  <Text style={styles.removePillText}>x</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}

        <CustomText title="Possui alguma prova do ocorrido? Anexe aqui:" />

        <IconButton
          style={styles.button}
          title= {
            foto 
            ? (()=>{
              const nomeArquivo = foto.slice(foto.lastIndexOf('/') + 1);
              const maxLength = 15;
              if (nomeArquivo.length > maxLength) {
                const inicio = nomeArquivo.slice(0, 7);
                const fim = nomeArquivo.slice(-7);
                return `${inicio}...${fim}`;
              }
              return nomeArquivo;
            })()
            : 'Selecionar Imagem'}
          onPress={handleSelectImage}
        />

        <CustomText style={{fontSize:wp('3.2s%'), marginTop:hp('-2.6%'), marginBottom:hp('0%')}} title="Formatos suportados: PNG, JPG, JPEG, PDF." />
        <CustomText style={{fontSize:wp('3.2s%'), marginTop:hp('-1.8%'), marginBottom:hp('0%')}} title="Máximo de 10Mb." />

        {foto ? (
          <Pressable onPress={() => setIsModalVisible(true)}>
            <Image source={{ uri: foto }} style={styles.image} />
          </Pressable>
        ) : null}

          
        <Modal visible={isModalVisible} transparent onRequestClose={() => setIsModalVisible(false)}>
          <Pressable onPress={() => setIsModalVisible(false)} style={styles.modalBackground}>
            {foto && <Image source={{ uri: foto }} style={styles.fullImage} />}
          </Pressable>

        </Modal>

        <CustomButton
          style={styles.button}
          title={isLoading ? 'Enviando...' : 'Enviar'}
          onPress={handleSendSuggestion}
          disabled={isLoading}
        />
        </ScrollView>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  generalcontainer: {
    flex: 1,
    backgroundColor: '#DCE5FE',
  },
  container: {
    backgroundColor: '#DCE5FE',
    paddingVertical: 10,
    paddingHorizontal: 18,
    flex: 1,
  },
  button: {
    bottom: '4%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  textArea: {
    height: hp('20%'),
    borderRadius: 20,
    verticalAlign: 'top',
    textAlign: 'auto',
  },
  radioGroup:{
    flexDirection: 'column',
  },
  input: {
    paddingVertical: hp('1.6%'),
  },
  helperText: {
    color: '#4D63A1',
    fontSize: 13,
    marginTop: 6,
    marginBottom: 10,
  },
  frasesSection: {
    marginBottom: 12,
  },
  fraseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
    backgroundColor: '#F2F5FF',
    borderRadius: 10,
    padding: 10,
  },
  fraseText: {
    flex: 1,
    color: '#2B438D',
    fontSize: 13,
  },
  tagOfensiva: {
    color: '#C62828',
    fontSize: 11,
    fontWeight: '700',
  },
  tagExcecao: {
    color: '#2E7D32',
    fontSize: 11,
    fontWeight: '700',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderColor: '#4D63A1',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  checkboxSelected: {
    backgroundColor: '#4D63A1',
  },
  checkboxMark: {
    color: '#fff',
    fontWeight: 'bold',
  },
  removePill: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFE5E5',
  },
  removePillText: {
    color: '#B71C1C',
    fontWeight: 'bold',
  },
  sentencesArea: {
    minHeight: hp('14%'),
    borderRadius: 20,
    verticalAlign: 'top',
    textAlign: 'auto',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginTop: 10,
    alignSelf:'center'
  },
  url: {
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    verticalAlign: 'top',
    textAlign: 'auto',
    fontSize: 14,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  modalBackground: {
  flex: 1,
  
  backgroundColor: 'rgba(0,0,0,0.3)',
  margin: 20,
  justifyContent: 'center',
  alignItems: 'center',
  },
  fullImage: {
    width: '90%',
    height: '100%',
    resizeMode: 'contain',
  },
});
