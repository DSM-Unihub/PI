import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image } from 'react-native';
import CustomRadio from '@/components/CustomRadio';
import CustomText from '@/components/CustomText';
import InputText from '@/components/InputText';
import Header from '@/components/Header';
import DocumentPicker from 'react-native-document-picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CustomButton } from '@/components/CustomButton';
// import DocumentPicker from 'react-native-document-picker'; // Para React Native CLI

type RootStackParamList = {
  Login: undefined;
  List: undefined;
  Register: undefined;
  Form: undefined,
  Details: { suggestion: { url: string; situacao: boolean; motivo: string; foto: string } };
};

type DetailsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Details'>;
  route: { params: { suggestion: { url: string; situacao: boolean; motivo: string; foto: string } } };
};

export default function DetailsScreen({ navigation, route }: DetailsScreenProps) {
  const { suggestion } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'bloqueado' | 'desbloqueado'>(
    suggestion.situacao ? 'bloqueado' : 'desbloqueado'
  );

  console.log('URL da imagem:', suggestion.foto);

  // const handleFilePick = async () => {
  //     try {
  //         const result = await DocumentPicker.pick({
  //             type: '*/*', // Permite todos os tipos de arquivos
  //         });

  //         console.log('Arquivo selecionado:', result);
  //         // Aqui você pode armazenar o URI do arquivo em um estado, se necessário
  //     } catch (error) {
  //         console.error('Erro ao selecionar o arquivo:', error);
  //     }
  // };

  return (
    <View style={styles.generalcontainer}>
      <Header></Header>
      <View style={styles.container}>
        <CustomText title="Url sugerida:"/>
        <InputText hint="URL do site" value={suggestion.url} />


        <CustomText title="Você sugeriu que este site fosse:"/>
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

        <CustomText title="Motivo da solicitação:"/>
        <InputText
          style={styles.textArea}
          placeholder="Escreva aqui"
          multiline
          value={suggestion.motivo}
        />

        <CustomText title="Prova do ocorrido:"/>
        {suggestion.foto && (
          <Image
            source={{ uri: suggestion.foto }}
            style={styles.image}
            onError={() => console.error('Erro ao carregar a imagem')}
          />
        )}
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  generalcontainer: {
    flex: 1,
    backgroundColor: '#EBEFFB',
  },
  container: {
    backgroundColor: '#EBEFFB',
    paddingVertical: 10,
    paddingHorizontal: 18,
    flex:1
  },
  
  button:{
    bottom:'4%'
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  textArea: {
    height: 200,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    verticalAlign:'top',
    textAlign:'auto',
    fontSize:14
  },

  fileInput:{
    backgroundColor:'fff'
  },
  input: {
    height: 50,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 10,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});