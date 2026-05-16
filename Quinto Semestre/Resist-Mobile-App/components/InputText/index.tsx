import { Text, TextInput, TextStyle, ViewStyle, View } from "react-native";
import { s } from "./style";

type CustomInputTextProps = {
    hint?: string;
    defaultValue?: string;
    containerStyle?: ViewStyle;
    inputStyle?: TextStyle;
}

export default function InputText({
    hint,
    defaultValue,
    containerStyle,
    inputStyle,
    ...props
}: CustomInputTextProps){
    return(
        <View>
            <TextInput style={[s.textInput, inputStyle]}
            placeholder={hint}
            defaultValue={defaultValue}
            placeholderTextColor='#9AA7D6'
            {...props}
            />
        </View>
        );
}