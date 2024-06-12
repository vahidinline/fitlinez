import React, { useState } from 'react';
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
import { Button } from '@rneui/base';
import { ActivityIndicator } from 'react-native-paper';
import {
  IconArrowDown,
  IconCloseCircle,
  IconTick,
  IconTickCircle,
  Iconclose,
} from '../marketplace/filters/icons';
// import { IconClose } from '../marketplace/filters/icons';
const FoodItemCard = ({
  item,
  index,
  handleInputChange,
  userId,
  selectedMeal,
  i18n,
  handleDeleteItem,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [status, setStatus] = useState('idle');
  const [nutritionData, setNutritionData] = useState(null);
  const [mealId, setMealId] = useState(null);
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

  return (
    <View
      style={[
        styles.container,
        status === 'dataLoaded' && {
          height: Dimensions.get('window').height / 2,
        },
      ]}>
      {status === 'idle' && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: 10,
          }}>
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 15,
              right: -15,
            }}
            onPress={() => {
              handleDeleteItem(index);
              //console.log(index);
            }}>
            <IconCloseCircle color={'white'} />
          </TouchableOpacity>
          <View style={{ flexDirection: 'column', width: '90%' }}>
            <TextInput
              style={[
                styles.input,
                {
                  width: '100%',
                  borderWidth: 0.1,
                  fontSize: 18,
                  top: 10,
                  fontWeight: 'bold',
                  color: theme.colors.primary,
                  borderBottomColor: theme.colors.border,
                  borderBottomWidth: 0.3,
                },
              ]}
              value={item.name}
              onChangeText={(value) =>
                handleInputChange(index, 'foodItem', value)
              }
            />
            <View
              style={{
                flexDirection: 'row',
                // justifyContent: 'space-between',
                alignItems: 'center',
                // height: 100,
                //width: 100,
                //borderRadius: 50,
                // borderWidth: 5,
                // marginHorizontal: 10,
                //marginVertical: 10,
                borderColor: theme.colors.warning,
                fontSize: 18,
                //padding: 20,
              }}>
              <TextInput
                style={styles.input}
                value={item.amount.toString()}
                onChangeText={(value) =>
                  handleInputChange(index, 'amount', value)
                }
              />
              <TextInput
                style={styles.input}
                value={item.unit}
                onChangeText={(value) =>
                  handleInputChange(index, 'unit', value)
                }
              />
            </View>
            <TouchableOpacity
              style={{
                //position: 'absolute',
                top: 10,
              }}
              onPress={() => {
                handleSendFoodItemReq();
              }}>
              <IconArrowDown color={'white'} size={32} />
            </TouchableOpacity>
          </View>
        </View>
      )}
      {status === 'loading' && (
        <ActivityIndicator size="large" color={theme.colors.white} />
      )}
      {status === 'idle' && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: 10,
          }}></View>
      )}
      {status === 'dataLoaded' && (
        <View style={styles.card}>
          <View style={styles.listTitle}>
            <Text style={styles.itemTitle}>
              {nutritionData.food_item && nutritionData.food_item} {index}
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.itemText}>Serving Size: </Text>
            <Text style={styles.itemValue}>
              {nutritionData.serving_size &&
                `${nutritionData.serving_size.amount} ${nutritionData.serving_size.unit}`}
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.itemText}>Calories: </Text>
            <Text style={styles.itemValue}>
              {nutritionData.calories &&
                `${nutritionData.calories.amount} ${nutritionData.calories.unit}`}
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.itemText}>Total Fat: </Text>
            <Text style={styles.itemValue}>
              {nutritionData.total_fat &&
                `${nutritionData.total_fat.amount} ${nutritionData.total_fat.unit}`}
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.itemText}>Saturated Fat: </Text>
            <Text style={styles.itemValue}>
              {nutritionData.saturated_fat &&
                `${nutritionData.saturated_fat.amount} ${nutritionData.saturated_fat.unit}`}
            </Text>
          </View>
          {/* <Text>
            Cholesterol:{' '}
            {nutritionData.cholesterol &&
              `${nutritionData.cholesterol.amount} ${nutritionData.cholesterol.unit}`}
          </Text> */}
          <View style={styles.list}>
            <Text style={styles.itemText}>Sodium: </Text>
            <Text style={styles.itemValue}>
              {nutritionData.sodium &&
                `${nutritionData.sodium.amount} ${nutritionData.sodium.unit}`}
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.itemText}>Total Carbohydrates: </Text>
            <Text style={styles.itemValue}>
              {nutritionData.total_carbohydrates &&
                `${nutritionData.total_carbohydrates.amount} ${nutritionData.total_carbohydrates.unit}`}
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.itemText}>Dietary Fiber: </Text>
            <Text style={styles.itemValue}>
              {nutritionData.dietary_fiber &&
                `${nutritionData.dietary_fiber.amount} ${nutritionData.dietary_fiber.unit}`}
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.itemText}>Sugars: </Text>
            <Text style={styles.itemValue}>
              {nutritionData.sugars &&
                `${nutritionData.sugars.amount} ${nutritionData.sugars.unit}`}
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.itemText}>Protein: </Text>
            <Text style={styles.itemValue}>
              {nutritionData.protein &&
                `${nutritionData.protein.amount} ${nutritionData.protein.unit}`}
            </Text>
          </View>
          {/* <Text>Vitamins and Minerals:</Text>
          <Text>
            {' '}
            - Calcium:{' '}
            {nutritionData.vitamins_and_minerals.calcium &&
              `${nutritionData.vitamins_and_minerals.calcium.amount} ${nutritionData.vitamins_and_minerals.calcium.unit}`}
          </Text>
          <Text>
            {' '}
            - Iron:{' '}
            {nutritionData.vitamins_and_minerals.iron &&
              `${nutritionData.vitamins_and_minerals.iron.amount} ${nutritionData.vitamins_and_minerals.iron.unit}`}
          </Text>
          <Text>
            {' '}
            - Vitamin A:{' '}
            {nutritionData.vitamins_and_minerals.vitamin_a &&
              nutritionData.vitamins_and_minerals.vitamin_a.amount}
          </Text>
          <Text>
            {' '}
            - Vitamin C:{' '}
            {nutritionData.vitamins_and_minerals.vitamin_c &&
              nutritionData.vitamins_and_minerals.vitamin_c.amount}
          </Text> */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              // alignItems: 'center',
              // height: 100,
              width: Dimensions.get('window').width / 1.2,
              //borderRadius: 50,
              // borderWidth: 5,
              marginHorizontal: 5,
              marginVertical: 10,
              borderColor: theme.colors.warning,
              //fontSize: 18,
              //padding: 20,
            }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleDeleteFoodItem(mealId, index)}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={styles.buttontitle}>{i18n.t('delete')}</Text>
                <Iconclose color={'red'} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSendFoodFoodItemReq(index, item)}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={styles.buttontitle}>{i18n.t('submit')}</Text>
                <IconTickCircle color={'green'} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
    },

    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 10,
      borderRadius: 10,
      borderWidth: 0.3,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.secondary,
      margin: 4,

      //backgroundColor: theme.colors.grey5,
      height: Dimensions.get('window').height / 7,
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
      top: 10,
      backgroundColor: theme.colors.grey2,
    },
    list: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      margin: 5,
      borderBottomWidth: 0.3,
      borderBottomColor: theme.colors.border,
      paddingBottom: 2,
    },
    input: {
      height: 40,
      color: theme.colors.primary,
      fontSize: 14,
    },
    button: {
      //margin: 10,
      padding: 15,
      width: Dimensions.get('window').width / 2.5,
      height: 55,
      borderRadius: 10,
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary,
    },
    itemText: {
      color: theme.colors.white,
      fontSize: 16,
      fontWeight: 'bold',
    },
    itemValue: {
      color: theme.colors.white,
      fontSize: 16,
    },
    itemTitle: {
      color: theme.colors.warning,
      fontSize: 18,
      fontWeight: 'bold',
    },
  });
