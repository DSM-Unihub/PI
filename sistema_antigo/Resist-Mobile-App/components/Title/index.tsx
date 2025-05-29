import React from 'react';
import { Text, TextProps } from 'react-native';
import { s } from './style';

interface TitleProps extends TextProps {
  children: React.ReactNode;
}

export function Title({ style, ...props }: TitleProps) {
  return (
    <Text style={[s.title, style]} {...props}>
      {props.children}
    </Text>
  );
}

