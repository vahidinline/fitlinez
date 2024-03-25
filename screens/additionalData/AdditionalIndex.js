import React, { useEffect } from 'react';
import { Dimensions, FlatList, View } from 'react-native';
import RadioButtonfitlinez from '../../components/RadioButtonFitlinez';
import SimpleRadioButton from '../../components/simpleRadioButton';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

function AdditionalIndex({ i18n, isRTL }) {
  const [userPain, setUserPain] = useState('');

  useEffect(() => {
    console.log('userPain', userPain);
    try {
      if (userPain) {
        AsyncStorage.setItem('userPain', userPain);
      }
    } catch (error) {
      console.log('error', error);
    }
  }, [userPain]);

  const pains = [
    {
      id: 1,
      name: i18n.t('ShoulderPain'),
      value: i18n.t('ShoulderPain'),
    },
    {
      id: 2,
      name: i18n.t('KneePain'),
      value: i18n.t('KneePain'),
    },
    {
      id: 3,
      name: i18n.t('BackPain'),
      value: i18n.t('BackPain'),
    },
    {
      id: 4,
      name: i18n.t('NeckPain'),
      value: i18n.t('NeckPain'),
    },
    {
      id: 5,
      name: i18n.t('ElbowPain'),
      value: i18n.t('ElbowPain'),
    },
    {
      id: 6,
      name: i18n.t('WristPain'),
      value: i18n.t('WristPain'),
    },
    {
      id: 7,
      name: i18n.t('HipPain'),
      value: i18n.t('HipPain'),
    },
    {
      id: 8,
      name: i18n.t('AnklePain'),
      value: i18n.t('AnklePain'),
    },
  ];
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: Dimensions.get('window').width / 1.1,
        marginBottom: 0,
        borderRadius: 10,
        direction: isRTL ? 'rtl' : 'ltr',
        marginHorizontal: 10,
      }}>
      <FlatList
        data={pains}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              marginHorizontal: 10,
            }}>
            <SimpleRadioButton
              selected={userPain === item.value}
              label={item.name}
              onSelect={() => setUserPain(item.value)}
            />
          </View>
        )}
      />
    </View>
  );
}

export default AdditionalIndex;
