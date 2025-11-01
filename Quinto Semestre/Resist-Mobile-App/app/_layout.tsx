import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import UserList from '@/screens/UserList';
import { useColorScheme } from '@/components/useColorScheme';
import SplashedScreen from '@/components/SplashScreen';
import LoginScreen from '@/screens/login';
import RegisterScreen from '@/screens/Cadastro';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserForm from '@/screens/UserForm';
import AuthTabs from '@/screens/AuthTabs';
import DetailsScreen from '@/screens/Details';
import CameraScreen from '@/screens/Camera';
import { useAppFonts } from '@/constants/Fonts';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export default function RootLayout() {
  // ✅ Always call all hooks at the top
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const fontsLoaded = useAppFonts();
  const [isLoading, setIsLoading] = useState(true);

  // Handle font load error
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // Hide splash when loaded
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Simulated loading (optional)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // ✅ Combine all loading checks after hooks
  const isReady = loaded && fontsLoaded && !isLoading;

  if (!isReady) {
    console.log('Waiting for fonts or loading to complete...');
    return <SplashedScreen />; // optional splash screen while waiting
  }

  // ✅ Safe to render navigator now
  return (
    <Stack.Navigator initialRouteName="Auth">
      <Stack.Screen
        name="Auth"
        component={AuthTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Form"
        component={UserForm}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Camera"
        component={CameraScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="List"
        component={UserList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* Example content */}
      <UserList />
    </ThemeProvider>
  );
}
