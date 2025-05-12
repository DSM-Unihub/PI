import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import { CustomTextInput } from '@/components/CustomTextInput';
import { Title } from '@/components/Title';
import { CustomButton } from '@/components/CustomButton';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import TopSection from '@/components/TopSection';
import SwitchTabs from '@/components/switchTabs';
import AuthTabs from '@/components/AuthTabs';
import axios from 'axios';

type RootStackParamList = {
  Login: undefined;
  List: undefined;
  Register: undefined;
};

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

interface LoginData {
  email: string;
  senha: string;
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    senha: ''
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      email: '',
      senha: ''
    };
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

    setErrors(newErrors);
    return isValid;
  };

  const prepareLoginData = (): LoginData => {
    return {
      email: email.trim().toLowerCase(),
      senha: senha
    };
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {

      console.log('preparando data')
      const loginData = prepareLoginData();
      
      const response = await axios.post('http://192.168.0.109:4000/api/login', loginData);

      
      if (response.status==200) {
        const userId = response.data.user.id;
        console.log(userId)
        navigation.navigate('List', { userId });
      }
      //Ponto de melhoria: aqui seria bom fazer com que ele retornasse o porque não está logando. se for 401 Unauthorized, por algum motivo ele está pulando direto para o catch de erro, mesmo se você fizer um else if verificando essa possibilidade em response.status
      else {
        Alert.alert('Erro', response.data.message || 'Não foi possível fazer login. Tente novamente.');
 
        
      }
      
      console.log(response.status)
    } catch (error) {
      console.log(error)
      Alert.alert('Erro', 'Não foi possível fazer login. Tente novamente.');
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.topPart}>
      <TopSection />
      <View style={styles.container}>
        <Title>Bem vindo!</Title>
        <Text style={styles.footerText}>
          Insira seus dados para acessar a sua conta.
        </Text>
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

        <CustomButton
          title={isLoading ? "Entrando..." : "Login"}
          onPress={handleLogin}
          disabled={isLoading}
        />

        {/* <SwitchTabs
          active="login"
          onTabPress={(tab) => {
            if (tab === 'register') {
              navigation.navigate('Register');
            }
          }}
        /> */}

        {/* <AuthTabs/> */}

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
    fontSize: 20,
    marginBottom:50,
    fontWeight:'bold'
  },
  registerText: {
    color: '#0056FF',
    fontWeight:'bold',
  },
  errorText: {
    color: '#ff4444',
    marginTop: -15,
    marginBottom: 6,
    fontSize: 14,
  },
  loader: {
    marginTop: 15,
    marginBottom:20
  }
});