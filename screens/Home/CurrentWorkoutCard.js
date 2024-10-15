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
import HasWorkoutCard from './hasWorkout';

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

  return (
    <View>
      <HasWorkoutCard
        title={title}
        location={location}
        userPrivilege={userPrivilege}
      />
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
    fontSize: 14,
    fontFamily: 'Vazirmatn',
    //fontWeight: 'bold',
    // color: 'white',
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 12,
    //paddingTop: 15,
    width: Dimensions.get('window').width / 1.2,
    marginHorizontal: 15,
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: Dimensions.get('window').height / 15,
    alignSelf: 'center',
  },
});
export default CurrentWorkoutCard;
