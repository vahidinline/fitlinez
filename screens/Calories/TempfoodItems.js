import React, { useState, useEffect } from 'react';
import { Dimensions, SafeAreaView, ScrollView, Text, View } from 'react-native';
import FoodItemCard from './FoodItemTempCard';
import { useTheme } from '@rneui/themed';
import { Button } from '@rneui/base';
import AsyncStorage from '@react-native-async-storage/async-storage';

function TempfoodItems({ foodItems, userId, selectedMeal, setStatus, i18n }) {
  // Initialize state with an empty array
  const [items, setItems] = useState(foodItems);
  console.log('TempfoodItems -> items', items);
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
        }}>
        {items.length > 0 ? 'Total Items: ' + items.length : 'No items added'}
      </Text>
      <ScrollView>
        <View style={{}}>
          {items.map((item, index) => (
            <FoodItemCard
              i18n={i18n}
              userId={userId}
              key={index}
              item={item}
              index={index}
              handleInputChange={handleInputChange}
              selectedMeal={selectedMeal}
            />
          ))}
        </View>
      </ScrollView>
      <View>
        <Button
          buttonStyle={{
            backgroundColor: theme.colors.secondary,

            borderColor: theme.colors.primary,
            borderWidth: 0.2,

            margin: 10,
            borderRadius: 10,
          }}
          titleStyle={{
            color: theme.colors.primary,
            fontSize: 15,
            fontWeight: 'bold',
          }}
          title={i18n.t('back')}
          onPress={() => handleEndSession()}
        />
      </View>
    </View>
  );
}

export default TempfoodItems;
