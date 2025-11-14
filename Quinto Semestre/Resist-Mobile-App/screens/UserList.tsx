import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import CustomText from '@/components/CustomText';
import SuggestionList from '@/components/SuggestionList';
import FabButton from '@/components/FabButton';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from '@/components/Header';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { getUser } from '@/services/auth';
import { fonts } from '@/constants/Fonts';

type RootStackParamList = {
    Camera: undefined;
    Form: { userId: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function UserList() {
    const route = useRoute();
    const navigation = useNavigation<NavigationProp>();
    const { userId } = route.params as { userId: string };
    const [user, setUser] = useState<any>(null);
    
        useEffect(() => {
            async function fetchUser() {
                const userData = await getUser();
                setUser(userData);
            }
            fetchUser();
        }, []);

    
        if (!user) return (<CustomText>Loading...</CustomText>);
    return (
      <View style={styles.generalcontainer}>
        
          <Header />
          <View style={styles.container}>
            <CustomText title={user.permissoes===0 ? "Minhas sugestões" : "Meus bloqueios e desbloqueios"} style={styles.subtitle}/>
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
        backgroundColor: '#DCE5FE',
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
    subtitle: {
        marginTop:hp('0.8%'),
        fontSize:hp('2.6%'),
        fontFamily: fonts.urbanistMedium500,
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
        color:'#4D63A1',
    },
    cell: {
        flex: 1,
        color:'#4D63A1',
    },
});