import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, ListItem, Text } from '@rneui/base';
import { useTheme } from '@rneui/themed';
import React, { useState, useEffect, useContext } from 'react';
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { setDailyCaloriesGoals } from '../../../api/calculateCaloriesPercentage';
import NutritionChart from '../NutritionChart';
import { schedulePushNotification } from '../../../api/notification';
import LanguageContext from '../../../api/langcontext';
import i18nt from '../../../locales';
import { I18n } from 'i18n-js';
import AuthContext from '../../../api/context';
import Header from '../../../components/header';
import { useNavigation } from '@react-navigation/native';
import convertToPersianNumbers from '../../../api/PersianNumber';

const pickerData = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

function SetDailyCalories() {
  const { userAuth } = useContext(AuthContext);
  const userId = userAuth.id;
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const RTL = userLanguage === 'fa';
  const [status, setStatus] = useState('idle');
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [dailyCalories, setDailyCalories] = useState(0);
  const [fatPercentage, setFatPercentage] = useState(30);
  const [proteinPercentage, setProteinPercentage] = useState(30);
  const [carbsPercentage, setCarbsPercentage] = useState(40);
  const [carbsGrams, setCarbsGrams] = useState(0);
  const [proteinGrams, setProteinGrams] = useState(0);
  const [fatGrams, setFatGrams] = useState(0);
  const [typeStatus, setTypeStatus] = useState('idle');
  const navigation = useNavigation();
  const valuechecker = () => {
    if (fatPercentage + proteinPercentage + carbsPercentage != 100) {
      Alert.alert(
        'Error',
        'The sum of fat, protein, and carbs percentages must be 100.'
      );
      return false;
    }
    return true;
  };

  useEffect(() => {
    valuechecker();
  }, []);

  const handleInput = (e) => {
    if (!valuechecker()) return;
    // return;
    setDailyCalories(parseInt(e.nativeEvent.text));
    setTypeStatus('idle');
  };

  const handleSetCalories = async () => {
    setStatus('loading');

    schedulePushNotification({
      title: 'Daily Calories Goals',
      body: `Daily calories goal is set to ${dailyCalories}`,
      data: { dailyCalories },
    });
    try {
      setDailyCaloriesGoals(
        dailyCalories,
        fatPercentage,
        proteinPercentage,
        carbsPercentage,
        fatGrams,
        proteinGrams,
        carbsGrams,
        userId
      );
      await AsyncStorage.setItem(
        'dailyCaloriesGoals',
        JSON.stringify({
          dailyCalories,
          fatPercentage,
          proteinPercentage,
          carbsPercentage,
          fatGrams,
          proteinGrams,
          carbsGrams,
        })
      );

      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'Home',
          },
        ],
      });
    } catch (error) {
      console.error('Failed to set data:', error);
      setStatus('error');
    }
  };

  useEffect(() => {
    const carbsCalories = Math.round((dailyCalories / 100) * carbsPercentage);
    const proteinCalories = Math.round(
      (dailyCalories / 100) * proteinPercentage
    );
    const fatCalories = Math.round((dailyCalories / 100) * fatPercentage);

    setCarbsGrams(Math.round(carbsCalories / 4));
    setProteinGrams(Math.round(proteinCalories / 4));
    setFatGrams(Math.round(fatCalories / 9));
  }, [dailyCalories, fatPercentage, proteinPercentage, carbsPercentage]);

  useEffect(() => {
    const getDailyCaloriesGoals = async () => {
      const dailyCaloriesGoals = await AsyncStorage.getItem(
        'dailyCaloriesGoals'
      );
      if (
        dailyCaloriesGoals !== 0 &&
        dailyCaloriesGoals !== null &&
        dailyCaloriesGoals !== undefined
      ) {
        const parsedDailyCaloriesGoals = JSON.parse(dailyCaloriesGoals);
        setDailyCalories(parsedDailyCaloriesGoals.dailyCalories);
        setFatPercentage(parsedDailyCaloriesGoals.fatPercentage);
        setProteinPercentage(parsedDailyCaloriesGoals.proteinPercentage);
        setCarbsPercentage(parsedDailyCaloriesGoals.carbsPercentage);
      }
    };
    getDailyCaloriesGoals();
  }, []);

  const handlePercent = (e) => {
    const { name, text } = e.nativeEvent;
    const value = parseInt(text);

    if (!value || value <= 0) {
      Alert.alert('Invalid input', 'Value cannot be 0 or empty');
      return;
    }
    switch (name) {
      case 'dailyCalories':
        setDailyCalories(parseInt(text));
        //setTypeStatus('idle');
        break;
      case 'carbohydrates':
        setCarbsPercentage(parseInt(text));
        //etTypeStatus('idle');
        break;
      case 'protein':
        setProteinPercentage(parseInt(text));
        //setTypeStatus('idle');
        break;
      case 'fat':
        setFatPercentage(parseInt(text));
        // setTypeStatus('idle');
        break;
      default:
        break;
    }
  };
  return (
    <View
      style={{
        //backgroundColor: 'theme.colors.background',
        top: Platform.OS === 'ios' ? 50 : 100,
        //
      }}>
      <Header title={i18n.t('setdailycalories')} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View
          style={{
            height: '30%',

            top: 10,
            // bottom:
            //   typeStatus === 'focused'
            //     ? Dimensions.get('window').height / 4
            //     : 20,
          }}>
          <NutritionChart
            i18n={i18n}
            dailyCalories={dailyCalories}
            fatPercentage={fatPercentage}
            proteinPercentage={proteinPercentage}
            carbsPercentage={carbsPercentage}
            fatGrams={fatGrams}
            proteinGrams={proteinGrams}
            carbsGrams={carbsGrams}
            RTL={RTL}
          />
        </View>
        <View style={styles.container}>
          <ListItem>
            <ListItem.Content
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              }}>
              <View style={{ flexDirection: 'row' }}>
                <ListItem.Title
                  style={{
                    color: theme.colors.text,
                    fontSize: 18,
                    //  fontWeight: 'bold',
                    fontFamily: 'Vazirmatn',
                  }}>
                  {i18n.t('dailyCalories')}
                </ListItem.Title>
              </View>
              <TextInput
                returnKeyType="done"
                style={styles.input}
                name="dailyCalories"
                placeholder="Enter daily calories"
                defaultValue={dailyCalories.toString() || '0'}
                keyboardType="numeric"
                onChangeText={(e) => setDailyCalories(parseInt(e) || 0)}
                onSubmitEditing={handleInput}
                onFocus={() => setTypeStatus('focused')}
              />
            </ListItem.Content>
          </ListItem>

          <ListItem>
            <ListItem.Content
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              }}>
              <View style={{ flexDirection: 'row' }}>
                <ListItem.Title style={styles.subs}>
                  {i18n.t('carbs')}
                </ListItem.Title>
                <Text style={styles.subs}>
                  {convertToPersianNumbers(carbsGrams, RTL)} {i18n.t('g')}
                </Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <TextInput
                  returnKeyType="done"
                  name="carbohydrates"
                  placeholder="Enter percentage"
                  defaultValue={carbsPercentage.toString()}
                  keyboardType="numeric"
                  onChangeText={(text) =>
                    handlePercent({
                      nativeEvent: { name: 'carbohydrates', text },
                    })
                  }
                  onSubmitEditing={(e) => handlePercent(e)}
                  onFocus={() => setTypeStatus('focused')}
                />
                <Text style={styles.subs}>%</Text>
              </View>
            </ListItem.Content>
          </ListItem>

          <ListItem>
            <ListItem.Content
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              }}>
              <View style={{ flexDirection: 'row' }}>
                <ListItem.Title style={styles.subs}>
                  {i18n.t('protein')}
                </ListItem.Title>
                <Text style={styles.subs}>
                  {convertToPersianNumbers(proteinGrams, RTL)} {i18n.t('g')}
                </Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <TextInput
                  returnKeyType="done"
                  name="protein"
                  placeholder="Enter percentage"
                  defaultValue={proteinPercentage.toString()}
                  keyboardType="numeric"
                  onChangeText={(text) =>
                    handlePercent({ nativeEvent: { name: 'protein', text } })
                  }
                  onSubmitEditing={(e) => handlePercent(e)}
                  onFocus={() => setTypeStatus('focused')}
                />
                <Text style={styles.subs}>%</Text>
              </View>
            </ListItem.Content>
          </ListItem>

          <ListItem>
            <ListItem.Content
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              }}>
              <View style={{ flexDirection: 'row' }}>
                <ListItem.Title style={styles.subs}>
                  {i18n.t('fats')}
                </ListItem.Title>
                <Text style={styles.subs}>
                  {convertToPersianNumbers(fatGrams, RTL)} {i18n.t('g')}
                </Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <TextInput
                  returnKeyType="done"
                  name="fat"
                  placeholder="Enter percentage"
                  defaultValue={fatPercentage.toString()}
                  keyboardType="numeric"
                  onChangeText={(text) =>
                    handlePercent({ nativeEvent: { name: 'fat', text } })
                  }
                  onSubmitEditing={(e) => handlePercent(e)}
                  onFocus={() => setTypeStatus('focused')}
                />

                <Text style={styles.subs}>%</Text>
              </View>
            </ListItem.Content>
          </ListItem>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 20,
            }}>
            <Button
              buttonStyle={[
                styles.Button,
                {
                  backgroundColor: theme.colors.buttonSecondary,
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                },
              ]}
              title={i18n.t('cancel')}
              titleStyle={[styles.buttonTitle, { color: theme.colors.text }]}
              onPress={() =>
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: 'CaloriesIndex',
                    },
                  ],
                })
              }
            />
            <Button
              buttonStyle={styles.Button}
              title={i18n.t('save')}
              titleStyle={styles.buttonTitle}
              onPress={() => handleSetCalories()}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

export default SetDailyCalories;

const getStyles = (theme, RTL) =>
  StyleSheet.create({
    container: {
      // flex: 1,
      marginHorizontal: 10,
      direction: RTL ? 'rtl' : 'ltr',
      padding: 10,
      borderRadius: 10,
      backgroundColor: theme.colors.white,
      //marginBottom: Dimensions.get('window').height / 4,
    },
    buttonTitle: {
      color: theme.colors.primary,
      // fontWeight: 'bold',
      fontSize: 16,
      fontFamily: 'Vazirmatn',
    },
    input: {
      color: theme.colors.text,
      fontSize: 24,
      // fontWeight: 'bold',
      fontFamily: 'Vazirmatn',
    },
    subs: {
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: 'normal',
      marginLeft: 10,
      fontFamily: 'Vazirmatn',
    },
    Button: {
      padding: 5,
      width: '80%',
      height: 40,
      backgroundColor: '#fff',
      borderRadius: 5,
      marginHorizontal: 5,
      marginBottom: 10,
      backgroundColor: theme.colors.button,
    },
  });
