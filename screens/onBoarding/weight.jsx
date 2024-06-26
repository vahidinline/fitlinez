import { Picker } from '@react-native-picker/picker';
import { Button, ButtonGroup, Text, useTheme } from '@rneui/themed';
import React, { useContext, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { UnitContext } from '../../api/unitContext';

function WeightSelection({ onWeightSelect, i18n }) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [selectedValue, setSelectedValue] = React.useState('70');
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const { unit, setUnit } = useContext(UnitContext);
  const weightUnit = unit[0].weightUnit;
  const weightKG = Array.from({ length: 200 }, (_, i) => i + 15);
  const weightLB = Array.from({ length: 300 }, (_, i) => i + 15);
  //create a data state of age

  useEffect(() => {
    onWeightSelect({
      weight: selectedValue,
      unit: unit[0].weightUnit,
    });
  }, [selectedValue]);

  const unitHandler = (selectedIndex) => {
    // Assuming you want to update the first object in the array
    if (selectedIndex === 1) {
      setUnit((prevArray) => {
        return prevArray.map((unitItem, index) => {
          // Update the desired object here
          if (index === 0) {
            return { ...unitItem, weightUnit: 'lb' };
          }
          return unitItem;
        });
      });
    } else {
      setUnit((prevArray) => {
        return prevArray.map((unitItem, index) => {
          // Update the desired object here
          if (index === 0) {
            return { ...unitItem, weightUnit: 'kg' };
          }
          return unitItem;
        });
      });
    }
  };

  useEffect(() => {
    unitHandler(selectedIndex);
  }, [selectedIndex, weightUnit]);

  return (
    <View>
      <Text style={styles.title}>{i18n.t('weight')}</Text>
      {/* <View>
        <ButtonGroup
          containerStyle={{
            width: '30%',
            alignSelf: 'center',
            marginBottom: 20,
            borderRadius: 8,
            // borderColor: theme.colors.secondary,
          }}
          buttonContainerStyle={{
            width: '50%',
            borderRadius: 7,
            borderColor: theme.colors.background,
          }}
          selectedButtonStyle={{
            backgroundColor: theme.colors.secondary,
            margin: 5,
            borderRadius: 7,
            //borderColor: theme.colors.secondary,
          }}
          buttons={['kg', 'lb']}
          selectedIndex={selectedIndex}
          onPress={(value) => {
            setSelectedIndex(value);
          }}
        />
      </View> */}
      <View style={styles.container}>
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
          {selectedIndex === 0
            ? weightKG.map((item, index) => {
                return (
                  <Picker.Item
                    color={theme.colors.secondary}
                    key={index}
                    label={`${item.toString()} kg`}
                    value={item.toString()}
                  />
                );
              })
            : weightLB.map((item, index) => {
                return (
                  <Picker.Item
                    color={theme.colors.secondary}
                    key={index}
                    label={`${item.toString()} lb`}
                    value={item.toString()}
                  />
                );
              })}
        </Picker>
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
      fontSize: 20,
      fontWeight: 'bold',
      justifyContent: 'flex-start',
      fontFamily: 'Vazirmatn',
    },
    title: {
      color: theme.colors.secondary,
      fontSize: 20,
      fontWeight: 'bold',
      justifyContent: 'center',
      alignSelf: 'center',
      marginBottom: 100,
      fontFamily: 'Vazirmatn',
    },
  });

export default WeightSelection;
