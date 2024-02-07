import { Text } from 'react-native';
import { View } from 'react-native';
import LottieView from 'lottie-react-native';
import { Button } from '@rneui/base';
import { useNavigation } from '@react-navigation/native';
const Rest = (props) => {
  const navigation = useNavigation();
  console.log(props);
  return (
    <View>
      <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
        <View>
          <Text
            style={{
              color: '#fff',
              fontSize: 20,
              flexWrap: 'wrap',
              padding: 10,
            }}>
            Recovery after a workout is just as important as the workout itself.
            During a workout, you are putting stress on your muscles, which
            causes them to break down. Recovery allows your body to repair and
            rebuild those muscles, so they can grow stronger and be ready for
            your next workout
          </Text>
        </View>
        <Button onPress={() => navigation.goBack()} title="Go to Daily Plan" />
      </View>
    </View>
  );
};

export default Rest;
