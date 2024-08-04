import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { sendBarCode } from '../../../../api/barCodefunctions';

export default function BarcodeScanner({
  setFoodItems,
  setStatus,
  userInput,
  setUserInput,
  setInputStatus,
  selectedMeal,
  status,
  i18n,
  userId,
  RTL,
}) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    const res = await sendBarCode(data, selectedMeal, userId);
    if (res) {
      await setFoodItems(res);
      setTimeout(() => {
        setStatus('initialReqSent');
      }, 1000);

      //console.log('res in handleBarCodeScanned', res);
    } else {
      alert(`Bar code with type  ${data} has  no data!`);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Text>Barcode Scanner</Text>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '50%',
    //flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});
