import { Button, LinearProgress, Text, useTheme } from '@rneui/themed';
import React, { useContext } from 'react';
import { View, StyleSheet, Dimensions, PixelRatio } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CurrentCard from './homeCard/CurrentCard';
import { useNavigation } from '@react-navigation/native';
import { IconBlackDumbbell, IconTrainer } from '../marketplace/filters/icons-';
import LanguageContext from '../../api/langcontext';
import i18nt from '../../locales';
import { I18n } from 'i18n-js';
import {
  readWorkoutData,
  readWorkoutPercentageData,
} from '../../api/readWorkoutData';
import { useState } from 'react';
import { useEffect } from 'react';
import AuthContext from '../../api/context';
import UserPrivilegeContext from '../../api/userPrivilegeContext';

function NoWorkoutCard({ title, trainer, packages }) {
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
    <View style={[styles.container]}>
      <LinearGradient
        colors={['#5B5891', '#3A366F', '#17124A']}
        style={styles.background}
      />
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'space-between',
          //marginHorizontal: 20,
          alignItems: 'center',
          marginTop: 20,
          width: Dimensions.get('window').width / 1.1,
          height: Dimensions.get('window').height / 15,
          // marginHorizontal: 20,
        }}>
        <Text style={[styles.text]}>{i18n.t('noPlanSelectedTitle')}</Text>
        <Text style={[styles.text, { fontSize: 14 }]}>
          {i18n.t('noPlanSelectedSubTitle')}
        </Text>
      </View>
      <View
        style={{
          top: 30,
          // justifyContent: 'center',
          // // alignItems: 'center',
          // flexDirection: 'column',
        }}>
        <Button
          onPress={() =>
            navigation.navigate('MarketPlace', {
              packages: packages,
            })
          }
          titleStyle={{
            color: theme.colors.text,
            fontSize: PixelRatio.get() < 3 ? 10 : 14,
            fontWeight: '500',
          }}
          buttonStyle={{
            borderRadius: 8,
            backgroundColor: theme.colors.primary,
            borderWidth: 1,
            borderColor: theme.colors.border,

            //top: 20,
            marginHorizontal: 15,
            height: 40,
            width: Dimensions.get('window').width / 1.2,
          }}>
          {i18n.t('showAllPlans')}
        </Button>

        {/* <CurrentCard
          index={1}
          title={trainer}
          // subtitle="No Data? try again"
          component={
            null
            // <Button
            //   onPress={() => readWorkoutData()}
            //   titleStyle={{
            //     color: theme.colors.primary,
            //     fontSize: PixelRatio.get() < 3 ? 10 : 14,
            //     fontWeight: '500',
            //   }}
            //   buttonStyle={{
            //     borderRadius: 8,
            //     backgroundColor: theme.colors.button,
            //     borderWidth: 1,
            //     borderColor: theme.colors.border,
            //     justifyContent: 'center',
            //     alignItems: 'center',
            //   }}>
            //   Reload
            // </Button>
          }
        /> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    //alignItems: 'center',
    // justifyContent: 'center',
    width: Dimensions.get('window').width / 1.1,
    height: Dimensions.get('window').height / 12,
    marginHorizontal: 20,
    marginTop: 20,
    zIndex: 1000,
    // backgroundColor: 'orange',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: Dimensions.get('window').height / 5,
    borderRadius: 16,
  },
  button: {
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    //marginLeft: 10,
    justifyContent: 'flex-start',
  },
});
export default NoWorkoutCard;
