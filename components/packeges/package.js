import { StatusBar } from 'expo-status-bar';
import React, { useContext, useState } from 'react';
import {
  Alert,
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Text, Divider, Button, useTheme } from '@rneui/themed';
import Rate from './content/rate';
import Usage from './content/usage';
import Level from './content/level';
import Goal from './content/Goal';
import Duration from './content/Duration';
import Week from './content/Week';
import Exercises from './content/exercises';
import { updateWorkoutPlan } from '../../api/GetData';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import Header from '../header';
import AuthContext from '../../api/context';
import { I18n } from 'i18n-js';
import LanguageContext from '../../api/langcontext';
import i18nt from '../../locales';
import * as SQLite from 'expo-sqlite';
import { useEffect } from 'react';
import { Icon } from '@rneui/base';
import { t } from 'i18n-js';
const db = SQLite.openDatabase('packeges.db'); // Open or create the database

function PackagePage({ route, navigation }) {
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const { theme } = useTheme();
  const { userAuth, setUserAuth } = useContext(AuthContext);
  const userLevel = userAuth.level;
  const userId = userAuth.id;
  const { item } = route.params;
  const creator = item.creator;
  const name = item.name;
  const date = item.date;
  const location = item.location;
  const DaysPerWeek = item.DaysPerWeek;
  const level = item.level;
  const duration = item.duration;
  const target = item.target;
  const premium = item?.premium;
  const realDate = moment(date).format('DD/MM/YYYY');
  const users = item.users;
  const navigate = useNavigation();
  const today_date = moment();
  const userDateRegister = userAuth.date;
  const [open, setOpen] = useState(false);
  const yesterday = moment(today_date).subtract(5, 'day');
  const nextWeek = moment(today_date).add(7, 'days');
  const daysSinceRegistration = moment(today_date).diff(
    userDateRegister,
    'days'
  );
  console.log(
    `user level is ${userLevel} and days since registration is ${daysSinceRegistration}`
  );

  // const savePackages = () => {
  //   try {
  //     db.transaction((tx) => {
  //       tx.executeSql('INSERT INTO packeges (data) VALUES (?);', item);
  //     });
  //     console.log('data saved');
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const savePackages = () => {
    try {
      const jsonString = JSON.stringify(item);

      db.transaction((tx) => {
        tx.executeSql('INSERT INTO packeges (data) VALUES (?);', [jsonString]);
      });

      console.log('data saved');
    } catch (error) {
      console.log(error);
    }
  };

  const _handlePressButtonAsync = async () => {
    navigate.navigate('Upgrade');
    // let result = await WebBrowser.openBrowserAsync(
    //   `https://fitlinez.com/payfromapp/?email=${userAuth.email}&location=${userAuth.location}&amount=14.99&amountRial=200000&product=FitLinez%20Premium%20Plan`
    // );

    setResult(result);
  };

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS packeges (id INTEGER PRIMARY KEY NOT NULL, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, data TEXT);'
      );
    });
  }, []);

  const UpgradeAlert = () => {
    Alert.alert(
      i18n.t('upgrade'),
      i18n.t('upgradeMessage'),
      [
        {
          text: i18n.t('cancel'),
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: i18n.t('upgrade'),
          onPress: () => navigate.navigate('Upgrade'),
        },
      ],
      { cancelable: false }
    );
  };

  const updateWorkoutForTrial = (data) => {
    console.log('updateWorkoutForTrial');
    if (userLevel === 0 && daysSinceRegistration > 14) {
      console.log(
        'userLevel === 0 && daysSinceRegistration < 14',
        daysSinceRegistration
      );
      UpgradeAlert();
    } else {
      updateWorkoutPlan(data);
      navigate.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });

      savePackages();
    }
  };

  const updateWorkoutForPremium = (data) => {
    console.log('updateWorkoutForPremium');
    if (userLevel === 4) {
      updateWorkoutPlan(data);
      navigate.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
      savePackages();
    } else {
      UpgradeAlert();
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      {/* <StatusBar
        animated={true}
        backgroundColor="#61dafb"
        barStyle="dark-content"
        showHideTransition="fade"
        hidden={false}
      />
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content style={style.title} title={name} />
      </Appbar.Header> */}
      <Header title={name} />

      <ScrollView style={style.maincontainer}>
        {/* <Image
          uri={`${item.image}`}
          style={{
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height / 3,
            resizeMode: 'cover',
          }}
        /> */}
        {item?.premium && (
          <Icon
            name="shield-crown"
            type="material-community"
            color="#f1c40f"
            size={30}
            containerStyle={{
              position: 'absolute',
              top: 10,
              right: 10,
            }}
          />
        )}
        <Text style={style.subTitle}>
          {i18n.t('by')} : {creator}
        </Text>
        <Text style={style.subTitle}>
          {i18n.t('date')} : {realDate}
        </Text>
        <Divider />
        <View style={style.container}>
          <Rate rate="5" />
          {/* <Usage users={users} /> */}
        </View>
        <Divider />
        <View style={style.container}>
          <Level level={level} />
          <Goal goal={target} />
        </View>
        <Divider />
        <View style={style.container}>
          <Duration duration={duration} />
          <Week days={DaysPerWeek} />
        </View>
        <Divider />
        {/* <View style={style.container}>
          <Equipment />
          <Location location={location} />
        </View> */}
        <Divider />
        <Exercises data={item.data} />
      </ScrollView>
      <View>
        <Button
          buttonStyle={{
            backgroundColor: theme.colors.secondary,
            //borderRadius: 30,
            height: 50,
          }}
          // type="Solid"
          title={i18n.t('addtoyourplan')}
          //style={{ margin: 10 }}
          onPress={() =>
            premium
              ? updateWorkoutForPremium({ data: item, userId: userId })
              : updateWorkoutForTrial({
                  data: item,
                  userId: userId,
                })
          }
        />
      </View>
    </SafeAreaView>
  );
}

export default PackagePage;

const style = StyleSheet.create({
  maincontainer: {
    backgroundColor: '#fff',
    height: Dimensions.get('window').height,
  },
  container: {
    height: 50,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  subTitle: {
    fontSize: 20,
    // fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
  },
});
