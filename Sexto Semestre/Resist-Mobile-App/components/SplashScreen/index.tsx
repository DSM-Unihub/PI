import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import {s} from './style'

export default function SplashedScreen() {
  return (
    <View style={s.container}>
      {/* Você precisará substituir o source pela URL ou caminho local do seu ícone */}
      <Image
        source={require('@/assets/images/ResistIcon.png')}
        style={s.logo}
        contentFit="contain"
      />
      <Text style={s.text}>powered by resist</Text>
    </View>
  );
}