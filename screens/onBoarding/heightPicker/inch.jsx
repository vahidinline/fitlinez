import { Picker } from '@react-native-picker/picker';
import { useTheme } from '@rneui/themed';
import React from 'react';
import { useEffect } from 'react';
import { View } from 'react-native';

function Inch({ setHeight }) {
  const { theme } = useTheme();
  const [selectedFt, setSelectedFt] = React.useState(null);
  const [selectedInch, setSelectedInch] = React.useState(null);
  const ft = Array.from({ length: 7 }, (_, i) => i + 1);
  const inch = Array.from({ length: 12 }, (_, i) => i + 1);
  useEffect(() => {
    setHeight({
      height: `${selectedFt}.${selectedInch}`,
      unit: 'ft/in',
    });
  }, [selectedFt, selectedInch]);
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}>
      <Picker
        colorvalue={theme.colors.primary}
        selectedValue={selectedFt}
        style={{
          height: 250,
          width: 150,
          backgroundColor: 'transparent',
          alignSelf: 'center',
          marginBottom: 100,
        }}
        onValueChange={(itemValue, itemIndex) => setSelectedFt(itemValue)}>
        {ft.map((item, index) => {
          return (
            <Picker.Item
              color={theme.colors.secondary}
              key={index}
              label={`${item.toString()} ft`}
              value={item.toString()}
            />
          );
        })}
      </Picker>
      <Picker
        colorvalue={theme.colors.primary}
        selectedValue={selectedInch}
        style={{
          height: 250,
          width: 150,
          backgroundColor: 'transparent',
          alignSelf: 'center',
          marginBottom: 100,
        }}
        onValueChange={(itemValue, itemIndex) => setSelectedInch(itemValue)}>
        {inch.map((item, index) => {
          return (
            <Picker.Item
              color={theme.colors.secondary}
              key={index}
              label={`${item.toString()} in`}
              value={item.toString()}
            />
          );
        })}
      </Picker>
    </View>
  );
}

export default Inch;
