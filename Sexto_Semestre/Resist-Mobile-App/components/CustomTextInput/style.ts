import { fonts } from "@/constants/Fonts";
import { StyleSheet } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

export const s = StyleSheet.create({
    input: {
        backgroundColor: '#fff',
        paddingHorizontal: 28,
        paddingVertical: 22,
        borderRadius: wp('2.2%'),
        marginBottom: 20,
        fontSize:23,
        fontFamily: fonts.UrbanistSemiBold600,
        boxShadow:"0px 4px 4px rgba(0, 0, 0, 0.1)",
        color:'#56648f'
        
        
      },
      passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: wp('2.2%'),
        paddingVertical: 10,
        marginBottom: 18,
        boxShadow:"0px 4px 6px rgba(0, 0, 0, 0.1)",
        
      },
      inputPassword: {
        flex: 1,
        padding: 15,
        fontSize:23,
        paddingHorizontal: 28,
        paddingVertical: 12,
        color:'#56648f',
        fontFamily: fonts.UrbanistSemiBold600,
      },
      icon: {
        paddingHorizontal: 15,
      },
  }); 