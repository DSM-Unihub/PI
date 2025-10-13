import { ImageBackground, Text, View, TextInput, TouchableOpacity, Image } from "react-native";
import { s } from "./style";
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { CustomTextInput } from "../CustomTextInput";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';


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
                    
                    <View style={s.searchLogoAndInput}>
                    <Image source={require('@/assets/images/icon/search.png')} alt="Search Icon" style={{height:hp('2.2%'), width:wp('4.8%')}} />
                    
                    <TextInput 
                        style={s.searchInput} 
                        placeholder="Pesquisar"
                        placeholderTextColor='#9AA7D6'
                    >
                        {/* <Image source={require('@/assets/images/icon/search.png')} alt="Search Icon" /> */}
                    
                    </TextInput>

                    </View>
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