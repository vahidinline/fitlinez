import { BottomSheet, Icon, Text, useTheme } from '@rneui/themed';
import React, { useState } from 'react';
import { Dimensions, FlatList, TouchableOpacity, View } from 'react-native';
import { Chip } from 'react-native-paper';

function Filters({ data, name, icon, numColumns, setListOffilters }) {
  const { theme } = useTheme();
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <View
      style={{
        height: '15%',
      }}>
      <View
        style={{
          flexDirection: 'row',
          top: 10,
          marginBottom: 10,
          backgroundColor: theme.colors.background,
        }}>
        {icon}
        <Text
          style={{
            fontSize: 20,
            color: theme.colors.secondary,
            marginHorizontal: 10,
            marginVertical: 3,
          }}>
          {name}
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'column',
          backgroundColor: theme.colors.background,
        }}>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                marginHorizontal: 5,
                borderRadius: 8,
                borderWidth: 0.3,
                marginVertical: 5,
                backgroundColor:
                  selectedItem === item.id
                    ? theme.colors.lightPrimary
                    : theme.colors.background,
                padding: 5,
                borderColor: theme.colors.borderColor,
                width: Dimensions.get('window').width / numColumns - 20,
              }}
              onPress={() => {
                setSelectedItem(item.id);
                setListOffilters(item.name);
              }}>
              {item?.icon}
              <Text
                style={{
                  color: theme.colors.secondary,
                  fontSize: 12,
                  marginHorizontal: 5,
                  top: 0,
                }}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
        />
      </View>
    </View>
  );
}

export default Filters;
