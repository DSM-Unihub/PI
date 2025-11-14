import { fonts } from "@/constants/Fonts";
import { StyleSheet } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
export const s = StyleSheet.create({
    
    container: {
        flex: 1,
        backgroundColor: '#DCE5FE',
        marginBlockEnd:70,
        marginHorizontal:wp('-4%'),
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
        margin:0,
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
        verticalAlign:'middle',
        paddingLeft: wp('3.6%'),
    },
    
    headerRow: {
        flexDirection: 'row',
        padding: hp('2%'),
        paddingLeft: hp('2%'),
        borderBottomWidth: 1,
        borderBottomColor: '#DCE5FE',
        backgroundColor: '#F2F5FF',
        marginBottom:5
    },
    headerCell: {
        flex: 1,
        marginRight:wp('3%'),
        fontFamily:fonts.urbanistMedium500,
        fontSize:wp('3.8%'),
        color:'#4D63A1',
        alignSelf:'flex-start', 
        textAlign:'left',
    },
    headerAlt: {
        flex: 1,
        fontFamily:fonts.urbanistMedium500,
        fontSize:wp('3.8%'),
        color:'#4D63A1',
        alignSelf:'flex-start', 
        textAlign:'right',
    },
    cell: {
        flex: 1,
        alignSelf:'flex-start',
        textAlign:'left',
        marginRight:wp('-10%'),
        fontFamily:fonts.urbanistMedium500,
        fontSize:wp('3.8%'),
        color:'#4D63A1',
        
    },
})