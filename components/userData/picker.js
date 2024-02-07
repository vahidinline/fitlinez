import { Picker } from '@react-native-picker/picker';
import { Input, Text, useTheme } from '@rneui/themed';
import React from 'react';
import { TextInput } from 'react-native';
import { Dimensions, View } from 'react-native';
import { Defs } from 'react-native-svg';

function DataPicker({ selectedValue, setSelectedValue, data, label }) {
  const { theme } = useTheme();
  return (
    <Picker
      mode="dialog"
      prompt={label}
      itemStyle={{ color: theme.colors.secondary }}
      selectedValue={selectedValue}
      style={{
        //height: 250,
        width: 250,
        backgroundColor: theme.colors.primary,
      }}
      onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}>
      {data.map((item, index) => {
        return <Picker.Item key={index} label={item} value={item} />;
      })}
    </Picker>
  );
}

function NumPicker({
  selectedValue,
  setSelectedValue,
  data,
  label,
  defaultValue,
}) {
  // console.log('data', data);
  // console.log('setSelectedValue', setSelectedValue);

  const { theme } = useTheme();
  return (
    <View
      style={{
        width: Dimensions.get('window').width / 4,
      }}>
      <Text
        style={{
          width: 100,
          height: 20,
          //backgroundColor: theme.colors.primary,
          color: theme.colors.secondary,
          textAlign: 'center',
          fontSize: 12,
          //marginBottom: 10,
          //padding: 10,
          //borderRadius: 5,
          //borderWidth: 1,
          //borderColor: theme.colors.secondary,
        }}>
        {label}
      </Text>
      <Input
        returnKeyType="done"
        style={{
          width: 100,
          height: 50,
          backgroundColor: theme.colors.primary,
          color: theme.colors.secondary,
          textAlign: 'center',
          fontSize: 16,
          //marginBottom: 10,
          //padding: 10,
          //borderRadius: 5,
          //borderWidth: 1,
          //borderColor: theme.colors.secondary,
        }}
        //defaultValue={defaultValue}
        placeholder={selectedValue ? selectedValue.toString() : null}
        placeholderTextColor={theme.colors.secondary}
        keyboardType="numeric"
        onChangeText={(text) => setSelectedValue(text)}
        value={selectedValue}
      />
      {/* <Picker
        ColorValue={theme.colors.secondary}
        mode="dropdown"
        prompt="Select your favorite color"
        itemStyle={{
          color: theme.colors.secondary,
          fontSize: 20,
          fontWeight: 'bold',
          width: 100,
        }}
        selectedValue={selectedValue}
        style={{
          height: 50,
          width: 50,
          //backgroundColor: theme.colors.primary,
        }}
        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}>
        {data.map((item, index) => {
          return (
            <Picker.Item key={index} label={item.toString()} value={item} />
          );
        })}
      </Picker> */}
    </View>
  );
}

export { DataPicker, NumPicker };
