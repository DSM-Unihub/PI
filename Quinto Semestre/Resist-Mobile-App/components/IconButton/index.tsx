
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, Image, View } from 'react-native';
import { s } from './style';

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary';
}

export function IconButton({ title, variant = 'primary', style, ...props }: CustomButtonProps) {
  return (
    <TouchableOpacity 
      style={[
        s.button, 
        variant === 'primary' ? s.primaryButton : s.secondaryButton,
        style
      ]} 
      {...props}
    >
      <View style={s.iconContainer}><Image source={require('@/assets/images/pluswhite.png')} style={s.icon}/></View>
      <Text style={[
        s.buttonText,
        variant === 'primary' ? s.primaryText : s.secondaryText
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
