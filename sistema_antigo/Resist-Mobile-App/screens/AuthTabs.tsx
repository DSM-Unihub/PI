// AuthTabs.tsx
import React, { useState } from "react";
import { View } from "react-native";
import SwitchTabs from "@/components/switchTabs";
import LoginScreen from "@/screens/login";
import RegisterScreen from "@/screens/Cadastro";
import { StyleSheet } from "react-native";

export default function AuthTabs({ navigation }) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  return (
    <View style={{ flex: 1 }}>
      <SwitchTabs active={activeTab} onTabPress={setActiveTab} />
      {activeTab === 'login' ? <LoginScreen navigation={navigation} /> : <RegisterScreen navigation={navigation} />}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1, // ocupa o espaço acima das abas
  },
});