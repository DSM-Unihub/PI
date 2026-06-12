import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";

const {width} = Dimensions.get('window');
const HEIGHT = 300

export const s = StyleSheet.create({
    container: {
      width: '100%',
      height: HEIGHT,
      backgroundColor: "#537FFF" , // fundo de segurança
    },
    backgroundImage: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
    loginText: {
      position: 'absolute',
      top: 10,
      left: 10,
      fontSize: 16,
      fontWeight: '600',
    },
    frontImage: {
      position: 'absolute',
      top:24,
      left:30,
      width: width * 0.1,
      height: HEIGHT * 0.3,
    },
  });