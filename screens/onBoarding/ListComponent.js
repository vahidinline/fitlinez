import { Button, Text, useTheme } from '@rneui/themed';
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import { Card } from 'react-native-paper';

function ListComponent({ data, isSelected, onSelect }) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [selectedIds, setSelectedIds] = useState([]);
  return (
    <FlatList
      scrollEnabled={true}
      data={data}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[
            {
              backgroundColor: theme.colors.white,
              borderColor: theme.colors.secondary,
              borderWidth: 0.3,
              borderRadius: 16,
              width: Dimensions.get('window').width / 1.1 - 20,
              height: 80,
              shadowColor: theme.colors.background,
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: 0,
              margin: 10,
              marginBottom: 10,
            },
            isSelected(item.id) && styles.selectedItem,
          ]}
          onPress={() =>
            onSelect({
              id: item.id,
              title: item.title,
              value: item.value,
            })
          }>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              //alignItems: 'center',
              alignContent: 'center',
              //alignItems: 'center',
              top: 20,
              //  marginLeft: 10,
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center',
                alignSelf: 'center',
                bottom: 5,
                left: 0,
              }}>
              {item.icon && <item.icon />}
            </View>
            <View
              style={{
                flexDirection: 'column',
              }}>
              <Text style={styles.text}>{item.title}</Text>

              {item.description && (
                <Text style={styles.description}>{item.description}</Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
      )}
      keyExtractor={(item) => item.id}
    />
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
      fontSize: 16,
      fontWeight: '500',
      marginLeft: 10,
      //justifyContent: 'flex-start',
      fontFamily: 'Vazirmatn',
    },
    title: {
      color: theme.colors.black,
      fontSize: 20,
      fontWeight: 'bold',
      justifyContent: 'center',
      alignSelf: 'center',
      marginBottom: 100,
      fontFamily: 'Vazirmatn',
    },
    description: {
      color: theme.colors.black,
      fontSize: 10,
      // fontWeight: 'bold',
      justifyContent: 'center',
      alignSelf: 'center',
      //marginBottom: 100,
      fontFamily: 'Vazirmatn',
    },
    selectedItem: {
      borderColor: theme.colors.secondary,
      backgroundColor: theme.colors.selected,
      borderWidth: 2,
    },
  });

export default ListComponent;
