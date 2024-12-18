import { Button, Text, useTheme } from '@rneui/themed';
import React, { useState } from 'react';
import { Dimensions, FlatList, StyleSheet, View } from 'react-native';
import { Card } from 'react-native-paper';
import { IconFemale, IconMale } from '../marketplace/filters/icons';

function GenderSelection({ onGenderSelect, i18n }) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [selectedIds, setSelectedIds] = useState([]);

  const data = [
    {
      id: 1,
      title: i18n.t('male'),
      icon: IconMale,
      value: 'male',
    },
    {
      id: 2,
      title: i18n.t('female'),
      icon: IconFemale,
      value: 'female',
    },
  ];

  const onSelect = ({ id, title, value }) => {
    setSelectedIds([id]);

    onGenderSelect({
      gender: value,
      id: id,
      value: title,
    });
  };
  const isSelected = (id) => selectedIds.includes(id);

  return (
    <View>
      <Text style={styles.title}>{i18n.t('gender')}</Text>
      <View style={styles.container}>
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
                  height: 70,
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
                onSelect({ id: item.id, title: item.title, value: item.value })
              }>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignContent: 'center',

                  // top: 15,
                  marginLeft: 10,
                }}>
                {/* <item.icon
                  style={[
                    styles.icon,
                    {
                      color: theme.colors.secondary,
                    },
                  ]}
                /> */}
                <Text style={styles.text}>{item.title}</Text>
              </View>
            </Card>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
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
      fontFamily: 'Vazirmatn',
      alignSelf: 'center',
      alignContent: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      top: 20,
      textTransform: 'capitalize',

      //justifyContent: 'flex-start',
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
    selectedItem: {
      borderColor: theme.colors.secondary,
      backgroundColor: theme.colors.selected,
      borderWidth: 2,
    },
  });

export default GenderSelection;
