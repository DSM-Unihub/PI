import { fonts } from "@/constants/Fonts";
import { StyleSheet } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';



export const s = StyleSheet.create({
    button: {
      padding: 18,
      borderRadius: 25,
      alignItems: 'center',
      paddingVertical:20,
      width:'100%',
      alignSelf:'center',
      bottom:'2%',
      flexDirection:'row',
    },
    primaryButton: {
      backgroundColor: '#ffffff',
      marginTop:70,
      
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: '#0056FF',
    },
    buttonText: {
      fontFamily: fonts.UrbanistSemiBold600,
      fontSize: hp('2.2%'),
    },
    primaryText: {
      color: '#9AA7D6',
    },
    secondaryText: {
      color: '#0056FF',
    },
    icon:{
      borderRadius: 50,
      width: hp('2.2%'),
      height: hp('2.2%'),
    },
    iconContainer:{
      backgroundColor: '#9AA7D6',
      borderRadius: 50,
      padding: hp('0.9%'),
      marginRight: wp('3%'),
    }
  }); 