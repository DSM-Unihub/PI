import { Component } from "react";
import { StyleSheet, Text, TouchableWithoutFeedback, View, Animated, SafeAreaView, TouchableOpacity, Image } from "react-native";
import {AntDesign, Entypo} from '@expo/vector-icons';
import { s } from "./style";
import { useNavigation } from "expo-router";

interface FabButtonProps {
    userId: string;
}

export default function FabButton({ userId }: FabButtonProps){
    const navigation = useNavigation()
    return(
        <View style={s.container}>
            <TouchableOpacity style={s.touchableOpacity} onPress={() => navigation.navigate('Form', { userId })}>
                <Image 
                style={s.floatingButton}
                source={require('@/assets/images/plusbutton.png')}/>
            </TouchableOpacity>
        </View>
        
    )
}
