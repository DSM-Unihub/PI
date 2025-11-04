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
                    
                    
                        <Image source={require('@/assets/images/pfp.png')} style={s.iconContainer} />
                        <View style={{ marginLeft: wp('3%'), flexDirection: 'column' }}>
                            <Text style={s.headerTitle}>Caio Bronescheki</Text>
                            <Text style={s.headerSubTitle}>Aluno</Text>
                        </View>
                        <Image source={require('@/assets/images/icon.png')} style={s.iconContainer2} />
                </View>
                <Text style={s.headerText}>Olá, Caio!</Text>
                <Text style={s.subHeaderText}>Bem-vindo.</Text>
            </ImageBackground>
        </View>
    )
}