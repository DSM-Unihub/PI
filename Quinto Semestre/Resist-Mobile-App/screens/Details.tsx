import React, { useState } from 'react';
import { View, Image, StyleSheet, ScrollView, Pressable, Modal, Alert } from 'react-native';
import { publicurl } from '@/services/url';
import CustomRadio from '@/components/CustomRadio';
import CustomText from '@/components/CustomText';
import { CustomTextInput } from '@/components/CustomTextInput';
import Header from '@/components/Header';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

type RootStackParamList = {
  Login: undefined;
  List: undefined;
  Register: undefined;
  Form: undefined;
  Details: {
    suggestion: { url: string; tipo: boolean; motivo: string; foto: string };
  };
};

type DetailsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Details'>;
  route: {
    params: {
      suggestion: { url: string; tipo: boolean; motivo: string; foto: string };
    };
  };
};

export default function DetailsScreen({ navigation, route }: DetailsScreenProps) {
  const { suggestion } = route.params;
  const [status, setStatus] = useState<'bloqueado' | 'desbloqueado'>(
    suggestion.tipo ? 'bloqueado' : 'desbloqueado'
  );
  const [url] = useState(suggestion.url);
  const [motivo] = useState(suggestion.motivo);
  const [foto] = useState(suggestion.foto);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const imageUri = foto ? `${publicurl}/images/sugestoes/${foto}` : null;

  const handleImageError = () => {
    Alert.alert('Erro', 'Falha ao carregar a imagem. Verifique se ela existe no servidor.');
  };

  return (
    <View style={styles.generalcontainer}>
      <Header />

      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <CustomText title="Url sugerida:" />
          <CustomTextInput value={url} editable={false} style={styles.input} />

          <CustomText title="Você sugeriu que este site fosse:" />
          <View style={styles.checkboxContainer}>
            <View style={styles.radioGroup}>
              <CustomRadio
                label="Bloqueado"
                selected={status === 'bloqueado'}
                onPress={() => {}}
                disabled
              />
              <CustomRadio
                label="Desbloqueado"
                selected={status === 'desbloqueado'}
                onPress={() => {}}
                disabled
              />
            </View>
          </View>

          <CustomText title="Motivo da solicitação:" />
          <CustomTextInput style={styles.textArea} multiline value={motivo} editable={false} />

          {imageUri && (
            <>
              <CustomText title="Prova do ocorrido:" />
              <Pressable onPress={() => setIsModalVisible(true)}>
                <Image
                  source={{ uri: imageUri }}
                  style={styles.image}
                  onError={handleImageError}
                />
              </Pressable>

              <Modal
                visible={isModalVisible}
                transparent
                onRequestClose={() => setIsModalVisible(false)}
              >
                <Pressable
                  onPress={() => setIsModalVisible(false)}
                  style={styles.modalBackground}
                >
                  <Image
                    source={{ uri: imageUri }}
                    style={styles.fullImage}
                    onError={handleImageError}
                  />
                </Pressable>
              </Modal>
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  generalcontainer: {
    flex: 1,
    backgroundColor: '#DCE5FE',
  },
  container: {
    backgroundColor: '#DCE5FE',
    paddingVertical: 10,
    paddingHorizontal: 18,
    flex: 1,
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  radioGroup: {
    flexDirection: 'column',
  },
  textArea: {
    height: hp('20%'),
    borderRadius: 20,
    verticalAlign: 'top',
    textAlign: 'auto',
  },
  input: {
    paddingVertical: hp('1.6%'),
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginTop: 10,
    alignSelf: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '90%',
    height: '80%',
    resizeMode: 'contain',
  },
});
