import { Picker } from '@react-native-picker/picker';
import { Button, Text, useTheme } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

function AgeSelection({ onAgeSelect, i18n }) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [selectedValue, setSelectedValue] = useState('25');
  //create a data state of age
  const age = Array.from({ length: 86 }, (_, i) => i + 15);

  useEffect(() => {
    onAgeSelect({
      age: selectedValue,
      value: selectedValue,
    });
  }, [selectedValue]);

  return (
    <View>
      <Text style={styles.title}>{i18n.t('age')}</Text>
      <View style={styles.container}>
        <Picker
          colorvalue={theme.colors.primary}
          selectedValue={selectedValue}
          style={{
            height: 250,
            width: 100,
            backgroundColor: 'transparent',
            alignSelf: 'center',
            marginBottom: 100,
          }}
          onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}>
          {age.map((item, index) => {
            return (
              <Picker.Item
                color={theme.colors.secondary}
                key={index}
                label={item.toString()}
                value={item.toString()}
              />
            );
          })}
        </Picker>
      </View>
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    icon: {
      marginRight: 10,
      marginLeft: 10,
      marginTop: 10,
      marginBottom: 10,
      justifyContent: 'flex-start',
    },
    container: {
      flexDirection: 'column',
    },
    button: {
      marginTop: 20,
      backgroundColor: theme.colors.background,
      borderColor: theme.colors.secondary,
      borderWidth: 0.3,
      borderRadius: 20,
      width: '100%',
      height: 80,
    },
    text: {
      color: theme.colors.secondary,
      fontSize: 20,
      fontWeight: 'bold',
      justifyContent: 'flex-start',
    },
    title: {
      color: theme.colors.secondary,
      fontSize: 20,
      fontWeight: 'bold',
      justifyContent: 'center',
      alignSelf: 'center',
      marginBottom: 100,
      fontFamily: 'Vazirmatn',
    },
  });

export default AgeSelection;
