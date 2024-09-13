import { Image, useTheme } from '@rneui/themed';
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PriceRadionButton = ({
  label,
  selected,
  onSelect,
  sign,
  price,
  description,
  disabled,
  priceDisplay,
  value,
  userLanguage,
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={() => onSelect(value)}
      style={{
        flexDirection: 'row',
        direction: userLanguage === 'fa' ? 'rtl' : 'ltr',
        alignItems: 'center',
        backgroundColor: selected
          ? theme.colors.lightPrimary
          : theme.colors.background,
        marginVertical: 10,
        marginHorizontal: 10,
        width: Dimensions.get('window').width / 1.1,
        borderWidth: 1,
        borderRadius: 16,
        borderColor: selected ? theme.colors.secondary : theme.colors.border,
        height: Dimensions.get('window').height / 15,
        fontFamily: 'Vazirmatn',
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
      </View>
      <View>
        <Text
          style={{
            color: selected ? theme.colors.secondary : theme.colors.text,
            fontFamily: 'Vazirmatn',
            justifyContent: userLanguage !== 'fa' ? 'flex-end' : 'flex-start',
            alignContent: 'flex-end',
            textAlign: userLanguage !== 'fa' ? 'right' : 'left',
          }}>
          {label}
        </Text>
        <Text style={{ fontFamily: 'Vazirmatn' }}>{description}</Text>
      </View>

      <View
        style={{
          position: 'absolute',
          borderRadius: 12,
          right: 0,
          justifyContent: 'flex-end',
          marginHorizontal: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontFamily: 'Vazirmatn',
            }}>
            {sign !== 'Iran' ? sign : ''}
          </Text>
          <Text
            style={{
              fontFamily: 'Vazirmatn',
            }}>
            {priceDisplay}
          </Text>
          {/* <Text>{description.charAt(0).toLowerCase()}</Text> */}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PriceRadionButton;
