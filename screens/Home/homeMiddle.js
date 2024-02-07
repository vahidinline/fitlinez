import { Button, Divider, Text, useTheme } from '@rneui/themed';
import AnimatedLottieView from 'lottie-react-native';
import React, { useContext, useState } from 'react';
import { Dimensions, Platform, View } from 'react-native';
import { I18n } from 'i18n-js';
import i18nt from '../../locales';
import LanguageContext from '../../api/langcontext';
import { useNavigation } from '@react-navigation/native';
import { WorkoutAgenda, ProgressCircleBar } from '../Agenda';
import { BarCharts } from '../../components/Charts/barCharts';
import { Agenda } from 'react-native-calendars';
import WorkoutList from '../Agenda/List';

function HomeMiddle(props) {
  const { data, setSelectedIndex } = props;
  const { theme } = useTheme();
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const navigation = useNavigation();
  const Userplatform = Platform.OS;

  const CustomTitle = () => {
    return (
      <View style={{ flexDirection: 'column' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'white' }}>
          {i18n.t('workout')}
        </Text>
      </View>
    );
  };

  return (
    <View flexDirection="column">
      <View
        style={{
          flexDirection: 'column',
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
        }}>
        <WorkoutList
          name={data?.name}
          img={data?.image}
          setSelectedIndex={setSelectedIndex}
          durationWeeks={data?.duration}
          sessionPerWeek={data?.DaysPerWeek}
          workoutData={data?.data?.map(({ day, title }) => ({
            day,
            title,
          }))}
        />
      </View>
    </View>
  );
}

export default HomeMiddle;
