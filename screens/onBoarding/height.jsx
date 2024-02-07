import { Picker } from '@react-native-picker/picker';
import { Button, ButtonGroup, Text, useTheme } from '@rneui/themed';
import React, { useContext, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import CM from './heightPicker/cm';
import Inch from './heightPicker/inch';
import { useState } from 'react';
import { UnitContext } from '../../api/unitContext';
import { Svg, Path } from 'react-native-svg';

function HeightSelection({ onHeightSelect, i18n }) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { unit, setUnit } = useContext(UnitContext);
  const messureUnit = unit[0].massureUnit;

  //console.log(selectedIndex);
  //create a data state of age

  const unitHandler = (selectedIndex) => {
    // Assuming you want to update the first object in the array
    if (selectedIndex === 1) {
      setUnit((prevArray) => {
        return prevArray.map((unitItem, index) => {
          // Update the desired object here
          if (index === 0) {
            return { ...unitItem, massureUnit: 'english' };
          }
          return unitItem;
        });
      });
    } else {
      setUnit((prevArray) => {
        return prevArray.map((unitItem, index) => {
          // Update the desired object here
          if (index === 0) {
            return { ...unitItem, massureUnit: 'metric' };
          }
          return unitItem;
        });
      });
    }
  };

  useEffect(() => {
    unitHandler(selectedIndex);
  }, [selectedIndex, messureUnit]);

  return (
    <View>
      <Text style={styles.title}>{i18n.t('height')}</Text>
      <View>
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
          buttons={['cm', 'ft']}
          selectedIndex={selectedIndex}
          onPress={(value) => {
            setSelectedIndex(value);
          }}
        />
      </View>
      <View style={styles.container}>
        {messureUnit === 'metric' ? (
          <CM setHeight={onHeightSelect} />
        ) : (
          <Inch setHeight={onHeightSelect} />
        )}
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
    },
    title: {
      color: theme.colors.secondary,
      fontSize: 20,
      fontWeight: 'bold',
      justifyContent: 'center',
      alignSelf: 'center',
      marginBottom: 100,
    },
  });

export default HeightSelection;
