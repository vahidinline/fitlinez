import React, { useEffect } from 'react';
import { Dimensions, FlatList, View } from 'react-native';
import RadioButtonfitlinez from '../../components/RadioButtonFitlinez';
import SimpleRadioButton from '../../components/simpleRadioButton';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

function AdditionalIndex() {
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
      name: 'Shoulder Pain',
      value: 'shoulder pain',
    },
    {
      id: 2,
      name: 'Knee Pain',
      value: 'knee pain',
    },
    {
      id: 3,
      name: 'Back Pain',
      value: 'back pain',
    },
    {
      id: 4,
      name: 'Neck Pain',
      value: 'neck pain',
    },
    {
      id: 5,
      name: 'Elbow Pain',
      value: 'elbow pain',
    },
    {
      id: 6,
      name: 'Wrist Pain',
      value: 'wrist pain',
    },
    {
      id: 7,
      name: 'Hip Pain',
      value: 'hip pain',
    },
    {
      id: 8,
      name: 'Ankle Pain',
      value: 'ankle pain',
    },
  ];
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: Dimensions.get('window').width,
        marginBottom: 0,
        borderRadius: 10,
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
