import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import CustomRadio from '@/components/CustomRadio';
import CustomText from '@/components/CustomText';
import InputText from '@/components/InputText';
import Header from '@/components/Header';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CustomButton } from '@/components/CustomButton';
import { CustomTextInput } from '@/components/CustomTextInput';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'bloqueado' | 'desbloqueado'>('bloqueado');
  const [url, setUrl] = useState('');
  const [foto, setFoto] = useState('');
  const [motivo, setMotivo] = useState('');

  const handleSendSuggestion = async () => {
    if (!url || !foto || !motivo) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    setIsLoading(true);

    try {
      const idUser = await AsyncStorage.getItem('userId');
      if (!idUser) {
        Alert.alert('Erro', 'Usuário não identificado.');
        setIsLoading(false);
        return;
      }

      const data = {
        idUser: idUser,
        dataHora: new Date().toISOString(),
        url: url,
        motivo: motivo,
        tipo: 'Pendente',
        situacao: status === 'bloqueado', // true se bloqueado, false se desbloqueado
        foto: foto,
      };

      await axios.post('http://seu-endpoint.com/sugestoes', data);

      Alert.alert('Sucesso', 'Sugestão enviada com sucesso!');
      setUrl('');
      setFoto('');
      setMotivo('');
      setStatus('bloqueado');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Falha ao enviar sugestão.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.generalcontainer}>
      <Header />
      <View style={styles.container}>
        <CustomText title="Nova Sugestão:" />
        <InputText hint="URL do site" value={url} onChangeText={setUrl} />

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

        <CustomText title="Possui alguma prova do ocorrido? Anexe aqui:" />
        <CustomTextInput
          style={styles.url}
          hint="URL da imagem"
          value={foto}
          onChangeText={setFoto}
          keyboardType="url"
        />

        {foto ? (
          <Image
            source={{ uri: foto }}
            style={styles.image}
            onError={() => console.error('Erro ao carregar a imagem')}
          />
        ) : null}

        <CustomButton
          style={styles.button}
          title={isLoading ? 'Enviando...' : 'Enviar'}
          onPress={handleSendSuggestion}
          disabled={isLoading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  generalcontainer: {
    flex: 1,
    backgroundColor: '#EBEFFB',
  },
  container: {
    backgroundColor: '#EBEFFB',
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
    height: 200,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    verticalAlign: 'top',
    textAlign: 'auto',
    fontSize: 14,
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
    marginTop: 10,
  },
  url: {
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    verticalAlign: 'top',
    textAlign: 'auto',
    fontSize: 14,
  },
});
