import React from "react";
import { Image } from "expo-image";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { View } from "../Themed";

export default function StatusIcon({ status }: { status: string }, Customstyle?: any) {
    let icon;

    switch (status) {
        case "Aprovado":
            icon = require('@/assets/images/correct.png');
            break;
        case "Reprovado":
            icon = require('@/assets/images/error.png');
            break;
        case "Pendente":
            icon = require('@/assets/images/pending.png');
            break;
        default:
            icon = require('@/assets/images/pending.png');
            break;
    }

    return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start', backgroundColor: 'transparent' }}>
    <Image source={icon} style={[{ width: wp('4%'), height: hp('0.50%'), alignSelf:'flex-end', marginRight: wp('2.4%') }, Customstyle]} />

    </View>
    );
}