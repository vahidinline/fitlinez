import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [nutritionFacts, setNutritionFacts] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    axios
      .get(`https://world.openfoodfacts.org/api/v0/product/${data}.json`)
      .then((response) => {
        const product = response.data.product;
        const newNutritionFacts = {
          calories: product.nutriments.energy_value,
          fat: product.nutriments.fat_value,
          protein: product.nutriments.proteins_value,
          carbs: product.nutriments.carbohydrates_value,
        };
        setNutritionFacts(newNutritionFacts);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {scanned ? (
        <View style={styles.nutritionFactsContainer}>
          {nutritionFacts ? (
            <View>
              <Text>Calories: {nutritionFacts.calories} kcal</Text>
              <Text>Fat: {nutritionFacts.fat} g</Text>
              <Text>Protein: {nutritionFacts.protein} g</Text>
              <Text>Carbs: {nutritionFacts.carbs} g</Text>
            </View>
          ) : (
            <Text>No nutrition facts found</Text>
          )}
          <Button title="Scan again" onPress={() => setScanned(false)} />
        </View>
      ) : (
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  nutritionFactsContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
