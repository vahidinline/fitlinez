import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Text, Button } from '@rneui/themed';
import { getWorkOutData } from '../../api/GetData';

const GetNewWorkout = ({ setReload }) => {
  const fetchData = async () => {
    const result = await getWorkOutData();
    if (result === true) {
      setReload(true);
    }
  };

  return (
    <View>
      <Button
        icon="refresh"
        onPress={() => fetchData()}
        style={{
          width: '70%',
          alignSelf: 'center',
          justifyContent: 'center',
          marginBottom: 10,
        }}>
        Get New Workout
      </Button>
    </View>
  );
};

export default GetNewWorkout;
