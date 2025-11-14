import { fonts } from "@/constants/Fonts";
import { StyleSheet } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

export const s = StyleSheet.create({
    button: {
      padding: hp('2%'),
      borderRadius: wp('2.5%'),
      alignItems: 'center',
      paddingVertical: hp('2%'),
      width: '100%',
      alignSelf: 'center',
      bottom: hp('0%'),
    },
    primaryButton: {
      backgroundColor: '#537FFF',
      marginTop: hp('7%'),
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