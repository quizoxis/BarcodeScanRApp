import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function App() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [scanCompleted, setScanCompleted] = useState(false);
  const [barcodeDataType, setBarcodeDataType] = useState('None');
  const [barcodeData, setBarcodeData] = useState('Looking for barcode...');

  const requestCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasCameraPermission(status === 'granted');
    })()
  }

  // Request Permission : Camera
  useEffect( () => {
    requestCameraPermission();
  }, []);

  const readBarcode = ({ type, data }) => {
    setScanCompleted(true);
    setBarcodeDataType(type);
    setBarcodeData(data);

    console.log(`Type: ${barcodeDataType} \nData: ${barcodeData}`);
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  if (hasCameraPermission === null) {
    return (
        <View style={styles.container}>
          <Text>Requesting for camera permission</Text>
        </View>
    )
  }


  if (hasCameraPermission === false) {
    return (
        <View style={styles.container}>
          <Text style={{ margin: 10 }}>No access to camera</Text>
          <Button title={'Allow Camera'} onPress={() => requestCameraPermission()} />
        </View>
    )
  }

  return (
      <View style={styles.container}>

        <View style={styles.barcodewindow}>
          <BarCodeScanner
              onBarCodeScanned={scanCompleted ? undefined : readBarcode}
              style={{height: 400, width: 400}}
          />

        </View>
        <Text style={styles.maintext}>{barcodeData}</Text>

        {scanCompleted && <Button title={'Tap to Scan Again'} onPress={() => {
          setScanCompleted(false);
        }} color='tomato'
        />}

      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  barcodewindow: {
    backgroundColor: 'tomato',
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
    width: 300,
    overflow: 'hidden',
    borderRadius: 30,
  },
  maintext: {
    fontSize: 14,
    margin: 18,
  }
});
