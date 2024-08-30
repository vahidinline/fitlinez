import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '@rneui/themed';

export default function ServingSizeSelector({ setServingSize }) {
  const [selectedOption, setSelectedOption] = useState('');
  const [customServing, setCustomServing] = useState('');
  const { theme } = useTheme;
  const handleSelection = (itemValue) => {
    setSelectedOption(itemValue);

    // If user selected a predefined fraction, set it directly
    if (itemValue !== 'custom') {
      setServingSize(itemValue);
    } else {
      setServingSize('');
    }
  };

  const handleCustomServing = (text) => {
    setCustomServing(text);
    setServingSize(text);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Serving Size:</Text>

      <Picker
        mode="dialog"
        prompt={'Select Serving Size:'}
        // itemStyle={{ color: ''}}
        selectedValue={selectedOption}
        style={{
          //height: 250,
          width: 250,
        }}
        onValueChange={(itemValue, itemIndex) => handleSelection(itemValue)}>
        <Picker.Item label="1/4" value="0.25" />
        <Picker.Item label="1/3" value="0.33" />
        <Picker.Item label="1/2" value="0.5" />
        <Picker.Item label="2/3" value="0.67" />
        <Picker.Item label="3/4" value="0.75" />
        <Picker.Item label="Full" value="1" />
        {/* <Picker.Item label="Custom" value="custom" /> */}
      </Picker>

      {selectedOption === 'custom' && (
        <TextInput
          style={styles.input}
          placeholder="Enter custom serving size (e.g., 50%)"
          keyboardType="numeric"
          value={customServing}
          onChangeText={handleCustomServing}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 10,
  },
});
