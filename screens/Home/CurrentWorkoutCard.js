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

  return (
    <View style={[styles.container]}>
      <LinearGradient
        colors={['#5B5891', '#3A366F', '#17124A']}
        style={[
          styles.background,
          {
            height: Dimensions.get('window').height / 5,
          },
        ]}
      />
      <View
        style={{
          paddingHorizontal: 10,
          marginTop: 5,
          borderBottomColor: 'grey',
          paddingBottom: 5,
          borderBottomWidth: 1,
        }}>
        {title ? (
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
            onPress={() => {
              navigation.navigate('WorkoutListIndex');
            }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Vazirmatn',
                marginHorizontal: 10,
                // marginTop: 5,
                color: 'white',
                //direction: 'rtl',
                textAlign: 'center',
                justifyContent: 'center',
              }}>
              {i18n.t('yourWorkoutPlan')} : {title}
            </Text>
            <IconEdit color={theme.colors.white} size={24} />
          </TouchableOpacity>
        ) : (
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Vazirmatn',
              marginHorizontal: 10,
              marginTop: 0,
              color: 'white',
              //direction: 'rtl',
              textAlign: 'right',
              justifyContent: 'center',
              textAlign: 'center',
            }}>
            {i18n.t('title')}
          </Text>
        )}
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          top: 35,
          flexDirection: 'row',
          justifyContent: 'space-between',
          //alignItems: 'center',
          marginHorizontal: 10,
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
