import React from 'react';
import { View, StyleSheet } from 'react-native';
import CustomText from '@/components/CustomText';
import SuggestionList from '@/components/SuggestionList';
import FabButton from '@/components/FabButton';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from '@/components/Header';
import {widthPercentageToDP as hp} from '@/utils/widthPercentageToDP'; 

type RootStackParamList = {
    Camera: undefined;
    Form: { userId: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function UserList() {
    const route = useRoute();
    const navigation = useNavigation<NavigationProp>();
    const { userId } = route.params as { userId: string };

    return (
      <View style={styles.generalcontainer}>
        
          <Header />
          <View style={styles.container}>
            <CustomText title="Minhas sugestões"/>
            <SuggestionList userId={userId} navigation={navigation} />
            <FabButton 
                userId={userId} 
                icon="camera" 
                position="top" 
                onPress={() => navigation.navigate('Camera', {userId})} 
                navigation={navigation}
            />
            <FabButton userId={userId}/>
            </View>
        </View>
    );
}

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