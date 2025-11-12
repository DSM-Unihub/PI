import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Image } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';


export default function CustomRadio({ label, selected, onPress }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected && <View style={styles.radioInner}><Image source={require('@/assets/images/correctwhite.png')} /></View>}
      </View>
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  radio: {
    height: 30,
    width: 30,
    borderRadius: wp('1.4%'),
    borderWidth: 2,
    borderColor: '#4D63A1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioSelected: {
    backgroundColor: '#4D63A1',
  },
  radioInner: {
    width: 18,
    height: 20,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize:wp('3.6%'),
    color: '#4D63A1',
  },
  labelSelected: {
    fontWeight: 'bold',
  },
});
