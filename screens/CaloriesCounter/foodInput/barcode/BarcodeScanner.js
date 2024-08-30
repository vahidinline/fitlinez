// import React, { useState, useEffect, useContext } from 'react';
// import { Text, View, StyleSheet, Dimensions } from 'react-native';
// import { BarCodeScanner } from 'expo-barcode-scanner';
// import { sendBarCode } from '../../../../api/barCodefunctions';
// import AuthContext from '../../../../api/context';
// import LanguageContext from '../../../../api/langcontext';
// import i18nt from '../../../../locales';
// import { I18n } from 'i18n-js';

// export default function BarcodeScanner({
//   setFoodItems,
//   setStatus,
//   status,
//   selectedMeal,
// }) {
//   const [hasPermission, setHasPermission] = useState(null);
//   const [scanned, setScanned] = useState(false);
//   const { userAuth } = useContext(AuthContext);
//   const userId = userAuth.id;
//   const { userLanguage } = useContext(LanguageContext);
//   const i18n = new I18n(i18nt);
//   i18n.locale = userLanguage;
//   const RTL = userLanguage === 'fa';
//   useEffect(() => {
//     const getBarCodeScannerPermissions = async () => {
//       const { status } = await BarCodeScanner.requestPermissionsAsync();
//       setHasPermission(status === 'granted');
//     };

//     getBarCodeScannerPermissions();
//   }, []);

//   const handleBarCodeScanned = async ({ type, data }) => {
//     setScanned(true);
//     const res = await sendBarCode(data, selectedMeal, userId);
//     if (res) {
//       await setFoodItems(res);
//       setTimeout(() => {
//         setStatus('success');
//       }, 1000);

//       console.log('res in handleBarCodeScanned', res);
//     } else {
//       alert(`Bar code with type  ${data} has  no data!`);
//     }
//   };

//   if (hasPermission === null) {
//     return <Text>Requesting for camera permission</Text>;
//   }
//   if (hasPermission === false) {
//     return <Text>No access to camera</Text>;
//   }

//   return (
//     <View style={styles.container}>
//       {!scanned ? (
//         <BarCodeScanner
//           onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
//           style={StyleSheet.absoluteFillObject}
//         />
//       ) : (
//         <>{status === 'loading' && <FitlinezLoading />}</>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     height: Dimensions.get('window').height / 5,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 10,
//     marginVertical: 10,
//     padding: 10,
//   },
// });

import React, { useState, useEffect, useContext } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TextInput,
  Button,
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { sendBarCode } from '../../../../api/barCodefunctions';
import AuthContext from '../../../../api/context';
import LanguageContext from '../../../../api/langcontext';
import i18nt from '../../../../locales';
import { I18n } from 'i18n-js';
import ServingSizeSelector from './ServingSizeSelector';

export default function BarcodeScanner({
  setFoodItems,
  setStatus,
  status,
  selectedMeal,
}) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [servingSize, setServingSize] = useState('');
  const [barCodeData, setBarCodeData] = useState(null);
  const { userAuth } = useContext(AuthContext);
  const userId = userAuth.id;
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setBarCodeData(data); // Store the scanned barcode data
  };

  const handleSendBarCode = async () => {
    if (!servingSize) {
      alert(i18n.t('Please enter a valid serving size.'));
      return;
    }

    setStatus('loading');
    const res = await sendBarCode(
      barCodeData,
      selectedMeal,
      userId,
      servingSize
    ); // Add servingSize to the request

    if (res) {
      await setFoodItems(res);
      setTimeout(() => {
        setStatus('success');
      }, 1000);
      console.log('res in handleSendBarCode', res);
    } else {
      alert(i18n.t(`Bar code with data ${barCodeData} has no data!`));
    }
    setScanned(false);
    setServingSize(''); // Reset serving size for the next scan
  };

  if (hasPermission === null) {
    return <Text>{i18n.t('Requesting for camera permission')}</Text>;
  }
  if (hasPermission === false) {
    return <Text>{i18n.t('No access to camera')}</Text>;
  }

  return (
    <View style={styles.container}>
      {!scanned ? (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      ) : (
        <>
          {scanned && (
            <View style={styles.inputContainer}>
              <ServingSizeSelector setServingSize={setServingSize} />
              <Button title={i18n.t('submit')} onPress={handleSendBarCode} />
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height / 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 10,
    padding: 10,
  },
  inputContainer: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: 200,
    textAlign: 'center',
  },
});
