import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, ListItem, Text } from '@rneui/base';
import { useTheme } from '@rneui/themed';
import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { setDailyCaloriesGoals } from '../../../api/calculateCaloriesPercentage';

function SetDailyCalories({ userId, setStatus }) {
  // const [status, setStatus] = useState('idle');
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [dailyCalories, setDailyCalories] = useState(1750);
  const [fatPercentage, setFatPercentage] = useState(30);
  const [proteinPercentage, setProteinPercentage] = useState(30);
  const [carbsPercentage, setCarbsPercentage] = useState(40);

  const [carbsGrams, setCarbsGrams] = useState(0);
  const [proteinGrams, setProteinGrams] = useState(0);
  const [fatGrams, setFatGrams] = useState(0);

  const handleInput = (e) => {
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
      console.log('dailyCaloriesGaols', dailyCaloriesGoals);
      if (dailyCaloriesGoals) {
        const parsedDailyCaloriesGoals = JSON.parse(dailyCaloriesGoals);
        setDailyCalories(parsedDailyCaloriesGoals.dailyCalories);
        setFatPercentage(parsedDailyCaloriesGoals.fatPercentage);
        setProteinPercentage(parsedDailyCaloriesGoals.proteinPercentage);
        setCarbsPercentage(parsedDailyCaloriesGoals.carbsPercentage);
      }
    };
    getDailyCaloriesGoals();
  }, []);

  return (
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
            <ListItem.Title>Set Daily Calories</ListItem.Title>
          </View>
          <TextInput
            style={styles.input}
            name="dailyCalories"
            placeholder="Enter daily calories"
            defaultValue={dailyCalories.toString()}
            keyboardType="numeric"
            onSubmitEditing={handleInput}
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
              name="carbohydrates"
              placeholder="Enter percentage"
              defaultValue={carbsPercentage.toString()}
              keyboardType="numeric"
              onSubmitEditing={(e) =>
                setCarbsPercentage(parseInt(e.nativeEvent.text))
              }
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
              name="protein"
              placeholder="Enter percentage"
              defaultValue={proteinPercentage.toString()}
              keyboardType="numeric"
              onSubmitEditing={(e) =>
                setProteinPercentage(parseInt(e.nativeEvent.text))
              }
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
              name="fat"
              placeholder="Enter percentage"
              defaultValue={fatPercentage.toString()}
              keyboardType="numeric"
              onSubmitEditing={(e) =>
                setFatPercentage(parseInt(e.nativeEvent.text))
              }
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
          buttonStyle={styles.Button}
          title="Cancel"
          titleStyle={styles.buttonTitle}
          onPress={() => console.log('Cancel')}
        />
        <Button
          buttonStyle={styles.Button}
          title="Save"
          titleStyle={styles.buttonTitle}
          onPress={() => handleSetCalories()}
        />
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
    buttonTitle: { color: theme.colors.text, fontWeight: 'bold', fontSize: 16 },
    input: {
      color: theme.colors.text,
      fontSize: 18,
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
    },
  });
