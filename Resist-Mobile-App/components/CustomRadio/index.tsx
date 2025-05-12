import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

export default function CustomRadio({ label, selected, onPress }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected && <View style={styles.radioInner} />}
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
    height: 20,
    width: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#8a9bd1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioSelected: {
    backgroundColor: '#8a9bd1',
  },
  radioInner: {
    width: 10,
    height: 10,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  label: {
    fontSize: 16,
    color: '#8a9bd1',
  },
  labelSelected: {
    fontWeight: 'bold',
  },
});
