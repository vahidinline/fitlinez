import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '@rneui/themed';

export default function ServingSizeSelector({ setServingSize, i18n }) {
  const [servingSize, setServingSizeLocal] = useState('');
  const [numberOfServings, setNumberOfServings] = useState('1');
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const handleServingSizeChange = (text) => {
    setServingSizeLocal(text);
    updateTotalServingSize(text, numberOfServings);
  };

  const handleNumberOfServingsChange = (text) => {
    setNumberOfServings(text);
    updateTotalServingSize(servingSize, text);
  };

  const updateTotalServingSize = (servingSize, numberOfServings) => {
    const parsedServingSize = parseFloat(servingSize) || 0; // Convert to number, default to 0 if NaN
    const parsedNumberOfServings = parseFloat(numberOfServings) || 1; // Convert to number, default to 1 if NaN
    const totalSize = parsedServingSize * parsedNumberOfServings;

    // Ensure we send a number to the parent component
    setServingSize(Number(totalSize));
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.label}>{i18n.t('selectServingsize')}</Text> */}
      <View style={{ flexDirection: 'row' }}>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '50%',
          }}>
          <Text style={styles.label}>{i18n.t('servingsize')} </Text>
          <TextInput
            label={i18n.t('selectServingsize')}
            style={styles.input}
            placeholder="Enter serving size in grams"
            keyboardType="numeric"
            value={servingSize}
            onChangeText={handleServingSizeChange}
            returnKeyType="done"
          />
        </View>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '50%',
          }}>
          <Text style={styles.label}>{i18n.t('numberOfserving')}</Text>

          <TextInput
            label={i18n.t('numberOfServings')}
            style={styles.input}
            placeholder="Enter number of servings"
            keyboardType="numeric"
            value={numberOfServings}
            onChangeText={handleNumberOfServingsChange}
            returnKeyType="done"
          />
        </View>
      </View>

      <Text style={styles.totalLabel}>
        {i18n.t('totalServingSize')}:{' '}
        {parseFloat(servingSize || 0) * parseFloat(numberOfServings || 1)}{' '}
        {i18n.t('g')}
      </Text>
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      // flexDirection: 'row',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderColor: theme.colors.border,
      //borderWidth: 1,
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
      height: Dimensions.get('window').height / 6,
      width: Dimensions.get('window').width / 1.2,
    },
    label: {
      fontSize: 12,
      marginBottom: 5,
      fontFamily: 'Vazirmatn',
      textAlign: 'center',
    },
    input: {
      height: 40,
      borderColor: theme.colors.border,
      borderWidth: 1,
      borderRadius: 8,
      marginTop: 10,
      marginHorizontal: 5,
      paddingHorizontal: 10,
      width: '45%',
    },
    totalLabel: {
      fontSize: 14,
      marginTop: 10,
      fontFamily: 'Vazirmatn',
      textAlign: 'center',
    },
  });
