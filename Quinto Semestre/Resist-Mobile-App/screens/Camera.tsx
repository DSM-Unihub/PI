import React, { useState } from 'react';
import { View, StyleSheet, Alert, Text, Button } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRoute } from '@react-navigation/native';

type CornerPosition = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

const CornerMarker = ({ position }: { position: CornerPosition }) => {
  const getCornerStyle = () => {
    switch (position) {
      case 'topLeft':
        return { top: 0, left: 0, borderTopWidth: 5, borderLeftWidth: 5 };
      case 'topRight':
        return { top: 0, right: 0, borderTopWidth: 5, borderRightWidth: 5 };
      case 'bottomLeft':
        return { bottom: 0, left: 0, borderBottomWidth: 5, borderLeftWidth: 5 };
      case 'bottomRight':
        return { bottom: 0, right: 0, borderBottomWidth: 5, borderRightWidth: 5 };
    }
  };

  return (
    <View
      style={[
        styles.cornerMarker,
        getCornerStyle(),
      ]}
    />
  );
};

export default function Scanner({navigation}) {
  const route = useRoute();
  const {userId} = route.params as {userId: string};

  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>Permissão para usar a câmera é necessária</Text>
        <Button title="Permitir" onPress={requestPermission} />
      </View>
    );
  }

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (!scanned) {
      setScanned(true);
      navigation.navigate('Form',{scannedUrl: data, userId})
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'], // ou ['qr', 'pdf417', ...] para outros tipos
        }}
      />

      <View style={styles.overlayText}>
        <Text style={styles.titleText}>Scanner de QR Code</Text>
        <Text style={styles.subtitleText}>Scaneie o QR Code exibido na página de bloqueio para enviar uma sugestão com sua URL</Text>
      </View>
      <View style={styles.overlay}>
        <View style={styles.scanArea}>
          <CornerMarker position="topLeft" />
          <CornerMarker position="topRight" />
          <CornerMarker position="bottomLeft" />
          <CornerMarker position="bottomRight" />
          
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    position: 'absolute',
    bottom: 160,
    left: 0,
    right: 0,
    zIndex: 1,
    paddingInline:10,
    marginInline:46,
  },
  titleText: {
    color: '#fff',
    backgroundColor:'#0069FC',
    fontSize: 22,
    marginTop:80,
    fontWeight: 'bold',
    textAlign:'center',
    paddingHorizontal:20,
    paddingVertical:12,
    borderTopLeftRadius:14,
    borderTopRightRadius:14
  },
  subtitleText: {
    color: '#4D63A1',
    backgroundColor:'#fff',
    paddingVertical:10,
    fontSize: 16,
    textAlign:'center',
    borderBottomLeftRadius:14,
    paddingHorizontal:20,
    borderBottomRightRadius:14
  },
  scanArea: {
    width: 250,
    height: 250,
    position: 'relative',
    bottom:142
  },
  cornerMarker: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#FFFF',
  },
});