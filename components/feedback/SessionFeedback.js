import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Slider, Text, Icon, Overlay, Button, useTheme } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { sendUserFeedback } from '../../api/userFeedback';
import LanguageContext from '../../api/langcontext';
import i18nt from '../../locales';
import { I18n } from 'i18n-js';

const SessionFeedback = ({
  userId,
  showFeedback,
  source,
  setShowFeedback,
  category,
  location,
  timeSpent,
  performance,
  totalWeightSum,
}) => {
  const { theme } = useTheme();
  const [value, setValue] = useState(8);
  const [feedback, setFeedback] = useState('');
  const [buttontitle, setButtonTitle] = useState('');
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const navigation = useNavigation();
  useEffect(() => {
    if (value < 3) {
      setFeedback(`${i18n.t('notsatified')}`);
    } else if (value < 6) {
      setFeedback(`${i18n.t('neutral')}`);
    } else {
      setFeedback(`${i18n.t('satisfied')}`);
    }
  }, [value]);

  useEffect(() => {
    setButtonTitle(
      source === 'share' ? `${i18n.t('share')}` : `${i18n.t('home')}`
    );
  }, [source]);

  const interpolate = (start, end) => {
    let k = (value - 0) / 10; // 0 =>min  && 10 => MAX
    return Math.ceil((1 - k) * start + k * end) % 256;
  };

  const goHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  const goShare = () => {
    navigation.navigate('FinishWorkOut', {
      timeSpent: timeSpent,
      totalWeightSum: totalWeightSum,
      performance: performance,
      category: category,
      location: location,
    });
  };

  const submitfeedback = () => {
    setShowFeedback(false);
    if (source === 'home') {
      sendUserFeedback({
        userId,
        category,
        location,
        timeSpent,
        value,
        performance,
      });
      goHome();
    } else {
      setShowFeedback(false);
      sendUserFeedback({
        userId: userId,
        category: category,
        location: location,
        timeSpent: timeSpent,
        value: value,
        performance: performance,
      });
      goShare();
    }
  };

  const color = () => {
    let r = interpolate(255, 0);
    let g = interpolate(0, 255);
    let b = interpolate(0, 0);
    return `rgb(${r},${g},${b})`;
  };

  const icons = (value) => {
    //change icon by value
    if (value < 3) {
      return 'emoticon-sad-outline';
    } else if (value < 6) {
      return 'emoticon-neutral-outline';
    } else {
      return 'emoticon-happy-outline';
    }
  };

  return (
    <Overlay
      visible={showFeedback}
      style={{}}
      onBackdropPress={() => setShowFeedback(false)}>
      <View style={[styles.contentView]}>
        <Slider
          value={value}
          onValueChange={setValue}
          maximumValue={10}
          minimumValue={0}
          step={1}
          allowTouchTrack
          trackStyle={{ height: 5, backgroundColor: 'transparent' }}
          thumbStyle={{
            height: 20,
            width: 20,
            backgroundColor: 'transparent',
          }}
          thumbProps={{
            children: (
              <Icon
                name={icons(value)}
                type="material-community"
                size={20}
                reverse
                containerStyle={{ bottom: 20, right: 20 }}
                color={color()}
              />
            ),
          }}
        />
        <Text style={{ paddingTop: 20 }}> {feedback}</Text>
        <Button
          buttonStyle={{ marginTop: 20, backgroundColor: theme.colors.orange }}
          titleStyle={{
            color: theme.colors.secondary,
          }}
          onPress={() => submitfeedback()}>
          {buttontitle}
        </Button>
      </View>
    </Overlay>
  );
};

const styles = StyleSheet.create({
  contentView: {
    padding: 20,
    width: Dimensions.get('window').width - 50,
    justifyContent: 'center',
    // alignItems: 'stretch',
  },

  subHeader: {
    backgroundColor: '#2089dc',
    color: 'white',
    textAlign: 'center',
    paddingVertical: 5,
    marginBottom: 10,
  },
});

export default SessionFeedback;
