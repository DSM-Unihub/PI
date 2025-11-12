import { StyleSheet } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

export const s = StyleSheet.create({

    container:{
        padding:10,
    },
    containerIcon:{
        padding: wp('3.4%'),
        borderRadius: wp('6.8%'),
        backgroundColor: '#FFFFFF',
    },
    titleStyle:{
        fontSize:28,
        fontWeight:'bold',
        textAlign:'center',
        padding:10
    },
    touchableOpacity:{
        position:'absolute',
        width:50,
        height:50,
        alignItems:'center',
        justifyContent:'center',
        right:30,
        bottom:80,
        zIndex:10,
    },
    touchableOpacityLeft:{
        position:'absolute',
        width:50,
        height:50,
        alignItems:'center',
        justifyContent:'center',
        right:100,
        bottom:60,
        zIndex:10
    },
    floatingButton:{
        resizeMode:'contain',
        backgroundColor:'white',
        height:hp('3%'),
        width:wp('6%'),
    }
})