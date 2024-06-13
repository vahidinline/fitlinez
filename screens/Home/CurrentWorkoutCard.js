import { Button, LinearProgress, Text, useTheme } from '@rneui/themed';
import React, { useContext } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  PixelRatio,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CurrentCard from './homeCard/CurrentCard';
import { useNavigation } from '@react-navigation/native';
import { IconArrow, IconBlackDumbbell } from '../marketplace/filters/icons';
import LanguageContext from '../../api/langcontext';
import i18nt from '../../locales';
import { I18n } from 'i18n-js';
import { readWorkoutPercentageData } from '../../api/readWorkoutData';
import { useState } from 'react';
import { useEffect } from 'react';
import AuthContext from '../../api/context';
import UserPrivilegeContext from '../../api/userPrivilegeContext';
import StartSessionIndexHome from '../Sessions/StartSessionIndexHome';
import { IconTrainer } from '../marketplace/filters/icons';
import PlanPlus from '../../components/newPlan';

function CurrentWorkoutCard({ title, trainer, location }) {
  const [percentage, setPercentage] = useState(0);
  const { userPrivilege, setUserPrivilege } = useContext(UserPrivilegeContext);
  useEffect(() => {
    readWorkoutPercentageData(title).then((data) => {
      setPercentage(data?.percentage ? data.percentage : 0);
    });
  }, []);

  const { theme } = useTheme();
  const navigation = useNavigation();
  const { userLanguage } = useContext(LanguageContext);
  const { userAuth } = useContext(AuthContext);
  const userLevel = userAuth.level;
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;

  const handleNextStep = () => {
    if (userLevel === 4) {
      // condition 1
      navigation.navigate('SessionNavigator', {
        screen: 'StartSessionIndex',
        params: { title: title, location: location },
      });
    } else if (userPrivilege) {
      // condition 1
      navigation.navigate('SessionNavigator', {
        screen: 'StartSessionIndex',
        params: { title: title, location: location },
      });
    } else {
      // condition 2
      navigation.navigate('Upgrade');
    }
  };

  return (
    <View style={[styles.container]}>
      <LinearGradient
        colors={['#5B5891', '#3A366F', '#17124A']}
        style={[
          styles.background,
          {
            height:
              PixelRatio.get() < 3
                ? Dimensions.get('window').height / 3.8
                : Dimensions.get('window').height / 4.5,
          },
        ]}
      />
      <View
        style={{
          flexDirection: 'row',
          // justifyContent: 'space-between',
          marginHorizontal: 20,
          top: 10,

          //alignItems: 'center',
          width: Dimensions.get('window').width / 1.2,
          height: Dimensions.get('window').height / 13,
          // marginHorizontal: 20,
        }}>
        <Text
          style={[styles.text, { fontSize: PixelRatio.get() < 3 ? 14 : 18 }]}>
          {title}
        </Text>
        <Pressable onPress={() => navigation.navigate('PlanDetailsIndex')}>
          <IconArrow size={24} color={theme.colors.white} />
        </Pressable>
      </View>
      <View
        style={{
          position: 'absolute',
          top: 20,
          right: 5,
          flexDirection: 'row',
        }}>
        <CurrentCard
          index={1}
          title={title}
          icon={<IconBlackDumbbell color="#fff" />}
          subtitle={i18n.t('todaysactivity')}
          component={
            <Button
              onPress={() => handleNextStep(userAuth.date)}
              titleStyle={{
                color: theme.colors.primary,
                fontSize: PixelRatio.get() < 3 ? 10 : 14,
                fontWeight: '500',
                fontFamily: 'Vazirmatn',
                marginVertical: 5,
              }}
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    //
    // flex: 1,
    width: Dimensions.get('window').width / 1.1,
    marginHorizontal: 20,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
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
export default CurrentWorkoutCard;
