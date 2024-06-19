import { Button, Text } from '@rneui/base';
import React from 'react';
import { Dimensions, SafeAreaView } from 'react-native';
import { forceSolveError, clearAllAsyncCache } from '../../api/forceSolveError';

const ErrorIndex = (i18n, theme) => {
  console.log('i18n', i18n);
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
        {i18n.t('errorTitle')}
      </Text>

      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          textAlign: 'center',
          marginTop: 200,
          fontFamily: 'Vazirmatn',
        }}>
        {/* {i18n.t('errorMessage')} */}
      </Text>
      <Button
        buttonStyle={{
          marginTop: 20,
          marginHorizontal: 20,
          width: Dimensions.get('window').width - 40,
          borderRadius: 10,
          justifyContent: 'center',
        }}
        titleStyle={{
          color: '#000',
          fontSize: 15,
          fontWeight: 'bold',
          fontFamily: 'Vazirmatn',
        }}
        color="primary"
        onPress={() => forceSolveError()}
        size="lg"
        title="{i18n.t('errorButtonTitle')}"
      />
    </SafeAreaView>
  );
};

export default ErrorIndex;
