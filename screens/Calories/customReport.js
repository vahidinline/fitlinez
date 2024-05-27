import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-elements';

function CustomReport() {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  return (
    <View>
      <ScrollView></ScrollView>
      <View></View>
    </View>
  );
}

export default CustomReport;

const getStyles = (theme) => StyleSheet.create({});
