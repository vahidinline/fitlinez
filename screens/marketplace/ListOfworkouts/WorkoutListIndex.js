import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Divider, Text, useTheme } from '@rneui/themed';
import { View } from 'react-native';
import CardItem from './CardItem';
import Header from '../../../components/header';
import { getPackages } from '../../../api/GetData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LanguageContext from '../../../api/langcontext';
import AuthContext from '../../../api/context';
import i18nt from '../../../locales';
import { I18n } from 'i18n-js';
import { Button } from '@rneui/base';
import { useNavigation } from '@react-navigation/native';

function WorkoutListIndex({ route }) {
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [userBasic, setUserBasic] = useState([]);
  const [packages, setPackages] = useState([]);
  const [status, setStatus] = useState('idle');
  // const goal = userBasic[4]?.goal;
  // const location =
  //   userBasic[5]?.location === 'Home & Gym' ? 'both' : userBasic[5]?.location;

  // const fitnessLevel = userBasic[6]?.fitnessLevel;
  // const daysPerWeek = userBasic[7]?.dayPreferences;
  const { userLanguage } = useContext(LanguageContext);
  const { userAuth } = useContext(AuthContext);
  const userId = userAuth.id;
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;

  const onRefresh = useCallback(() => {
    setStatus('loading');
    setRefreshing(true);
    setTimeout(() => {
      getLiveData();
      setStatus('success');
      setRefreshing(false);
    }, 2000);
  }, []);

  //func to filter the packages based on the user's goal, location and fitness level
  // const filterPackages = () => {
  //   return packages.filter(
  //     (item) => item.location === location
  //     // item.level === fitnessLevel &&
  //     //item.goal === goal &&
  //     //item.DaysPerWeek === daysPerWeek
  //   );
  // };
  // let numberOfPackages = filterPackages().length;

  const getUserBasicData = async () => {
    setStatus('loading');
    const result = await AsyncStorage.getItem('userBasicData');
    // console.log('result', result);
    setUserBasic(JSON.parse(result));
    setStatus('success');
  };

  useEffect(() => {
    getUserBasicData();

    return () => {
      setUserBasic([]);
    };
  }, []);

  //const { packages, name } = route.params;

  const getPackagesData = async () => {
    setStatus('loading');
    const result = await AsyncStorage.getItem('Allpackages');
    try {
      setStatus('success');
      setPackages(JSON.parse(result));
    } catch (e) {
      setStatus('error');
      console.log(e);
    }
  };

  useEffect(() => {
    getPackagesData();
  }, []);

  const getLiveData = async () => {
    //getPackages
    console.log('getLiveData');
    const result = await getPackages();
    setPackages(result);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: theme.colors.background,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View
          style={{
            backgroundColor: theme.colors.background,
            paddingTop: 50,
            marginHorizontal: 0,
            // width: Dimensions.get('window').width / 1.1,
          }}>
          <Header />
          {status === 'loading' && (
            <Text
              style={{
                fontSize: 16,
                fontWeight: '500',
                color: theme.colors.text,
                margin: 20,
                flexShrink: 1,
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignContent: 'center',
                alignSelf: 'center',
                textAlign: 'center',
                fontFamily: 'Vazirmatn',
              }}>
              {i18n.t('loading')}
            </Text>
          )}
          {status === 'success' && (
            <View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '500',
                  color: theme.colors.text,
                  margin: 20,
                  flexShrink: 1,
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  alignContent: 'center',
                  alignSelf: 'center',
                  textAlign: 'center',
                  fontFamily: 'Vazirmatn',
                }}>
                {i18n.t('RecommendedWorkoutPlans')}
              </Text>
              {packages.map((item, i) => {
                return <CardItem key={i} item={item} />;
              })}

              <Divider
                style={{
                  marginVertical: 20,
                  marginHorizontal: 20,
                  backgroundColor: theme.colors.border,
                }}
              />
            </View>
          )}
        </View>
      </ScrollView>
      <View
        style={{
          //position: 'absolute',
          // bottom: 0,
          width: Dimensions.get('window').width / 1.1,
          marginHorizontal: 20,

          // backgroundColor: theme.colors.secondary,
        }}>
        {status === 'success' && (
          <Button
            buttonStyle={{
              backgroundColor: theme.colors.secondary,
              color: theme.colors.background,
              fontSize: 16,
              fontWeight: 'bold',

              marginBottom: 50,
              height: 50,
              borderRadius: 16,
            }}
            titleStyle={{
              fontFamily: 'Vazirmatn',
            }}
            title={i18n.t('backtohome')}
            onPress={() =>
              navigation.reset({ index: 0, routes: [{ name: 'Home' }] })
            }
          />
        )}
      </View>
      {status === 'error' && (
        <Text
          style={{
            fontSize: 16,
            fontWeight: '500',
            color: theme.colors.text,
            margin: 20,
            flexShrink: 1,
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignContent: 'center',
            alignSelf: 'center',
            textAlign: 'center',
            fontFamily: 'Vazirmatn',
          }}>
          {i18n.t('error')}
        </Text>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default WorkoutListIndex;
