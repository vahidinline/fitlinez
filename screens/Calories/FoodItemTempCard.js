import React, { useState } from 'react';
import { TextInput, View, StyleSheet, Text, Dimensions } from 'react-native';
import { sendFoodQuery } from '../../api/sendFoodQuery';
import { useTheme } from '@rneui/themed';
import { Button } from '@rneui/base';
import { ActivityIndicator } from 'react-native-paper';

const FoodItemCard = ({
  item,
  index,
  handleInputChange,
  userId,
  selectedMeal,
  i18n,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [status, setStatus] = useState('idle');
  const [nutritionData, setNutritionData] = useState(null);
  console.log('FoodItemCard -> nutritionData', nutritionData);
  const handleSendFoodItemReq = async () => {
    setStatus('loading');
    try {
      const res = await sendFoodQuery(item, userId, selectedMeal.value);
      console.log('FoodItemCard -> res', res);
      if (res) {
        setNutritionData(res);

        setStatus('dataLoaded');
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
      console.error('Failed to send data:', error);
    }
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
          <View style={{ flexDirection: 'column' }}>
            <TextInput
              style={[
                styles.input,
                {
                  width: '100%',
                  borderWidth: 0.1,
                  fontSize: 18,
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
            <Button
              type="outline"
              buttonStyle={styles.button}
              title={i18n.t('seeNutrition')}
              titleStyle={{
                color: theme.colors.primary,
                fontSize: 16,
                fontWeight: 'bold',
              }}
              onPress={() => {
                handleSendFoodItemReq();
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: 100,
              width: 100,
              borderRadius: 50,
              borderWidth: 5,
              marginHorizontal: 10,
              marginVertical: 10,
              borderColor: theme.colors.warning,
              fontSize: 18,
              padding: 20,
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
              onChangeText={(value) => handleInputChange(index, 'unit', value)}
            />
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
              {nutritionData.food_item && nutritionData.food_item}{' '}
              {i18n.t('submitted')}
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
        </View>
      )}
    </View>
  );
};

export default FoodItemCard;

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 10,
      borderRadius: 10,
      borderWidth: 0.3,
      borderColor: theme.colors.border,
      margin: 4,

      //backgroundColor: theme.colors.grey5,
      height: Dimensions.get('window').height / 6,
    },
    card: {
      padding: 10,
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
      margin: 10,
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
      margin: 10,
      padding: 10,
      //width: 60,
      height: 60,
      borderRadius: 6,
      borderColor: theme.colors.primary,
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
