import React, { useContext, useEffect } from 'react';
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
import { useState } from 'react';
import LanguageContext from '../../../api/langcontext';
import AuthContext from '../../../api/context';
import i18nt from '../../../locales';
import { I18n } from 'i18n-js';
import { Button } from '@rneui/base';
import { useNavigation } from '@react-navigation/native';

function WorkoutListIndex({ route }) {
  const [refreshing, setRefreshing] = React.useState(false);
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [userBasic, setUserBasic] = useState([]);
  const [packages, setPackages] = useState([]);

  const goal = userBasic[4]?.goal;
  const location =
    userBasic[5]?.location === 'Home & Gym' ? 'both' : userBasic[5]?.location;

  const fitnessLevel = userBasic[6]?.fitnessLevel;
  const daysPerWeek = userBasic[7]?.dayPreferences;
  const { userLanguage } = useContext(LanguageContext);
  const { userAuth } = useContext(AuthContext);
  const userId = userAuth.id;
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  console.log('location', location, goal, fitnessLevel, daysPerWeek);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      getLiveData();
      setRefreshing(false);
    }, 2000);
  }, []);

  //func to filter the packages based on the user's goal, location and fitness level
  const filterPackages = () => {
    return packages.filter(
      (item) => item.location === location
      // item.level === fitnessLevel &&
      //item.goal === goal &&
      //item.DaysPerWeek === daysPerWeek
    );
  };
  let numberOfPackages = filterPackages().length;

  const getUserBasicData = async () => {
    const result = await AsyncStorage.getItem('userBasicData');

    setUserBasic(JSON.parse(result));
  };

  useEffect(() => {
    getUserBasicData();

    return () => {
      setUserBasic([]);
    };
  }, []);

  //const { packages, name } = route.params;

  const getPackagesData = async () => {
    const result = await AsyncStorage.getItem('Allpackages');
    try {
      setPackages(JSON.parse(result));
    } catch (e) {
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
          {packages.map((item) => {
            return <CardItem key={item.id} item={item} />;
          })}
          {/* <FlatList
          ListHeaderComponent={
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
              }}>
              {i18n.t('RecommendedWorkoutPlans')}
            </Text>
          }
          data={packages}
          renderItem={({ item }) => <CardItem item={item} />}
          keyExtractor={(item) => item.name}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            
          }
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 50,
              }}>
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
                }}>
                {i18n.t('NoWorkoutPlanFound')}
              </Text>
            </View>
          }
        /> */}
          <Divider
            style={{
              marginVertical: 20,
              marginHorizontal: 20,
              backgroundColor: theme.colors.border,
            }}
          />
          {/* <FlatList
          ListHeaderComponent={
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
              }}>
              {i18n.t('similarWorkoutPlan')}
            </Text>
          }
          data={packages}
          renderItem={({ item }) => <CardItem item={item} />}
          keyExtractor={(item) => item.name}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 50,
              }}>
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
                }}>
                No Workout Plan Available. please refresh the page
              </Text>
            </View>
          }
        /> */}
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
      </View>
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
