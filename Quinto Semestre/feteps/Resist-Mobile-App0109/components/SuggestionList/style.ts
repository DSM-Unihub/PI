import { fonts } from "@/constants/Fonts";
import { StyleSheet } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
export const s = StyleSheet.create({
    
    container: {
        flex: 1,
        backgroundColor: '#EBEFFB',
        marginBlockEnd:70,
        marginHorizontal:-18,
    },
    header: {
        backgroundColor: '#607bff',// Azul normal
        padding: 0,
        height:450,
        margin:0,
        backgroundPosition:'start',
    },
    
    headerBackground: {
        flex: 1,
        padding: 20,
        margin:0
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
        // backgroundColor:'#fff',
        padding:5,
        flex:1,
    },
    row: {
        flexDirection: 'row',   
        padding: hp('2%'),
        borderBottomWidth: 0,
        borderBottomColor: '#ccc',
    },
    
    headerRow: {
        flexDirection: 'row',
        padding: hp('2%'),
        borderBottomWidth: 1,
        borderBottomColor: '#e6ebffff',
        marginBottom:5
    },
    headerCell: {
        flex: 1,
        fontFamily:fonts.VarelaRegular400,
        fontSize:wp('3%'),
        color:'#5C6CA2',
    },
    cell: {
        flex: 1,
        fontFamily:fonts.VarelaRegular400,
        fontSize:wp('3%'),
        color:'#5C6CA2',
        
    },
})