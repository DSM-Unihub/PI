import { StyleSheet } from "react-native";

export const s = StyleSheet.create({
    
    container: {
        flex: 1,
        backgroundColor: '#EBEFFB',
        marginBlockEnd:70
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
        borderRadius:15,
        backgroundColor:'#fff',
        padding:5,
        flex:1,
    },
    row: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 0,
        borderBottomColor: '#ccc',
    },
    
    headerRow: {
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
})