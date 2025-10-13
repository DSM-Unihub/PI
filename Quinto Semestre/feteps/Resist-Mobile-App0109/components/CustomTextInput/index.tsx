import React from 'react';
import { TextInput, TextInputProps, StyleSheet, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { s } from './style';

interface CustomTextInputProps extends TextInputProps {
  isPassword?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

export function CustomTextInput({ 
  style, 
  isPassword = false,
  showPassword,
  onTogglePassword,
  ...props 
}: CustomTextInputProps) {
  if (isPassword) {
    return (
      <View style={[s.passwordContainer, style]}>
        <TextInput
          placeholderTextColor="#9AA7D6"
          style={s.inputPassword}
          secureTextEntry={!showPassword}
          {...props}
        />
        <TouchableOpacity
          onPress={onTogglePassword}
          style={s.icon}
        >
          <Icon
            name={showPassword ? 'eye' : 'eye-off'}
            size={28}
            color="#aaa"
          />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TextInput
      placeholderTextColor="#9AA7D6"
      style={[s.input, style]}
      {...props}
    />
  );
}