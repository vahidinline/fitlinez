import { Picker } from '@react-native-picker/picker';
import { useTheme } from '@rneui/themed';
import React from 'react';
import { useEffect } from 'react';

function CM({ setHeight }) {
  const { theme } = useTheme();
  const [selectedValue, setSelectedValue] = React.useState('170');
  const height = Array.from({ length: 60 }, (_, i) => i + 150);
  useEffect(() => {
    setHeight({
      height: selectedValue,
      unit: 'cm',
      value: selectedValue,
    });
  }, [selectedValue]);

  return (
    <Picker
      colorvalue={theme.colors.primary}
      selectedValue={selectedValue}
      style={{
        height: 250,
        width: 150,
        backgroundColor: 'transparent',
        alignSelf: 'center',
        marginBottom: 100,
      }}
      onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}>
      {height.map((item, index) => {
        return (
          <Picker.Item
            color={theme.colors.secondary}
            key={index}
            label={`${item.toString()} cm`}
            value={item.toString()}
          />
        );
      })}
    </Picker>
  );
}

export default CM;
