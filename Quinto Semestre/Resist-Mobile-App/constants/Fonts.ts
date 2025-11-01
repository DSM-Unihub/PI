import {useFonts} from 'expo-font';
import { RobotoCondensed_400Regular, RobotoCondensed_700Bold } from '@expo-google-fonts/roboto-condensed';
import { Urbanist_600SemiBold ,Urbanist_800ExtraBold } from '@expo-google-fonts/urbanist';
import { VarelaRound_400Regular} from '@expo-google-fonts/varela-round';

export const fonts={
    RobotoRegular400: 'RobotoCondensed_400Regular',
    RobotoBold700: 'RobotoCondensed_700Bold',
    UrbanistSemiBold600: 'Urbanist_600SemiBold',
    UrbanistExtraBold800: 'Urbanist_800ExtraBold',
    VarelaRegular400: 'VarelaRound_400Regular',

}

export const useAppFonts =() =>{
    const [fontsLoaded] = useFonts({
        [fonts.RobotoRegular400]: RobotoCondensed_400Regular,
        [fonts.RobotoBold700]: RobotoCondensed_700Bold,
        [fonts.UrbanistSemiBold600]: Urbanist_600SemiBold,
        [fonts.UrbanistExtraBold800]: Urbanist_800ExtraBold,
        [fonts.VarelaRegular400]: VarelaRound_400Regular,
    
  });

    return fontsLoaded;
};