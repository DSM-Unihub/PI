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

  
type RootStackParamList = {
  Login: undefined;
  List: undefined;
  Register: undefined;
  Form: undefined;
  Details: { suggestion: { url: string; situacao: boolean; motivo: string; foto: string } };
};

type UserFormScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Form'>;
};

export default function UserForm({ navigation }: UserFormScreenProps) {
  
  
  const route = useRoute();
  
  // Pegando o parâmetro 'scannedUrl' passado via navegação
  const scannedUrl = (route.params as any)?.scannedUrl;
  const fromScanner = !!scannedUrl;
  const [isLoading, setIsLoading] = useState(false);
  
  const [status, setStatus] = useState<'bloqueado' | 'desbloqueado'>('bloqueado');
  
  
  const [url, setUrl] = useState('');
  const [foto, setFoto] = useState<string | null>(null);
  const [motivo, setMotivo] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [imageInfo, setImageInfo] = useState<{name: string, type: string} | null>(null);

  const { userId } = route.params as { userId: string };


  
  useEffect(()=>{
    if (scannedUrl){
      setUrl(scannedUrl);
      setStatus('desbloqueado');
    }
  }, [scannedUrl])

  
  const handleSendSuggestion = async () => {
    // if (!url || !motivo) {
    if (!url) {
      Alert.alert('Erro', 'Preencha a url.');
      return;
    }
    // if (!foto) {
    //   Alert.alert('Erro', 'Selecione uma imagem.');
    //   return;
    // }
    setIsLoading(true);

    try {
      if (!userId) {
        Alert.alert('Erro', 'Usuário não identificado.');
        setIsLoading(false);
        return;
      }

      const data = {
        idUser: userId,
        dataHora: new Date().toISOString(),
        url: url,
        motivo: motivo,
        tipo: status === 'bloqueado',
        situacao: 'Pendente',
      };

      const formData = new FormData();
      formData.append('dados', JSON.stringify(data));

      // Align with working test app: append image URI directly as an object for Axios in React Native
       if (foto) {
        formData.append('foto', {
          uri: foto,
          name: imageInfo?.name || `photo_${Date.now()}.jpg`,
          type: imageInfo?.type || 'image/jpeg',
        } as any);
      }

      console.log("FORMDATA ",formData)

      // Remove custom boundary logic, let Axios handle multipart/form-data header
      // const boundary = `----ReactNativeFormBoundary${Math.random().toString(36).substring(2)}`;

      console.log("Axios POST to URL:", `${ipurl}/sugestao`);
      // console.log("Axios POST Headers (explicit):", { 'Content-Type': `multipart/form-data; boundary=${boundary}` }); // Removed

      // --- DEBUG: Test GET /sugestao endpoint --- //
      try {
        console.log("Attempting Axios GET to URL:", `${ipurl}/sugestao`);
        const getResponse = await axios.get(`${ipurl}/sugestao`, {
          timeout: 10000, // Shorter timeout for GET test
        });
        console.log("Axios GET Success! Status:", getResponse.status, "Data length:", getResponse.data.length);
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
      setFoto(null);
      setMotivo('');
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
        console.log('Selected image:', selectedImage.uri);
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
        <CustomText title="Eu gostaria que esse site fosse:" />
        <View style={styles.checkboxContainer}>
          <View style={styles.radioGroup}>
            
            {!fromScanner && (
            <CustomRadio
              label="Bloqueado"
              selected={status === 'bloqueado'}
              onPress={() => setStatus('bloqueado')}
            />
            )}
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
