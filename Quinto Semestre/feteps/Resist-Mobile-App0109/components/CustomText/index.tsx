import { Text, TextProps } from "react-native";
import { s } from "./style";

interface CustomTextProps extends TextProps {
    title: string;
}

export default function CustomText({title}:CustomTextProps) {
    return (
        <>
        <Text style={s.Text}>{title}</Text>
        </>
    );
  }