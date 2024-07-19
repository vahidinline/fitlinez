import { View, Text, TextInput, Button } from 'react-native';
import { createRealmContext } from '@realm/react';
import { realmWorkOutConfig } from '../../database/Models/workout';
import { useEffect, useState } from 'react';

const { RealmProvider, useRealm, useObject, useQuery } =
  createRealmContext(realmWorkOutConfig);

const TotalWeight = () => {
  const realm = useRealm();
  const [totalWeight, setTotalWeight] = useState(0);
  const [workoutName, setWorkoutName] = useState('');

  useEffect(() => {
    const totalWeight = realm.objects('TotalWeight');
    setTotalWeight(totalWeight);
  }, [realm]);

  return (
    <View>
      <Text>total weight</Text>
    </View>
  );
};

const ShowTotalWeight = () => {
  return (
    <RealmProvider realm={realmWorkOutConfig}>
      <TotalWeight />
    </RealmProvider>
  );
};

export default ShowTotalWeight;
