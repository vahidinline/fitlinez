import React, { useContext, useState } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MealSection from './MealSection';
import TempfoodItems from './TempfoodItems';
import { IconArrowUp, IconWarning } from '../marketplace/filters/icons';
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
import CustomReport from './customReport';
import { Button } from '@rneui/base';
import DailyDetailsIndex from './DailyDetails/DailyDetailsIndex';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ActivityIndicator } from 'react-native-paper';

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
  const RTL = userLanguage === 'fa';

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: theme.colors.secondary }}>
        <ScrollView>
          {/* <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginVertical: 20,

              height: 50,
            }}>
            {status !== 'idle' && (
              <Pressable
                style={{
                  marginHorizontal: 20,
                  flexDirection: 'row',
                }}
                onPress={() => setStatus('idle')}>
                <IconArrowLeft color={theme.colors.primary} size={40} />
                <Text
                  style={{
                    color: theme.colors.primary,
                    top: 6,
                    fontFamily: 'Vazirmatn',
                  }}>
                  {i18n.t('back')}
                </Text>
              </Pressable>
            )}
          </View> */}

          {status === 'loading' && (
            <View
              style={{
                flex: 1,
                top: Dimensions.get('window').height / 4,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator
                animating={true}
                color={theme.colors.warning}
                size="large"
              />
            </View>
          )}
          {status === 'idle' && (
            <DailyDetailsIndex mainStatus={status} setMainStatus={setStatus} />
          )}
          {status === 'seeDetails' && (
            <DailyDetailsIndex mainStatus={status} setMainStatus={setStatus} />
          )}
        </ScrollView>
        <View
          style={{
            position: 'absolute',
            //right: 10,
            bottom: 1,
            zIndex: 10,
            height: 40,
            width: Dimensions.get('window').width / 1,
            backgroundColor: theme.colors.primary,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={() => setStatus('idle')}>
            <IconArrowUp color={theme.colors.secondary} size={30} />
          </TouchableOpacity>
        </View>
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
            <CalorieMenu
              RTL={RTL}
              i18n={i18n}
              status={status}
              setStatus={setStatus}
            />
          </View>
        )}
        {status === 'addFood' && (
          <MealSection
            i18n={i18n}
            userId={userId}
            setStatus={setStatus}
            setSelectedMeal={setSelectedMeal}
            status={status}
            RTL={RTL}
          />
        )}
        {status === 'mealInitialized' && (
          <Text
            style={{
              textAlign: 'center',
              fontSize: 16,
              //  fontWeight: 'bold',
              color: theme.colors.primary,
              margin: 20,
              marginBottom: 10,
              fontFamily: 'Vazirmatn',
            }}>
            {i18n.t('foodinserttypetitle', { mealType: selectedMeal.name })}
          </Text>
        )}
        {status === 'initialReqSent' && (
          <TempfoodItems
            RTL={RTL}
            i18n={i18n}
            selectedMeal={selectedMeal}
            foodItems={foodItems}
            setStatus={setStatus}
            userId={userId}
          />
        )}
        {status === 'CustomReport' && (
          <CustomReport i18n={i18n} userId={userId} />
        )}
        {status === 'mealInitialized' && (
          <InputSelector
            userId={userId}
            status={status}
            RTL={RTL}
            i18n={i18n}
            setFoodItems={setFoodItems}
            setStatus={setStatus}
            userInput={userInput}
            setUserInput={setUserInput}
            selectedMeal={selectedMeal}
          />
        )}
        {status === 'error' && (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <IconWarning color={theme.colors.warning} size={50} />
            <Text
              style={{
                textAlign: 'center',
                fontSize: 16,
                color: theme.colors.warning,
                margin: 20,
                marginBottom: 10,
                fontFamily: 'Vazirmatn',
              }}>
              {i18n.t('error')}
            </Text>
            <Button
              buttonStyle={{
                backgroundColor: theme.colors.secondary,
                borderColor: theme.colors.primary,
                borderWidth: 0.2,
                margin: 10,
                borderRadius: 10,
                height: 40,
                width: 100,
              }}
              titleStyle={{
                color: theme.colors.primary,
                fontSize: 15,
                // fontWeight: 'bold',
                fontFamily: 'Vazirmatn',
              }}
              title={i18n.t('retry')}
              onPress={() => setStatus('mealInitialized')}
            />
          </View>
        )}

        {status === 'setDailyCalories' && (
          <SetDailyCalories
            RTL={RTL}
            i18n={i18n}
            setStatus={setStatus}
            userId={userId}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

export default CaloriesIndex;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
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
