import { fonts } from "@/constants/Fonts";
import { StyleSheet } from "react-native";

export const s = StyleSheet.create({
    button: {
      padding: 18,
      borderRadius: 25,
      alignItems: 'center',
      paddingVertical:20,
      width:'100%',
      alignSelf:'center',
      bottom:'2%',
    },
    primaryButton: {
      backgroundColor: '#537FFF',
      marginTop:70,
      
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: '#537FFF',
    },
    buttonText: {
      fontFamily: fonts.UrbanistExtraBold800,
      fontSize: 20,
    },
    primaryText: {
      color: '#fff',
    },
    secondaryText: {
      color: '#537FFF',
    },
  }); 