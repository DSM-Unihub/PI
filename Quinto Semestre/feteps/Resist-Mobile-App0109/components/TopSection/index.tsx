import React from 'react';
import { View, Text, sheet, Image, ImageBackground, Dimensions } from 'react-native';
import { s } from './styles';

const { width } = Dimensions.get('window');

type Props = {
  height?: number;
};

export default function TopSection({ height = 300 }: Props) {
  return (
    <View style={[s.container, { height }]}>
      <ImageBackground
        source={require('@/assets/images/background.png')}
        style={s.backgroundImage}
        resizeMode="cover"
      />
      <Image
        source={require('@/assets/images/icon.png')}
        style={s.frontImage}
        resizeMode="contain"
      />
    </View>
  );
}
