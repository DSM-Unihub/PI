import React from "react";
import { FlatList, View, StyleSheet } from "react-native";
import SuggestionList from "@/components/SuggestionList";
import FabButton from "@/components/FabButton";
import Header from "@/components/Header";
import CustomText from "@/components/CustomText";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useRoute } from '@react-navigation/native';

type RootStackParamList = {
    Login: undefined;
    List: undefined;
    Register: undefined;
    Form: undefined
  };
  
  type UserListScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'List'>;
  }
  

  export default function UserList({ navigation }: UserListScreenProps) {
    const route = useRoute();
    const { userId } = route.params;

    console.log('User ID:', userId);

    return (
        
    <View style={styles.generalcontainer}>
        
        <Header />
        <View style={styles.container}>
            <CustomText title="Minhas sugestões:"/>
            <SuggestionList userId={userId} />
            <FabButton userId={userId}/>
        </View>
        </View>
    );
};

const styles = StyleSheet.create({
    
  generalcontainer: {
    flex: 1,
    backgroundColor: '#EBEFFB',
  },
    container: {
        flex: 1,
        backgroundColor: '#EBEFFB',
        paddingVertical: 10,
        paddingHorizontal: 18,
    },
    header: {
        backgroundColor: '#007bff', // Azul normal
        padding: 20,
    },
    headerText: {
        color: '#fff',
        fontSize: 24,
    },
    subHeaderText: {
        color: '#fff',
        fontSize: 16,
    },
    table: {
        marginTop: 10,
        borderColor: '#ccc',
        borderRadius:15,
        backgroundColor:'#000',
        margin:10,
        padding:5
    },
    row: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    headerCell: {
        flex: 1,
        fontWeight: 'bold',
        color:'#5C6CA2',
    },
    cell: {
        flex: 1,
        color:'#5C6CA2',
    },
});
