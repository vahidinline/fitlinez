import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, ListItem, Text } from '@rneui/base';
import { useTheme } from '@rneui/themed';
import React, { useState, useEffect } from 'react';
import { Alert, Dimensions, StyleSheet, TextInput, View } from 'react-native';
import { setDailyCaloriesGoals } from '../../../api/calculateCaloriesPercentage';
import NutritionChart from '../NutritionChart';
import { Picker } from '@react-native-picker/picker';

const pickerData = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

function SetDailyCalories({ userId, setStatus, i18n }) {
  // const [status, setStatus] = useState('idle');
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [dailyCalories, setDailyCalories] = useState(0);
  const [fatPercentage, setFatPercentage] = useState(30);
  const [proteinPercentage, setProteinPercentage] = useState(30);
  const [carbsPercentage, setCarbsPercentage] = useState(40);
  const [carbsGrams, setCarbsGrams] = useState(0);
  const [proteinGrams, setProteinGrams] = useState(0);
  const [fatGrams, setFatGrams] = useState(0);
  const [typeStatus, setTypeStatus] = useState('idle');

  const valuechecker = () => {
    if (fatPercentage + proteinPercentage + carbsPercentage != 100) {
      Alert.alert(
        'Error',
        'The sum of fat, protein, and carbs percentages must be 100.'
      );
      return false;
    }
    return true;
  };

  useEffect(() => {
    valuechecker();
  }, []);

  const handleInput = (e) => {
    //if (!valuechecker()) return;
    s; // return;
    setDailyCalories(parseInt(e.nativeEvent.text));
  };

  const handleSetCalories = async () => {
    setStatus('loading');
    try {
      setDailyCaloriesGoals(
        dailyCalories,
        fatPercentage,
        proteinPercentage,
        carbsPercentage,
        fatGrams,
        proteinGrams,
        carbsGrams,
        userId
      );
      await AsyncStorage.setItem(
        'dailyCaloriesGaols',
        JSON.stringify({
          dailyCalories,
          fatPercentage,
          proteinPercentage,
          carbsPercentage,
          fatGrams,
          proteinGrams,
          carbsGrams,
        })
      );
      setStatus('idle');
    } catch (error) {
      console.error('Failed to set data:', error);
      setStatus('error');
    }
  };

  useEffect(() => {
    const carbsCalories = Math.round((dailyCalories / 100) * carbsPercentage);
    const proteinCalories = Math.round(
      (dailyCalories / 100) * proteinPercentage
    );
    const fatCalories = Math.round((dailyCalories / 100) * fatPercentage);

    setCarbsGrams(Math.round(carbsCalories / 4));
    setProteinGrams(Math.round(proteinCalories / 4));
    setFatGrams(Math.round(fatCalories / 9));
  }, [dailyCalories, fatPercentage, proteinPercentage, carbsPercentage]);

  useEffect(() => {
    const getDailyCaloriesGoals = async () => {
      const dailyCaloriesGoals = await AsyncStorage.getItem(
        'dailyCaloriesGaols'
      );
      if (
        dailyCaloriesGoals !== 0 &&
        dailyCaloriesGoals !== null &&
        dailyCaloriesGoals !== undefined
      ) {
        const parsedDailyCaloriesGoals = JSON.parse(dailyCaloriesGoals);
        setDailyCalories(parsedDailyCaloriesGoals.dailyCalories);
        setFatPercentage(parsedDailyCaloriesGoals.fatPercentage);
        setProteinPercentage(parsedDailyCaloriesGoals.proteinPercentage);
        setCarbsPercentage(parsedDailyCaloriesGoals.carbsPercentage);
      }
    };
    getDailyCaloriesGoals();
  }, []);

  const handlePercent = (e) => {
    const { name, text } = e.nativeEvent;
    const value = parseInt(text);

    if (!value || value <= 0) {
      Alert.alert('Invalid input', 'Value cannot be 0 or empty');
      return;
    }

    switch (name) {
      case 'dailyCalories':
        setDailyCalories(parseInt(text));
        break;
      case 'carbohydrates':
        setCarbsPercentage(parseInt(text));
        break;
      case 'protein':
        setProteinPercentage(parseInt(text));
        break;
      case 'fat':
        setFatPercentage(parseInt(text));
        break;
      default:
        break;
    }
  };
  return (
    <View
      style={{
        height: '100%',

        bottom:
          typeStatus === 'focused' ? Dimensions.get('window').height / 4 : 0,
      }}>
      <NutritionChart
        i18n={i18n}
        dailyCalories={dailyCalories}
        fatPercentage={fatPercentage}
        proteinPercentage={proteinPercentage}
        carbsPercentage={carbsPercentage}
        fatGrams={fatGrams}
        proteinGrams={proteinGrams}
        carbsGrams={carbsGrams}
      />
      <View style={styles.container}>
        <ListItem>
          <ListItem.Content
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}>
            <View style={{ flexDirection: 'row' }}>
              <ListItem.Title
                style={{
                  color: theme.colors.text,
                  fontSize: 18,
                  fontWeight: 'bold',
                }}>
                Set Daily Calories
              </ListItem.Title>
            </View>
            <TextInput
              returnKeyType="done"
              style={styles.input}
              name="dailyCalories"
              placeholder="Enter daily calories"
              defaultValue={dailyCalories.toString() || '0'}
              keyboardType="numeric"
              onChangeText={(e) => setDailyCalories(parseInt(e))}
              onSubmitEditing={handleInput}
              onFocus={() => setTypeStatus('focused')}
            />
          </ListItem.Content>
        </ListItem>

        <ListItem>
          <ListItem.Content
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}>
            <View style={{ flexDirection: 'row' }}>
              <ListItem.Title>Carbohydrates</ListItem.Title>
              <Text style={styles.subs}>{carbsGrams} g</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <TextInput
                returnKeyType="done"
                name="carbohydrates"
                placeholder="Enter percentage"
                defaultValue={carbsPercentage.toString()}
                keyboardType="numeric"
                onChangeText={(text) =>
                  handlePercent({
                    nativeEvent: { name: 'carbohydrates', text },
                  })
                }
                onSubmitEditing={(e) => handlePercent(e)}
                onFocus={() => setTypeStatus('focused')}
              />
              <Text style={styles.subs}>%</Text>
            </View>
          </ListItem.Content>
        </ListItem>

        <ListItem>
          <ListItem.Content
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}>
            <View style={{ flexDirection: 'row' }}>
              <ListItem.Title>Protein</ListItem.Title>
              <Text style={styles.subs}>{proteinGrams} g</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <TextInput
                returnKeyType="done"
                name="protein"
                placeholder="Enter percentage"
                defaultValue={proteinPercentage.toString()}
                keyboardType="numeric"
                onChangeText={(text) =>
                  handlePercent({ nativeEvent: { name: 'protein', text } })
                }
                onSubmitEditing={(e) => handlePercent(e)}
                onFocus={() => setTypeStatus('focused')}
              />
              <Text style={styles.subs}>%</Text>
            </View>
          </ListItem.Content>
        </ListItem>

        <ListItem>
          <ListItem.Content
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}>
            <View style={{ flexDirection: 'row' }}>
              <ListItem.Title>Fat</ListItem.Title>
              <Text style={styles.subs}>{fatGrams} g</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <TextInput
                returnKeyType="done"
                name="fat"
                placeholder="Enter percentage"
                defaultValue={fatPercentage.toString()}
                keyboardType="numeric"
                onChangeText={(text) =>
                  handlePercent({ nativeEvent: { name: 'fat', text } })
                }
                onSubmitEditing={(e) => handlePercent(e)}
                onFocus={() => setTypeStatus('focused')}
              />

              <Text style={styles.subs}>%</Text>
            </View>
          </ListItem.Content>
        </ListItem>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: 20,
          }}>
          <Button
            buttonStyle={[
              styles.Button,
              {
                backgroundColor: theme.colors.buttonSecondary,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: theme.colors.border,
              },
            ]}
            title="Cancel"
            titleStyle={[styles.buttonTitle, { color: theme.colors.text }]}
            onPress={() => setStatus('idle')}
          />
          <Button
            buttonStyle={styles.Button}
            title="Save"
            titleStyle={styles.buttonTitle}
            onPress={() => handleSetCalories()}
          />
        </View>
      </View>
    </View>
  );
}

export default SetDailyCalories;

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      marginHorizontal: 10,
      padding: 10,
      borderRadius: 10,
      backgroundColor: theme.colors.background,
    },
    buttonTitle: {
      color: theme.colors.primary,
      fontWeight: 'bold',
      fontSize: 16,
    },
    input: {
      color: theme.colors.text,
      fontSize: 24,
      fontWeight: 'bold',
    },
    subs: {
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: 'normal',
      marginLeft: 10,
    },
    Button: {
      padding: 5,
      width: '80%',
      height: 40,
      backgroundColor: '#fff',
      borderRadius: 5,
      marginHorizontal: 5,
      marginBottom: 10,
      backgroundColor: theme.colors.button,
    },
  });
