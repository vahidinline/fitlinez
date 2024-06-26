import { Button, Text } from '@rneui/base';
import React, { useContext } from 'react';
import { Dimensions, SafeAreaView } from 'react-native';
import { forceSolveError, clearAllAsyncCache } from '../../api/forceSolveError';
import AuthContext from '../../api/context';

const ErrorIndex = (i18n, theme) => {
  const { setUserAuth } = useContext(AuthContext);
  return (
    <SafeAreaView>
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          textAlign: 'center',
          marginTop: 200,
          fontFamily: 'Vazirmatn',
        }}>
        An Error Occurred
      </Text>

      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          textAlign: 'center',
          marginTop: 200,
          fontFamily: 'Vazirmatn',
        }}></Text>
      <Button
        buttonStyle={{
          marginTop: 20,
          marginHorizontal: 20,
          width: Dimensions.get('window').width - 40,
          borderRadius: 10,
          justifyContent: 'center',
        }}
        titleStyle={{
          color: '#fff',
          fontSize: 15,
          fontWeight: 'bold',
          fontFamily: 'Vazirmatn',
        }}
        color="primary"
        onPress={() => forceSolveError(setUserAuth)}
        size="lg"
        title="try again"
      />
    </SafeAreaView>
  );
};

export default ErrorIndex;
