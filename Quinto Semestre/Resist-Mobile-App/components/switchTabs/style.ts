import { fonts } from "@/constants/Fonts";
import { StyleSheet } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

export const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white', // sem fundo
    borderRadius: wp('2.6%'),
    paddingVertical: 5,
    justifyContent: 'space-around',
    marginBottom: 60,
    marginInline:wp('6%'), // espaçamento inferior, se necessário,
    borderTopWidth: 0,
    borderColor: '#DDD',
    position: 'absolute', // fixa na parte inferior
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 5,
    zIndex: 10, // garante que fique por cima
  },
  tab: {
    flex: 1,
    paddingVertical:hp('1.6%') ,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent', // sem fundo,
    
  },
  activeTab: {
    backgroundColor: '#537FFF',
    borderRadius: wp('2.8%'),
  },
  tabText: {
    color: '#8E9ECC',
    fontFamily: fonts.UrbanistExtraBold800,
    fontSize: wp('3.2%'),
  },
  activeTabText: {
    color: '#fff',
  },
});