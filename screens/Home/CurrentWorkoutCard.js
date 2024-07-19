import { Text, useTheme } from '@rneui/themed';
import React, { useContext } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import LanguageContext from '../../api/langcontext';
import i18nt from '../../locales';
import { I18n } from 'i18n-js';
import AuthContext from '../../api/context';
import UserPrivilegeContext from '../../api/userPrivilegeContext';
import DailyTaskIndex from '../DailyTasks/DailyTaskIndex';
import { IconEdit } from '../marketplace/filters/icons';

function CurrentWorkoutCard({
  title,
  location,
  RTL,
  taskStatus,
  setTaskStatus,
}) {
  // console.log('taskStatus in current', taskStatus);
  const { userPrivilege, setUserPrivilege } = useContext(UserPrivilegeContext);
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
            height: Dimensions.get('window').height / 4.5,
          },
        ]}
      />
      <View
        style={{
          direction: RTL ? 'rtl' : 'ltr',
          flexDirection: 'row',
          // justifyContent: 'space-between',
          alignItems: 'center',
          marginHorizontal: 10,
          marginTop: 10,
        }}>
        {title && (
          <Text
            style={{
              fontSize: 12,
              fontFamily: 'Vazirmatn',
              marginHorizontal: 10,
              marginTop: 5,
              color: 'white',
            }}>
            {i18n.t('yourWorkoutPlan')} : {title}
          </Text>
        )}
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('WorkoutListIndex');
          }}>
          <IconEdit color={theme.colors.white} size={24} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          position: 'absolute',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginHorizontal: 10,
          marginTop: 45,
        }}>
        <DailyTaskIndex
          title={title}
          location={location}
          taskStatus={taskStatus}
          setTaskStatus={setTaskStatus}
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
    marginHorizontal: 17,
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
