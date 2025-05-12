import { ImageBackground, Text, View, TextInput, TouchableOpacity } from "react-native";
import { s } from "./style";
import { AntDesign, FontAwesome } from '@expo/vector-icons';

export default function Header(){
    return(
        <View style={s.header}>
            <ImageBackground 
                source={require('@/assets/images/background.png')} 
                style={s.headerBackground} 
                imageStyle={s.imageStyle}
                resizeMode="cover"
            >
                <View style={s.searchContainer}>
                    
                    <TextInput 
                        style={s.searchInput} 
                        placeholder="Pesquisar"
                        placeholderTextColor='#9AA7D6'
                    />
                    <TouchableOpacity style={s.iconContainer}>
                        <FontAwesome name="bell" size={22} color='#2B438DD9' />
                    </TouchableOpacity>
                    <TouchableOpacity style={s.iconContainer}>
                        <AntDesign name="user" size={22} color="#2B438DD9" />
                    </TouchableOpacity>
                </View>
                <Text style={s.headerText}>Olá, Caio!</Text>
                <Text style={s.subHeaderText}>Bem-vindo.</Text>
            </ImageBackground>
        </View>
    )
}