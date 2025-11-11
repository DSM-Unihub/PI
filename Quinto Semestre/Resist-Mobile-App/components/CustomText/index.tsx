import { Text, TextProps } from "react-native";
import { s } from "./style";

interface CustomTextProps extends TextProps {
    title: string;
    style?: any;
}

export default function CustomText({title, style}:CustomTextProps) {
    return (
        <>
        <Text style={[s.Text, style]}>{title}</Text>
        </>
    );
  }