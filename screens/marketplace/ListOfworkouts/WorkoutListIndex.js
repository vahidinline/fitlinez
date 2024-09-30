import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Text, useTheme } from '@rneui/themed';
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
import TrainersList from '../../Trainers/TrainerIndex';

function WorkoutListIndex() {
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [userBasic, setUserBasic] = useState([]);
  const [packages, setPackages] = useState([]);
  const [status, setStatus] = useState('idle');
  const { userLanguage } = useContext(LanguageContext);
  const { userAuth } = useContext(AuthContext);
  const userId = userAuth.id;
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  console.log(status);

  const onRefresh = useCallback(() => {
    setStatus('loading');
    setRefreshing(true);
    setTimeout(() => {
      try {
        getLiveData();

        setRefreshing(false);
        setStatus('success');
      } catch (e) {
        setStatus('error');
      }
    }, 3000);
  }, []);

  const getPackagesData = async () => {
    getLiveData();
    setStatus('loading');
    const result = await AsyncStorage.getItem('Allpackages');

    try {
      setPackages(JSON.parse(result));
      setStatus('success');
    } catch (e) {
      setStatus('error');
      console.log(e);
    }
  };

  useEffect(() => {
    getPackagesData();
  }, []);

  const getLiveData = async () => {
    setStatus('loading');
    try {
      const result = await getPackages();
      setPackages(result);
      setStatus('success');
    } catch (e) {
      setStatus('error');
      console.log(e);
    }
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
          }}>
          <Header title={i18n.t('selectWorkoutPlan')} />

          {status === 'loading' && (
            <Text
              style={{
                fontSize: 16,
                fontWeight: '500',
                color: theme.colors.secondary,
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
                  color: theme.colors.secondary,
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
              {packages?.map((item, i) => (
                <View key={`item-${i}`}>
                  <CardItem item={item} />
                  {/* <BannerAdMob key={`ad-${i}`} />
                  <Divider
                    style={{
                      marginVertical: 20,
                      marginHorizontal: 20,
                      backgroundColor: theme.colors.border,
                    }}
                  /> */}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
      <View
        style={{
          marginHorizontal: 10,
          borderBottomColor: theme.colors.secondary,
          borderBottomWidth: 0.3,
        }}>
        <TrainersList i18n={i18n} />
      </View>
      <View
        style={{
          width: Dimensions.get('window').width / 1.1,
          marginHorizontal: 20,
        }}>
        {status === 'success' && (
          <Button
            buttonStyle={{
              backgroundColor: theme.colors.secondary,
              color: theme.colors.background,
              fontSize: 16,
              fontWeight: 'bold',
              marginBottom: 50,
              // height: 50,
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
