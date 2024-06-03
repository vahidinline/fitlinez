import React, { useContext, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import MealSection from './MealSection';
import TempfoodItems from './TempfoodItems';
import { IconArrowLeft } from '../marketplace/filters/icons';
import DailyReport from './dailyReport';
import InputSelector from './foodInput/InputSelector';
import AuthContext from '../../api/context';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@rneui/themed';
import CalorieMenu from './CalorieMenu';
import SetDailyCalories from './config/SetDailyCalories';
import FitlinezLoading from '../../components/FitlinezLoading';
import i18nt from '../../locales';
import LanguageContext from '../../api/langcontext';
import { I18n } from 'i18n-js';
import NutritionChart from './NutritionChart';

function CaloriesIndex() {
  const [status, setStatus] = useState('idle');
  const { userAuth } = useContext(AuthContext);
  const { theme } = useTheme();
  const [userInput, setUserInput] = useState('');
  const [data, setData] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const userId = userAuth.id;
  const [selectedMeal, setSelectedMeal] = useState(null);
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#5B5891' }}>
      <View style={{ flex: 1, backgroundColor: '#5B5891' }}>
        <ScrollView>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',

              justifyContent: 'space-between',
              alignItems: 'center',
              marginVertical: 20,
              marginHorizontal: 20,
            }}>
            <Pressable onPress={() => setStatus('idle')}>
              <IconArrowLeft color={theme.colors.white} />
            </Pressable>
            {/* <Text style={{ textAlign: 'center', fontSize: 20, color: 'white' }}>
            Welcome to the Nutrition Extractor
          </Text> */}
          </View>
          {status === 'idle' && <DailyReport userId={userId} i18n={i18n} />}
          {status === 'loading' && (
            <FitlinezLoading />
            // <ActivityIndicator size="large" color="#0000ff" />
            // <Image source={require('../../../assets/loading.gif')} />
          )}
        </ScrollView>
        {status === 'idle' && (
          <View
            style={{
              //flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginVertical: 20,
              marginHorizontal: 20,
            }}>
            <CalorieMenu i18n={i18n} status={status} setStatus={setStatus} />
          </View>
        )}
        {status === 'addFood' && (
          <MealSection
            i18n={i18n}
            userId={userId}
            setStatus={setStatus}
            setSelectedMeal={setSelectedMeal}
          />
        )}
        {status === 'mealInitialized' && (
          <Text
            style={{
              textAlign: 'center',
              fontSize: 16,

              color: 'white',
              margin: 20,
              marginBottom: 10,
            }}>
            {i18n.t('insetmealtitle')}
            {selectedMeal}
          </Text>
        )}
        {status === 'initialReqSent' && (
          <TempfoodItems
            i18n={i18n}
            selectedMeal={selectedMeal}
            foodItems={foodItems}
            setStatus={setStatus}
            userId={userId}
          />
        )}
        {status === 'mealInitialized' && (
          <InputSelector
            i18n={i18n}
            setFoodItems={setFoodItems}
            setStatus={setStatus}
            userInput={userInput}
            setUserInput={setUserInput}
          />
        )}

        {/* {status === 'setDailyCalories' &&} */}

        {status === 'setDailyCalories' && (
          <SetDailyCalories i18n={i18n} setStatus={setStatus} userId={userId} />
        )}
      </View>
    </SafeAreaView>
  );
}

export default CaloriesIndex;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  footerContainer: {
    padding: 20,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 10,
    borderWidth: 0.3,
    borderColor: 'grey',
  },
  verticallySpaced: {
    marginVertical: 10,
    borderWidth: 0.3,
    marginHorizontal: 10,
    height: 40,
    borderRadius: 5,
    padding: 10,
    width: '95%',
  },
  mt20: {
    marginTop: 20,
  },
});
