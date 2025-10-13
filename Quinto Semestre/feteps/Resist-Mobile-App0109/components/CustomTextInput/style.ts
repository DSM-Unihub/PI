import { fonts } from "@/constants/Fonts";
import { StyleSheet } from "react-native";

export const s = StyleSheet.create({
    input: {
        backgroundColor: '#fff',
        paddingHorizontal: 28,
        paddingVertical: 22,
        borderRadius: 25,
        marginBottom: 20,
        fontSize:23,
        fontFamily: fonts.UrbanistSemiBold600,
        
      },
      passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 25,
        paddingVertical: 10,
        marginBottom: 18
        
      },
      inputPassword: {
        flex: 1,
        padding: 15,
        fontSize:23,
        paddingHorizontal: 28,
        paddingVertical: 12,
        color:'#000',
        fontFamily: fonts.UrbanistSemiBold600,
      },
      icon: {
        paddingHorizontal: 15,
      },
  }); 