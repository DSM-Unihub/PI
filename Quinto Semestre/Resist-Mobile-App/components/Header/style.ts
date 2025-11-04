import { fonts } from "@/constants/Fonts";
import { StyleSheet } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

export const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EBEFFB',
        overflow:'hidden',
    },
    header: {
        backgroundColor: '#607bff',// Azul normal
        padding: 0,
        height:270,
        margin:0,
        overflow:'hidden',
    },

    imageStyle:{
        position:'absolute',
        bottom:0,
        alignSelf:'flex-end',
        height:'auto',
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
        flex: 1,
        marginTop: hp(''), // Space between search bar and text
        
    },
    searchInput: {
        flex: 1,
        height: hp('4.6%'), // Adjust height as needed
        backgroundColor: '#fff',
        borderRadius: 13,
        fontSize: wp('3%'),
        fontFamily: fonts.RobotoRegular400, // Responsive font size
        paddingHorizontal: 15, // Space between search bar and icons
    },

    searchLogoAndInput:{
    width:wp('62%'),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: wp('2.2%'),
    paddingHorizontal: 10,
    },
    headerText: {
        fontFamily: fonts.RobotoBold700,
        color: '#fff',
        fontSize: wp('6%'), 
        marginLeft:wp('2%'),
    },
    headerTitle: {
        fontFamily: fonts.RobotoRegular400,
        color: '#fff',
        fontSize: wp('3.4%'), 
    },
    headerSubTitle: {
        fontFamily: fonts.RobotoBold700,
        color: '#fff',
        fontSize: wp('3.4%'), 
    },
    subHeaderText: {
        color: '#fff',
        fontSize: wp('4.3%'), 
        fontFamily: fonts.RobotoRegular400, 
        marginLeft:wp('2%'),
    },
    iconContainer: {
         backgroundColor:'#fff',
         paddingVertical: hp('1.3%'),
         paddingHorizontal: wp('2.4%'),
         height: hp('5.6%'),
         width: hp('5.6%'),
         borderRadius:13,
         marginLeft:wp('2.2%'),
    },
    iconContainer2: {
         paddingVertical: hp('1.3%'),
         paddingHorizontal: wp('2.4%'),
         height: hp('5%'),
         width: hp('4%'),
         marginLeft:wp('44.2%'),
    }
})