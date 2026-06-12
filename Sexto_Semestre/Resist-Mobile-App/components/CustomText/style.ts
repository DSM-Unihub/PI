import { fonts } from "@/constants/Fonts";
import { StyleSheet } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

export const s = StyleSheet.create({
Text:{
    color:'#4D63A1',
    paddingVertical:12,
    fontSize:wp('3.6%'),
    fontFamily: fonts.VarelaRegular400,
},
})