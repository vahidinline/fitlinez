import React, { useContext, useEffect, useState } from 'react';
import { FlatList, SafeAreaView, View, Text, Dimensions } from 'react-native';
import DailyTaskList from './DailyTaskList';
import { getDailyTasks } from '../../api/handleDailyTasks';
import AuthContext from '../../api/context';
import { useTheme } from '@rneui/themed';
import i18nt from '../../locales';
import LanguageContext from '../../api/langcontext';
import { I18n } from 'i18n-js';

function DailyTaskIndex() {
  const [dailyTasks, setDailyTasks] = useState([]);
  const { theme } = useTheme();
  const { userAuth } = useContext(AuthContext);
  const userId = userAuth.id;
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const isRTL = userLanguage === 'fa';
  useEffect(() => {
    getDailyTasks(userId)
      .then((tasks) => {
        setDailyTasks(tasks);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <SafeAreaView
      style={
        {
          //backgroundColor: theme.colors.background,
          //height: Dimensions.get('window').height,
        }
      }>
      <View
        style={
          {
            //flex: 1,
            // direction: isRTL ? 'rtl' : 'ltr',
          }
        }>
        <Text
          style={{
            //color: theme.colors.text,
            fontSize: 17,
            fontWeight: '700',
            marginHorizontal: 16,
            marginTop: 16,
            color: theme.colors.primary,
            fontFamily: 'Vazirmatn',
            textAlign: 'center',
          }}>
          {' '}
          {i18n.t('todayTasks')}
        </Text>

        {dailyTasks.map((item, i) => (
          <DailyTaskList key={i} item={item} i18n={i18n} />
        ))}
        {/* <FlatList
          data={dailyTasks}
          renderItem={({ item }) => }
          keyExtractor={(item, index) => index.toString()}
        /> */}
      </View>
    </SafeAreaView>
  );
}

export default DailyTaskIndex;
