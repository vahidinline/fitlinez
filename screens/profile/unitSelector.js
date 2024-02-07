import { ButtonGroup, Icon, Text, useTheme } from '@rneui/themed';
import React from 'react';
import { useContext } from 'react';
import { UnitContext } from '../../api/unitContext';
import { useState } from 'react';
import { Dimensions, FlatList, SafeAreaView, View } from 'react-native';
import LanguageContext from '../../api/langcontext';
import i18nt from '../../locales';
import { I18n } from 'i18n-js';
import { Svg, Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/header';

function UnitSelector() {
  const [weightSelectedIndex, setWeightSelectedIndex] = useState(0);
  const [heightSelectedIndex, setHeightSelectedIndex] = useState(0);
  const { unit, setUnit } = useContext(UnitContext);
  const { theme } = useTheme();
  const { userLanguage, setUserLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  const navigation = useNavigation();
  i18n.locale = userLanguage;

  const handleUnitChange = () => {
    setUnit({
      weight: weightSelectedIndex,
      height: heightSelectedIndex,
    });
  };

  const items = [
    {
      id: 1,
      name: ['cm', 'ft'],
      value: heightSelectedIndex,
      func: setHeightSelectedIndex,
    },
    {
      id: 2,
      name: ['kg', 'lb'],
      value: weightSelectedIndex,
      func: setWeightSelectedIndex,
    },
  ];
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          backgroundColor: theme.colors.background,
          height: Dimensions.get('window').height,

          //justifyContent: 'center',
          // alignItems: 'center',
          //alignContent: 'center',
        }}>
        <Header title={i18n.t('unit')} />

        <FlatList
          data={items}
          renderItem={({ item }) => {
            return (
              <ButtonGroup
                containerStyle={{
                  width: Dimensions.get('window').width / 1.1,
                  height: Dimensions.get('window').height / 11,
                  alignSelf: 'center',
                  marginBottom: 20,
                  borderRadius: 24,
                  backgroundColor: theme.colors.buttonBackground,
                  borderColor: theme.colors.buttonBackground,
                }}
                buttonContainerStyle={{
                  width: '50%',
                  borderRadius: 7,
                  borderBlockColor: theme.colors.buttonBackground,
                  borderColor: theme.colors.buttonBackground,
                }}
                selectedButtonStyle={{
                  backgroundColor: theme.colors.secondary,
                  margin: 10,
                  borderRadius: 16,
                  borderColor: theme.colors.buttonBackground,
                }}
                buttons={item.name}
                selectedIndex={item.value}
                onPress={(value) => {
                  console.log('item.value:', item.value);
                  console.log('value:', value);
                  item.func(value);
                }}
              />
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}

export default UnitSelector;
