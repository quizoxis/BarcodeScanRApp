import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as DocumentPicker from 'expo-document-picker';


export default function App() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [scanCompleted, setScanCompleted] = useState(false);
  const [barcodeDataType, setBarcodeDataType] = useState('None');
  const [barcodeData, setBarcodeData] = useState('Looking for barcode...');
  const [inputDocument, setInputDocument] = useState(null);

  const requestCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasCameraPermission(status === 'granted');
    })()
  }

  const openDocumentPicker = () => {

    try {

      (async () => {
        const result = await DocumentPicker.getDocumentAsync({type:"text/csv"})

        if (result.type === 'success') {
          setInputDocument(result)
          console.log(
              result.uri,
              result.type, // mime type
              result.name,
              result.size,
          )
        }

        if (result.type === 'cancel') {
          // user cancelled the document selection
          console.log(`user cancelled`)
        }

      })()

    } catch (err) {
      throw err

      // if (DocumentPicker.isCancel(err)) {
      //   // User cancelled the picker, exit any dialogs or menus and move on
      // } else {
      //   throw err
      // }
    }
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
        <Button title={"Import Barcode File"} onPress={() => openDocumentPicker()}/>

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
