import React, { useState, useEffect } from 'react';
import { Dimensions, SafeAreaView, ScrollView, Text, View } from 'react-native';
import FoodItemCard from './FoodItemTempCard';
import { useTheme } from '@rneui/themed';
import { Button } from '@rneui/base';
import AsyncStorage from '@react-native-async-storage/async-storage';

function TempfoodItems({ foodItems, userId, selectedMeal, setStatus, i18n }) {
  // console.log('TempfoodItems -> foodItems', foodItems);
  // Initialize state with an empty array
  const [items, setItems] = useState(foodItems.data);
  const [selectedItem, setSelectedItem] = useState();
  // console.log('TempfoodItems -> items', foodItems.data.foodId);
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
    <View
      style={{
        flex: 10,
        height: Dimensions.get('window').height,
      }}>
      <Text
        style={{
          textAlign: 'center',
          fontSize: 20,
          color: theme.colors.secondary,
        }}></Text>
      <ScrollView>
        <View style={{}}>
          <FoodItemCard
            i18n={i18n}
            userId={userId}
            // key={index}
            current={items?.currentFood}
            item={items.data}
            foodItems={items?.foodItems}
            foodId={foodItems?.data?.foodId}
            handleInputChange={handleInputChange}
            selectedMeal={items?.selectedMeal}
            handleDeleteItem={handleDeleteItem}
            setMainStatus={setStatus}
          />
        </View>
      </ScrollView>
    </View>
  );
}

export default TempfoodItems;
