import { Button, LinearProgress, Text, useTheme } from '@rneui/themed';
import React, { useContext } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CurrentCard from './homeCard/CurrentCard';
import { useNavigation } from '@react-navigation/native';
import { IconBlackDumbbell, IconTrainer } from '../marketplace/filters/icons';
import LanguageContext from '../../api/langcontext';
import i18nt from '../../locales';
import { I18n } from 'i18n-js';
import { readWorkoutPercentageData } from '../../api/readWorkoutData';
import { useState } from 'react';
import { useEffect } from 'react';
import AuthContext from '../../api/context';
import UserPrivilegeContext from '../../api/userPrivilegeContext';

function NoWorkoutCard({ title, trainer, location }) {
  // console.log('location in current', location);
  const [percentage, setPercentage] = useState(0);
  const { userPrivilege, setUserPrivilege } = useContext(UserPrivilegeContext);

  const { theme } = useTheme();
  const navigation = useNavigation();
  const { userLanguage } = useContext(LanguageContext);
  const { userAuth } = useContext(AuthContext);
  const userLevel = userAuth.level;
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;

  //   const handleNextStep = () => {
  //     if (userLevel === 4) {
  //       // condition 1
  //       navigation.navigate('PlanPlus', {
  //         screen: 'planPlusIndex',
  //         params: { title: title, location: location },
  //       });
  //     } else if (userPrivilege) {
  //       // condition 1
  //       navigation.navigate('PlanPlus', {
  //         screen: 'planPlusIndex',
  //         params: { title: title, location: location },
  //       });
  //     } else {
  //       // condition 2
  //       navigation.navigate('Upgrade');
  //     }
  //   };

  return (
    <View
      style={[
        styles.container,
        { direction: userLanguage === 'fa' ? 'rtl' : 'ltr' },
      ]}>
      <LinearGradient
        colors={['#5B5891', '#3A366F', '#17124A']}
        style={styles.background}
      />
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'space-between',
          marginHorizontal: 20,
          alignItems: 'center',
          marginTop: 20,
          width: Dimensions.get('window').width / 1.1,
          height: Dimensions.get('window').height / 14,
          // marginHorizontal: 20,
        }}>
        <Text style={[styles.text]}>{i18n.t('noPlanSelectedTitle')}</Text>
        <Text style={[styles.text, { fontSize: 16 }]}>
          {i18n.t('noPlanSelectedSubTitle')}
        </Text>
      </View>
      <View
        style={{
          position: 'absolute',
          top: 50,
          right: 5,
          flexDirection: 'row',
        }}>
        <CurrentCard
          index={2}
          title={title}
          //icon={<IconBlackDumbbell />}
          subtitle={i18n.t('todaysactivity')}
          component={
            <Button
              disabled
              //onPress={() => handleNextStep(userAuth.date)}
              buttonStyle={{
                borderRadius: 8,
                backgroundColor: theme.colors.button,
                borderWidth: 1,
                borderColor: theme.colors.border,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {i18n.t('letsstart')}
            </Button>
          }
        />
        <CurrentCard
          index={1}
          //title={trainer}
          subtitle={i18n.t('progress')}
          // icon={<IconTrainer />}
          component={
            <View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  alignSelf: 'center',
                  color: theme.colors.secondary,
                }}>
                {`${isNaN(percentage) ? 0 : percentage}`} %
              </Text>
              <LinearProgress
                value={isNaN(percentage) ? 0 : percentage / 100}
                style={{ marginTop: 10 }}
              />
            </View>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //alignItems: 'center',
    // justifyContent: 'center',
    width: Dimensions.get('window').width / 1.1,
    //height: Dimensions.get('window').height / 3,
    marginHorizontal: 20,
    // backgroundColor: 'orange',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: Dimensions.get('window').height / 4.2,
    borderRadius: 16,
  },
  button: {
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
});
export default NoWorkoutCard;