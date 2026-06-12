import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { s } from "./style";

type Props = {
  active: 'login' | 'register';
  onTabPress: (tab: 'login' | 'register') => void;
};

export default function SwitchTabs({ active, onTabPress }: Props) {
  return (
    <View style={s.container}>
      <TouchableOpacity
        style={[s.tab, active === 'login' && s.activeTab]}
        onPress={() => onTabPress('login')}
      >
        <Text style={[s.tabText, active === 'login' && s.activeTabText]}>
          Login
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[s.tab, active === 'register' && s.activeTab]}
        onPress={() => onTabPress('register')}
      >
        <Text style={[s.tabText, active === 'register' && s.activeTabText]}>
          Cadastro
        </Text>
      </TouchableOpacity>
    </View>
  );
}


