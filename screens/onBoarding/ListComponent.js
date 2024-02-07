import { Button, Text, useTheme } from '@rneui/themed';
import React, { useState } from 'react';
import { Dimensions, FlatList, StyleSheet, View } from 'react-native';
import { Card } from 'react-native-paper';

function ListComponent({ data, isSelected, onSelect }) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [selectedIds, setSelectedIds] = useState([]);
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <Card
          style={[
            {
              backgroundColor: theme.colors.white,
              borderColor: theme.colors.secondary,
              borderWidth: 0.3,
              borderRadius: 16,
              width: Dimensions.get('window').width / 1.1 - 20,
              height: 65,
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
          onPress={() => onSelect({ id: item.id, title: item.title })}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              alignContent: 'center',
              alignItems: 'center',
              top: 20,
              marginLeft: 10,
            }}>
            {item.icon && (
              <item.icon
                style={[
                  styles.icon,
                  {
                    color: theme.colors.secondary,
                  },
                ]}
              />
            )}
            <Text style={styles.text}>{item.title}</Text>
          </View>
        </Card>
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
    },
    title: {
      color: theme.colors.black,
      fontSize: 20,
      fontWeight: 'bold',
      justifyContent: 'center',
      alignSelf: 'center',
      marginBottom: 100,
    },
    selectedItem: {
      borderColor: theme.colors.secondary,
      backgroundColor: theme.colors.selected,
      borderWidth: 2,
    },
  });

export default ListComponent;
