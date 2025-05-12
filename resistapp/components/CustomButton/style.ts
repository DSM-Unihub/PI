import { StyleSheet } from "react-native";

export const s = StyleSheet.create({
    button: {
      padding: 18,
      borderRadius: 25,
      alignItems: 'center',
      marginBottom: 25,
      paddingVertical:20,
      width:'100%',
      alignSelf:'center',
      bottom:'14%',
    position: 'absolute', 
    },
    primaryButton: {
      backgroundColor: '#0056FF',
      marginTop:70,
      
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: '#0056FF',
    },
    buttonText: {
      fontWeight: 'bold',
      fontSize: 20,
    },
    primaryText: {
      color: '#fff',
    },
    secondaryText: {
      color: '#0056FF',
    },
  }); 