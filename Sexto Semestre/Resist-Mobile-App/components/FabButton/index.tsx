import { Component } from "react";
import { StyleSheet, Text, TouchableWithoutFeedback, View, Animated, SafeAreaView, TouchableOpacity, Image } from "react-native";
import {AntDesign, Entypo} from '@expo/vector-icons';
import { s } from "./style";
import { useNavigation } from "expo-router";

interface FabButtonProps {
    userId: string;
    icon?: 'plus' | 'camera';
    position?: 'top' | 'bottom';
    onPress?: () => void;
}

export default function FabButton({ userId, icon = 'plus', position = 'bottom', onPress }: FabButtonProps){
    const navigation = useNavigation()
    
     const handlePress = () => {
        if (onPress) {
            onPress();
        } else if (icon === 'plus') {
            navigation.navigate('Form', { userId });
        } else if (icon === 'camera') {
            navigation.navigate('Camera'); // Adicione esta condição
        }
    };

    const getIcon = () => {
        if (icon === 'camera') {
            return (
            <View style={s.containerIcon}>
                    <Image
                        style={s.floatingButton}
                        source={require('@/assets/images/qrCode.png')}
                    />
                </View>
            );
        }
        return (
            <View style={s.containerIcon}>
                <Image
                    style={s.floatingButton}
                    source={require('@/assets/images/plus.png')}
                />
            </View>
        );
    };

    const getPosition = () => {
        if (position === 'top') {
            return { bottom: 80, right: 100, position: 'absolute' as const }; // Position to the left of plus button
        }
        return { bottom: 80, right: 30, position: 'absolute' as const }; // Original plus button position
    };

    return(
        <View style={s.container}>
            <TouchableOpacity 
                style={position === 'top' ? s.touchableOpacityLeft : s.touchableOpacity} 
                onPress={handlePress}
            >
                {getIcon()}
            </TouchableOpacity>
        </View>
    )
}
