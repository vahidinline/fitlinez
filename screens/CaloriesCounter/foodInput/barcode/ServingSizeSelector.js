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
      <Text style={styles.label}>{i18n.t('selectServingsize')}</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter serving size in grams"
        keyboardType="numeric"
        value={servingSize}
        onChangeText={handleServingSizeChange}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter number of servings"
        keyboardType="numeric"
        value={numberOfServings}
        onChangeText={handleNumberOfServingsChange}
      />

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
      marginVertical: 10,
      paddingHorizontal: 20,
      borderColor: theme.colors.border,
      borderWidth: 1,
      backgroundColor: theme.colors.background,
      borderRadius: 8,
      height: Dimensions.get('window').height / 5,
    },
    label: {
      fontSize: 16,
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
      paddingHorizontal: 10,
    },
    totalLabel: {
      fontSize: 16,
      marginTop: 10,
      fontFamily: 'Vazirmatn',
      textAlign: 'center',
    },
  });
