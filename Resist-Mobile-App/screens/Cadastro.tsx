import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import { CustomTextInput } from '@/components/CustomTextInput';
import { Title } from '@/components/Title';
import TopSection from '@/components/TopSection';
import SwitchTabs from '@/components/switchTabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CustomButton } from '@/components/CustomButton';
import axios from 'axios';

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Register: undefined;
};

type RegisterScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Register'>;
};

interface RegisterData{
  
  nome: string,
  email: string,
  senha: string,
  confirmaSenha: string
  telefone: string,
  permissoes : string[]
}

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmaSenha: ''
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      nome: '',
      email: '',
      senha: '',
      confirmaSenha: ''
    };

    if (!nome) {
      newErrors.nome = 'Nome é obrigatório';
      isValid = false;
    }

    if (!email) {
      newErrors.email = 'Email é obrigatório';
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = 'Email inválido';
      isValid = false;
    }

    if (!senha) {
      newErrors.senha = 'Senha é obrigatória';
      isValid = false;
    } else if (senha.length < 6) {
      newErrors.senha = 'A senha deve ter pelo menos 6 caracteres';
      isValid = false;
    }

    else if (confirmaSenha !== senha) {
      newErrors.confirmaSenha = 'As senhas não coincidem';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const prepareRegisterData = (): RegisterData =>{
    return{
      nome:nome,
      email:email.trim().toLowerCase(),
      senha:senha,
      telefone:'00000000',
      permissoes: ["aluno"]
    }
  }

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {


      const RegisterData = prepareRegisterData()
      console.log('datapreparada')
      const response = await axios.post('http://192.168.0.109:4000/api/user', RegisterData)
      // Aqui você adicionaria a lógica de cadastro real.
      
      if(response.status==201){
        Alert.alert('Sucesso!', 'Cadastro realizado com sucesso.')

        setNome('')
        setEmail('')
        setEmail('')
        setSenha('')
        setConfirmaSenha('')
      }
      else {
        
        Alert.alert('Erro', response.data.message || 'Não foi possível fazer login. Tente novamente.');
        
        console.log(response.status)
        
      }} catch (error) {
        console.log(error)
      Alert.alert('Erro', 'Não foi possível realizar o cadastro.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.topPart}>
      <TopSection height={180} />

      <View style={styles.container}>
        <Title>Cadastro</Title>
        <Text style={styles.footerText}>
          Insira seus dados para realizar o cadastro em nossa plataforma. Por favor, informe seus dados:
        </Text>

        <CustomTextInput
          placeholder="Nome"
          value={nome}
          onChangeText={(text) => {
            setNome(text);
            setErrors(prev => ({ ...prev, nome: '' }));
          }}
        />
        {errors.nome ? <Text style={styles.errorText}>{errors.nome}</Text> : null}

        <CustomTextInput
          placeholder="E-mail"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setErrors(prev => ({ ...prev, email: '' }));
          }}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

        <CustomTextInput
          placeholder="Senha"
          value={senha}
          onChangeText={(text) => {
            setSenha(text);
            setErrors(prev => ({ ...prev, senha: '' }));
          }}
          isPassword
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />
        {errors.senha ? <Text style={styles.errorText}>{errors.senha}</Text> : null}

        <CustomTextInput
          placeholder="Confirme sua senha"
          value={confirmaSenha}
          onChangeText={(text) => {
            setConfirmaSenha(text);
            setErrors(prev => ({ ...prev, confirmaSenha: '' }));
          }}
          isPassword
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />
        {errors.confirmaSenha ? <Text style={styles.errorText}>{errors.confirmaSenha}</Text> : null}

        <CustomButton
          title={isLoading ? "Enviando..." : "Próximo"}
          onPress={handleRegister}
          disabled={isLoading}
        />

        {isLoading && (
          <ActivityIndicator
            size="large"
            color="#0056FF"
            style={styles.loader}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBEFFB',
    padding: 44,
  },
  topPart: {
    flex: 1,
    backgroundColor: '#EBEFFB',
    justifyContent: 'center',
  },
  footerText: {
    color: '#4A71E4',
    textAlign: 'left',
    fontSize: 16,
    marginBottom: 30,
    fontWeight: '500'
  },
  errorText: {
    color: '#ff4444',
    marginTop: -10,
    marginBottom: 15,
    fontSize: 14,
  },
  loader: {
    marginTop: 15,
  },
  topSection:{
    height:10,
  }
});
