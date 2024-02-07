import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { TouchableOpacity, View } from 'react-native';
import AuthContext from '../../api/context';
import AnimatedLottieView from 'lottie-react-native';

function Upgrade() {
  const { userAuth, setUserAuth } = useContext(AuthContext);
  const userLevel = userAuth.level;
  const navigation = useNavigation();

  return (
    <View>
      {userLevel !== 4 && (
        <TouchableOpacity
          style={{
            //center
            alignItems: 'center',
          }}
          onPress={() => navigation.navigate('Upgrade')}></TouchableOpacity>
      )}
    </View>
  );
}

export default Upgrade;
