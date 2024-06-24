import React, { useContext, useState } from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { deleteFoodItem, sendFoodQuery } from '../../api/sendFoodQuery';
import { useTheme } from '@rneui/themed';
import { ActivityIndicator } from 'react-native-paper';
import { IconTickCircle, Iconclose } from '../marketplace/filters/icons';
import LanguageContext from '../../api/langcontext';
import approveFoodItem from '../../api/approveFoodItem';

// import { IconClose } from '../marketplace/filters/icons';
const FoodItemCard = ({
  item,
  index,
  handleInputChange,
  current,
  userId,
  selectedMeal,
  i18n,
  handleDeleteItem,
  setMainStatus,
  foodItems,
  foodId,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [status, setStatus] = useState('idle');
  const [nutritionData, setNutritionData] = useState(null);
  const [mealId, setMealId] = useState(null);
  const { userLanguage } = useContext(LanguageContext);
  const RTL = userLanguage === 'fa';
  //console.log('current food in card', current.foodItems[0]?.calories?.amount);
  //console.log('foodItems in card', foodItems);
  //console.log('foodId in card', foodId);
  //console.log('selectedMeal in card', selectedMeal);
  //console.log('item in card', item);

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

  const handleDeleteFoodItem = async (mealId, index) => {
    console.log('index in card', index);
    setStatus('idle');
    handleDeleteItem(index);
    alert('Item deleted');
    console.log('mealId', mealId);
    const deleteResult = await deleteFoodItem(mealId);

    //console.log('mealId', mealId);
  };

  const handleSendFoodFoodItemReq = async (index, item) => {
    console.log('index in card', item);
    setStatus('idle');
    alert('Item submitted');
    //return;
    handleDeleteItem(index);
    //console.log('mealId', mealId);
  };

  const handleUpdatefoodItem = (foodId, status) => {
    approveFoodItem(foodId, status);
    setMainStatus('mealInitialized');
  };

  return (
    <View
      style={[
        styles.container,
        status === 'dataLoaded' && {
          height: Dimensions.get('window').height / 2,
          direction: RTL ? 'rtl' : 'ltr',
        },
      ]}>
      {status === 'loading' && (
        <ActivityIndicator size="large" color={theme.colors.white} />
      )}
      {/* {status === 'dataLoaded' && ( */}
      <View style={styles.card}>
        <View style={styles.listTitle}>
          <Text style={styles.itemTitle}>
            {foodItems && foodItems[0]?.userInput}
          </Text>
        </View>

        <View style={styles.list}>
          <Text style={styles.itemText}>{i18n.t('calories')}</Text>

          {/* <Text style={styles.itemValue}>{`${item?.calories}`}</Text> */}
          <Text style={styles.itemUnit}>
            <Text
              style={
                styles.itemValue
              }>{`${current.foodItems[0]?.calories?.amount}`}</Text>
            {`${current.foodItems[0]?.calories?.unit}`}
          </Text>
        </View>

        <View style={styles.list}>
          <Text style={styles.itemText}>{i18n.t('protein')}</Text>
          <Text style={styles.itemUnit}>
            <Text
              style={
                styles.itemValue
              }>{`${current.foodItems[0]?.protein?.amount}`}</Text>
            {`${current.foodItems[0]?.protein?.unit}`}
          </Text>
        </View>
        <View style={styles.list}>
          <View
            style={{
              flexDirection: 'column',
            }}>
            <Text style={styles.itemText}>{i18n.t('fats')}</Text>
            <Text
              style={{
                color: theme.colors.white,
                fontFamily: 'Vazirmatn',
                fontSize: 10,
              }}>
              {i18n.t('saturated_fat')}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'column',
            }}>
            <Text style={styles.itemValue}>
              {`${current.foodItems[0]?.total_fat?.amount}`}{' '}
              {`${current.foodItems[0]?.total_fat?.unit}`}
            </Text>
            <Text
              style={{
                color: theme.colors.white,
                fontFamily: 'Vazirmatn',
                fontSize: 10,
              }}>
              {`${current.foodItems[0]?.saturated_fat?.amount}`}{' '}
              {`${current.foodItems[0]?.total_fat?.unit}`}
            </Text>
          </View>
        </View>

        <View style={styles.list}>
          <Text style={styles.itemText}>{i18n.t('sugar')}</Text>
          <Text style={styles.itemUnit}>
            <Text
              style={
                styles.itemValue
              }>{`${current.foodItems[0]?.sugars?.amount}`}</Text>
            {`${current.foodItems[0]?.sugars?.unit}`}
          </Text>
        </View>
        <View style={styles.list}>
          <Text style={styles.itemText}>{i18n.t('carbs')} </Text>
          <Text style={styles.itemUnit}>
            <Text
              style={
                styles.itemValue
              }>{`${current.foodItems[0]?.total_carbohydrates?.amount}`}</Text>
            {`${current.foodItems[0]?.total_carbohydrates?.unit}`}
          </Text>
        </View>

        <View style={styles.list}>
          <Text style={styles.itemText}>{i18n.t('fiber')}</Text>
          <Text style={styles.itemUnit}>
            <Text
              style={
                styles.itemValue
              }>{`${current.foodItems[0]?.dietary_fiber?.amount}`}</Text>
            {`${current.foodItems[0]?.dietary_fiber?.unit}`}
          </Text>
        </View>
        {/* <Text
              style={
                styles.itemValue
              }>{`${current.foodItems[0]?.saturated_fat?.amount}`}</Text>
            {`${current.foodItems[0]?.saturated_fat?.unit}`}
          </Text>  */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',

            width: Dimensions.get('window').width / 1.2,

            marginHorizontal: 5,
            marginVertical: 10,
            borderColor: theme.colors.warning,
          }}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleUpdatefoodItem(foodId, 'rejected')}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={styles.buttontitle}>{i18n.t('notok')}</Text>
              <Iconclose color={'red'} />
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
              <IconTickCircle color={'green'} />
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
      color: theme.colors.secondary,
      fontSize: 16,
      fontWeight: 'bold',
      fontFamily: 'Vazirmatn',
    },

    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 10,
      borderRadius: 10,
      // borderWidth: 0.3,
      // borderColor: theme.colors.border,
      backgroundColor: theme.colors.secondary,
      margin: 4,

      //backgroundColor: theme.colors.grey5,
      height: Dimensions.get('window').height / 2,
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
      justifyContent: 'space-between',
      margin: 10,
      borderWidth: 0.2,
      padding: 10,
      borderRadius: 5,
      borderColor: theme.colors.border,
      //top: 10,
      // backgroundColor: theme.colors.grey2,
      fontFamily: 'Vazirmatn',
    },
    list: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      margin: 5,
      borderBottomWidth: 0.3,
      borderBottomColor: theme.colors.border,
      paddingBottom: 2,
      fontFamily: 'Vazirmatn',
    },
    input: {
      height: 40,
      color: theme.colors.primary,
      fontSize: 14,
    },
    itemUnit: {
      color: theme.colors.white,
      fontSize: 10,
      marginTop: 5,

      fontFamily: 'Vazirmatn',
    },
    button: {
      //margin: 10,
      padding: 10,
      width: Dimensions.get('window').width / 2.5,
      height: 40,
      borderRadius: 10,
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary,
    },
    itemText: {
      color: theme.colors.white,
      fontSize: 16,
      fontWeight: 'bold',
      fontFamily: 'Vazirmatn',
    },
    itemValue: {
      color: theme.colors.white,
      fontSize: 16,
      fontFamily: 'Vazirmatn',
      marginHorizontal: 5,
    },
    itemTitle: {
      color: theme.colors.warning,
      fontSize: 18,
      fontWeight: 'bold',
      fontFamily: 'Vazirmatn',
    },
  });
