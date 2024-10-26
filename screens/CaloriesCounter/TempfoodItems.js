import React, { useState, useEffect } from 'react';
import { Dimensions, SafeAreaView, ScrollView, Text, View } from 'react-native';
import FoodItemCard from './FoodItemTempCard';
import { useTheme } from '@rneui/themed';
import { Button } from '@rneui/base';
import AsyncStorage from '@react-native-async-storage/async-storage';

function TempfoodItems({ route }) {
  //get from navigation
  const { foodItems, userId, selectedMeal, setStatus, i18n } = route.params;
  const [items, setItems] = useState(foodItems?.currentFood.foodItems[0]);
  console.log('items in tempfooditems', foodItems.foodItems[0].userInput);
  const { theme } = useTheme();
  const handleInputChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleEndSession = () => {
    AsyncStorage.removeItem('foodInput');
    setItems([]);
    setStatus('idle');
  };

  const handleDeleteItem = (index) => {
    // console.log('Before deletion:', items);
    // console.log('Index to delete:', index);

    const newItems = items.filter((_, i) => i !== index); // More functional approach to filtering

    // console.log('After deletion:', newItems);

    setItems(newItems);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.red,
        height: Dimensions.get('window').height,
      }}>
      <FoodItemCard
        i18n={i18n}
        userId={userId}
        current={items?.currentFood}
        item={items}
        foodItems={items?.foodItems}
        foodId={foodItems?.currentFood._id}
        handleInputChange={handleInputChange}
        selectedMeal={items?.selectedMeal}
        handleDeleteItem={handleDeleteItem}
        setMainStatus={setStatus}
        title={foodItems.foodItems[0].userInput}
      />
    </SafeAreaView>
  );
}

export default TempfoodItems;
