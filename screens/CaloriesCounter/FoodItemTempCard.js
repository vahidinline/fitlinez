import React, { useContext, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { deleteFoodItem, sendFoodQuery } from '../../api/sendFoodQuery';
import { useTheme } from '@rneui/themed';
import { IconTickCircle, Iconclose } from '../marketplace/filters/icons';
import LanguageContext from '../../api/langcontext';
import approveFoodItem from '../../api/approveFoodItem';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18nt from '../../locales';
import { I18n } from 'i18n-js';
import ItemResults from '../../components/Calories/ItemResults';
// import { IconClose } from '../marketplace/filters/icons';
const FoodItemCard = ({
  title,
  item,
  userId,
  selectedMeal,
  foodId,
  setMainStatus,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [status, setStatus] = useState('idle');
  const [nutritionData, setNutritionData] = useState(null);
  const [mealId, setMealId] = useState(null);
  const { userLanguage } = useContext(LanguageContext);
  const RTL = userLanguage === 'fa';
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const navigation = useNavigation();
  const handleSendFoodItemReq = async () => {
    setStatus('loading');
    try {
      const res = await sendFoodQuery(item, userId, selectedMeal.value);

      if (res) {
        setNutritionData(res.data);
        setMealId(res.mealId);
        setStatus('dataLoaded');
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
      console.error('Failed to send data:', error);
    }
  };

  const handleUpdatefoodItem = async (foodId, status) => {
    navigation.goBack();
    await approveFoodItem(foodId, status);
    await AsyncStorage.removeItem('foodInput');
    // setMainStatus('idle');

    navigation.reset({
      index: 0,
      routes: [{ name: 'CaloriesIndex' }],
    });
  };

  const handleRejectfoodItem = async (foodId, status) => {
    await approveFoodItem(foodId, status);
    await AsyncStorage.removeItem('foodInput');
    setMainStatus('idle');

    navigation.goBack();
  };

  return (
    <View
      style={[
        styles.container,
        status === 'dataLoaded' && {
          height: Dimensions.get('window').height,
          direction: RTL ? 'rtl' : 'ltr',
        },
      ]}>
      <View style={styles.card}>
        <View style={styles.listTitle}>
          <Text style={styles.itemTitle}>{title}</Text>
        </View>
        <Text style={styles.itemServingSize}>{item?.serving_size}</Text>

        <ItemResults
          title={i18n.t('calories')}
          amount={item?.calories?.amount}
          unit={item?.calories?.unit}
        />
        <ItemResults
          title={i18n.t('protein')}
          amount={item?.protein?.amount}
          unit={item?.protein?.unit}
        />
        <ItemResults
          title={i18n.t('fats')}
          amount={item?.total_fat?.amount}
          unit={item?.total_fat?.unit}
        />
        <ItemResults
          title={i18n.t('saturated_fat')}
          amount={item?.saturated_fat?.amount}
          unit={item?.saturated_fat?.unit}
        />

        <ItemResults
          title={i18n.t('sugar')}
          amount={item?.sugars?.amount}
          unit={item?.sugars?.unit}
        />

        <ItemResults
          title={i18n.t('carbs')}
          amount={item?.total_carbohydrates?.amount}
          unit={item?.total_carbohydrates?.unit}
        />

        <ItemResults
          title={i18n.t('fiber')}
          amount={item?.dietary_fiber?.amount}
          unit={item?.dietary_fiber?.unit}
        />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',

            //   bottom: 0,
            width: Dimensions.get('window').width / 1.1,

            marginHorizontal: 0,
            marginVertical: 10,
            borderColor: theme.colors.warning,
          }}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleRejectfoodItem(foodId, 'rejected')}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                alignContent: 'center',
              }}>
              <Text style={styles.buttontitle}>{i18n.t('notok')}</Text>
              <Iconclose color={'white'} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleUpdatefoodItem(foodId, 'approved')}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={styles.buttontitle}>{i18n.t('itsok')}</Text>
              <IconTickCircle color={'white'} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default FoodItemCard;

const getStyles = (theme) =>
  StyleSheet.create({
    buttontitle: {
      color: theme.colors.primary,
      fontSize: 16,
      //  fontWeight: 'bold',
      fontFamily: 'Vazirmatn',
    },

    container: {
      flex: 1,
      justifyContent: 'center',
      //padding: 5,
      height: Dimensions.get('window').height,
      borderRadius: 10,

      // borderWidth: 0.3,
      // borderColor: theme.colors.border,
      backgroundColor: theme.colors.backgroundColor,
      margin: 4,

      //backgroundColor: theme.colors.grey5,
      //height: Dimensions.get('window').height / 2,
    },
    card: {
      padding: 5,
      margin: 5,
      backgroundColor: theme.colors.grey5,
    },
    footerContainer: {
      padding: 20,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    listTitle: {
      flexDirection: 'row',
      justifyContent: 'center',
      margin: 10,
      // borderWidth: 0.2,
      padding: 10,
      borderRadius: 5,
      borderColor: theme.colors.border,
      //top: 10,
      // backgroundColor: theme.colors.grey2,
      fontFamily: 'Vazirmatn',
      textAlign: 'center',
    },
    list: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      margin: 5,
      borderBottomWidth: 0.3,
      borderBottomColor: theme.colors.border,
      paddingBottom: 2,
      fontFamily: 'Vazirmatn',
      textAlign: 'center',
    },
    input: {
      height: 40,
      color: theme.colors.secondary,
      fontSize: 14,
    },
    itemUnit: {
      color: theme.colors.secondary,
      fontSize: 10,
      marginTop: 5,

      fontFamily: 'Vazirmatn',
    },
    button: {
      //margin: 10,
      //padding: 10,
      width: Dimensions.get('window').width / 2.5,
      height: 40,
      borderRadius: 6,
      justifyContent: 'center',
      alignItems: 'stretch',
      paddingHorizontal: 10,
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.button,
    },
    itemText: {
      color: theme.colors.secondary,
      fontSize: 16,
      // fontWeight: 'bold',
      fontFamily: 'Vazirmatn',
    },
    itemValue: {
      color: theme.colors.secondary,
      fontSize: 16,
      fontFamily: 'Vazirmatn',
      marginHorizontal: 5,
    },
    itemTitle: {
      color: theme.colors.secondary,
      fontSize: 18,
      textAlign: 'center',
      justifyContent: 'center',

      // fontWeight: 'bold',
      fontFamily: 'Vazirmatn',
    },
    itemServingSize: {
      color: theme.colors.secondary,
      fontSize: 12,
      textAlign: 'center',
      justifyContent: 'center',

      // fontWeight: 'bold',
      fontFamily: 'Vazirmatn',
    },
  });
