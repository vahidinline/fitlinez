import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StyleSheet, Dimensions, TextInput } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { sendBarCode } from '../../../../api/barCodefunctions';
import AuthContext from '../../../../api/context';
import LanguageContext from '../../../../api/langcontext';
import i18nt from '../../../../locales';
import { I18n } from 'i18n-js';
import ServingSizeSelector from './ServingSizeSelector';
import { Button, useTheme } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

export default function BarcodeScanner({
  setFoodItems,
  setStatus,
  selectedMeal,
}) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [servingSize, setServingSize] = useState('');
  const [barCodeData, setBarCodeData] = useState(null);
  const { userAuth } = useContext(AuthContext);
  const navigator = useNavigation();
  const userId = userAuth.id;
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const { theme } = useTheme;
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
    // console.log('res in barcode scanner', res);
    if (res) {
      await setFoodItems(res);
      navigator.navigate('TempfoodItems', {
        foodItems: res.data,
        setStatus: setStatus,
      });
      setTimeout(() => {
        setStatus('success');
      }, 1000);
    } else {
      alert(i18n.t(`Bar code with data ${barCodeData} has no data!`));
    }
    setScanned(false);
    setServingSize(''); // Reset serving size for the next scan
  };

  if (hasPermission === null) {
    return <Text>{i18n.t('Requestingforcamerapermission')}</Text>;
  }
  if (hasPermission === false) {
    return <Text>{i18n.t('NoAccessToCamera')}</Text>;
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
              <ServingSizeSelector
                i18n={i18n}
                setServingSize={setServingSize}
              />
              <Button
                titleStyle={styles.text}
                buttonStyle={{
                  backgroundColor: '#5B5891',
                  width: '100%',
                  marginVertical: 5,
                  borderRadius: 8,
                }}
                title={i18n.t('find')}
                onPress={handleSendBarCode}
              />
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
    //backgroundColor: '#fff',
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
  text: {
    fontFamily: 'Vazirmatn',
  },
});
