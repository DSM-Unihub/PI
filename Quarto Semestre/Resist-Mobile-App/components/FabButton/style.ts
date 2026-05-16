import { StyleSheet } from "react-native";

export const s = StyleSheet.create({

    container:{
        backgroundColor: 'white',
        padding:10
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
        zIndex:10
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
        width:60,
        height:60
    }
})