import { StyleSheet } from "react-native";

export const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EBEFFB',
        overflow:'hidden'
    },
    header: {
        backgroundColor: '#607bff',// Azul normal
        padding: 0,
        height:270,
        margin:0,
        overflow:'hidden'
    },

    imageStyle:{
        position:'absolute',
        bottom:0,
        alignSelf:'flex-end',
        height:'auto'
    },
    
    headerBackground: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: 20,
        paddingBottom:50,
        margin:0,
        overflow:'hidden'

    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'flex-start',
        verticalAlign:'top',
        marginBottom: 70, // Space between search bar and text
    },
    searchInput: {
        
        flex: 1,
        height: 40,
        backgroundColor: '#fff',
        borderRadius: 13,
        paddingHorizontal: 15, // Space between search bar and icons
    },
    headerText: {
        color: '#fff',
        fontSize: 24,
        fontWeight:'bold',
    },
    subHeaderText: {
        color: '#fff',
        fontSize: 16,
        fontWeight:'bold',
    },
    iconContainer: {
         backgroundColor:'#fff',
         padding:9,
         borderRadius:13,
         marginLeft:12
    }
})