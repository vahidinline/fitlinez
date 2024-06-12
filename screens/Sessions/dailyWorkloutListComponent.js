import { Text, useTheme } from '@rneui/themed';
import React from 'react';
import { Dimensions, View } from 'react-native';

function DailyWorkloutListComponent({ item, i }) {
  const { theme } = useTheme();
  return (
    <View
      key={i}
      style={{
        flexDirection: 'row',
        // backgroundColor: theme.colors.white,
        //borderRadius: 20,
        marginBottom: 10,
        width: Dimensions.get('window').width - 20,
        marginHorizontal: 10,
        height: 60,
        borderRadius: 16,
        borderColor: theme.colors.border,
        borderWidth: 1,
      }}>
      <View
        style={{
          width: 35,
          height: 35,
          backgroundColor: theme.colors.secondary2,
          borderRadius: 4,
          justifyContent: 'center',
          alignItems: 'center',
          marginVertical: 10,
          marginLeft: 10,
        }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '500',
            color: theme.colors.secondary,
            fontFamily: 'Vazirmatn',
            //padding: 10,
          }}>
          {i + 1}
        </Text>
      </View>
      <View
        style={{
          borderRadius: 4,
          justifyContent: 'center',
          alignItems: 'center',
          marginVertical: 10,

          marginLeft: 10,
        }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '500',
            // marginBottom: 20,
            //justifyContent: 'flex-start',
            fontFamily: 'Vazirmatn',
            color: theme.colors.secondary,
            //padding: 10,
          }}>
          {item.name}
        </Text>
      </View>
    </View>
  );
}

export default DailyWorkloutListComponent;
