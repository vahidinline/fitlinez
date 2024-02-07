import { useNavigation } from '@react-navigation/native';
import { Button, useTheme } from '@rneui/themed';
import AnimatedLottieView from 'lottie-react-native';
import React, { useContext } from 'react';
import { Dimensions, Platform, View } from 'react-native';
import LanguageContext from '../../api/langcontext';
import i18nt from '../../locales';
import { I18n } from 'i18n-js';

function MiddleStart() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const Userplatform = Platform.OS;
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  return (
    <View
      style={{
        flexDirection: 'row',
      }}>
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.colors.primary,
          // height: 50,
        }}>
        <Button
          title={i18n.t('start')}
          loading={false}
          loadingProps={{ size: 'small', color: 'white' }}
          buttonStyle={{
            backgroundColor: theme.colors.secondary,
            borderRadius: 5,
          }}
          titleStyle={{
            fontSize: 15,
            fontWeight: 'bold',
            color: theme.colors.primary,
          }}
          icon={{
            name: 'arrow-right',
            type: 'font-awesome',
            size: 15,
            color: theme.colors.primary,
          }}
          containerStyle={{
            //  position: 'absolute',
            // top: 50,
            //left: 0,
            // marginHorizontal: 50,
            // height: 50,
            margin: 10,
            width: Dimensions.get('window').width / 2.2,

            zIndex: 100,
          }}
          onPress={() => navigation.navigate('packageNavigator')}
        />
        {Userplatform === 'ios' && (
          <Button
            title="Let AI choose for you"
            loading={false}
            loadingProps={{ size: 'small', color: 'white' }}
            buttonStyle={{
              backgroundColor: theme.colors.orange,
              borderRadius: 5,
            }}
            titleStyle={{
              fontSize: 15,
              fontWeight: 'bold',
              color: theme.colors.primary,
            }}
            containerStyle={{
              //  position: 'absolute',
              //top: 60,
              //left: 0,
              // marginHorizontal: 50,
              // height: 50,
              margin: 10,
              width: Dimensions.get('window').width / 2.2,

              zIndex: 100,
            }}
            onPress={() => navigation.navigate('GetUserData')}
          />
        )}
      </View>
    </View>
  );
}

export default MiddleStart;
