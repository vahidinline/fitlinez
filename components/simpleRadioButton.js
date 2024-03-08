import { Image, useTheme } from '@rneui/themed';
import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // You may need to install this package

const SimpleRadioButton = ({ label, selected, onSelect, img, disabled }) => {
  //console.log(`disabled for ${label}, ${disabled}`);
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      disabled={disabled ? true : false}
      onPress={onSelect}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: selected
          ? theme.colors.lightPrimary
          : theme.colors.background,
        marginVertical: 0,
        width: Dimensions.get('window').width / 1.2,
        // borderWidth: 1,
        borderRadius: 8,
        borderColor: selected ? theme.colors.secondary : theme.colors.border,
        height: Dimensions.get('window').height / 20,
      }}>
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: selected ? theme.colors.secondary : theme.colors.grey,
          alignItems: 'center',
          justifyContent: 'center',

          marginHorizontal: 10,
        }}>
        {selected && (
          <Icon
            name="check"
            size={20}
            color={selected ? theme.colors.secondary : theme.colors.grey}
          />
        )}
        {/* Use the checkmark icon or customize as needed */}
      </View>
      <Text>{label}</Text>
      {img && (
        <View
          style={{
            position: 'absolute',
            borderRadius: 12,
            right: 0,
            justifyContent: 'flex-end',

            marginHorizontal: 10,
          }}>
          <Image
            source={{ uri: img }}
            style={{
              //justifyContent: 'flex-end',
              width: 60,
              height: 60,
            }}
          />

          {/* Use the checkmark icon or customize as needed */}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default SimpleRadioButton;
