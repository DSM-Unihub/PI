import { StyleSheet } from "react-native";

export const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white', // sem fundo
    borderRadius:22,
    paddingVertical: 5,
    justifyContent: 'space-around',
    marginBottom: 60,
    marginInline:45, // espaçamento inferior, se necessário,
    borderTopWidth: 0,
    borderColor: '#DDD',
    position: 'absolute', // fixa na parte inferior
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 5,
    zIndex: 10, // garante que fique por cima
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent', // sem fundo,
    
  },
  activeTab: {
    backgroundColor: '#2D6BFF',
    borderRadius: 20,
  },
  tabText: {
    color: '#8E9ECC',
    fontWeight: 'bold',
    fontSize: 18,
  },
  activeTabText: {
    color: '#fff',
  },
});