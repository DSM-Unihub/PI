
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';
import { s } from './style';

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary';
}

export function CustomButton({ title, variant = 'primary', style, ...props }: CustomButtonProps) {
  return (
    <TouchableOpacity 
      style={[
        s.button, 
        variant === 'primary' ? s.primaryButton : s.secondaryButton,
        style
      ]} 
      {...props}
    >
      <Text style={[
        s.buttonText,
        variant === 'primary' ? s.primaryText : s.secondaryText
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
