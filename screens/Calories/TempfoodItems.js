import React, { useState, useEffect } from 'react';
import { Dimensions, SafeAreaView, ScrollView, Text, View } from 'react-native';
import FoodItemCard from './FoodItemTempCard';

function TempfoodItems({ foodItems, userId, selectedMeal }) {
  // Initialize state with an empty array
  const [items, setItems] = useState(foodItems);
  console.log('items', foodItems);

  const handleInputChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  return (
    <ScrollView>
      {items.map((item, index) => (
        <FoodItemCard
          userId={userId}
          key={index}
          item={item}
          index={index}
          handleInputChange={handleInputChange}
          selectedMeal={selectedMeal}
        />
      ))}
    </ScrollView>
  );
}

export default TempfoodItems;
