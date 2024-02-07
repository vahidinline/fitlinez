import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';

const Walkthrough = () => {
  const { theme } = useTheme();
  const [currentScreen, setCurrentScreen] = useState(1);
  const styles = getStyles(theme); // Call the function inside the component
  const navigation = useNavigation();
  const handleNext = () => {
    if (currentScreen < 3) {
      setCurrentScreen(currentScreen + 1);
    }
  };

  const handlePrevious = () => {
    if (currentScreen > 1) {
      setCurrentScreen(currentScreen - 1);
    }
  };

  const handleExit = () => {
    navigation.navigate('Home');
  };

  // Check if it's the first time the user opens the app
  useEffect(() => {
    checkFirstTimeUser();
  }, []);

  const checkFirstTimeUser = async () => {
    try {
      const value = await AsyncStorage.getItem('@firstTime');
      if (value === null) {
        // First time user, set a flag in AsyncStorage
        await AsyncStorage.setItem('@firstTime', 'true');
      } else {
        // Returning user, set the flag to false
        await AsyncStorage.setItem('@firstTime', 'false');
      }
    } catch (error) {
      // Handle AsyncStorage errors if needed
    }
  };

  return (
    <View style={styles.container}>
      {currentScreen === 1 && (
        <View style={styles.screen}>
          <Text style={styles.heading}>Test Your Strength</Text>
          <Text style={styles.description}>
            This is the first screen of the walkthrough.
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}

      {currentScreen === 2 && (
        <View style={styles.screen}>
          <Text style={styles.heading}> Create a Personalised</Text>
          <Text style={styles.description}>workout plan to stay fit</Text>
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.button} onPress={handlePrevious}>
            <Text style={styles.buttonText}>Previous</Text>
          </TouchableOpacity> */}
        </View>
      )}

      {currentScreen === 3 && (
        <View style={styles.screen}>
          <Text style={styles.heading}>Last Screen</Text>
          <Text style={styles.description}>
            This is the last screen of the walkthrough.
          </Text>
          {/* <TouchableOpacity style={styles.button} onPress={handlePrevious}>
            <Text style={styles.buttonText}>Previous</Text>
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.button} onPress={handleExit}>
            <Text style={styles.buttonText}>Start Now </Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.dotsContainer}>
        <View style={[styles.dot, currentScreen === 1 && styles.activeDot]} />
        <View style={[styles.dot, currentScreen === 2 && styles.activeDot]} />
        <View style={[styles.dot, currentScreen === 3 && styles.activeDot]} />
      </View>
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primary,
    },
    screen: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    heading: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
      color: theme.colors.secondary,
    },
    description: {
      color: theme.colors.secondary,
      fontSize: 16,
      marginBottom: 20,
      textAlign: 'center',
    },
    button: {
      backgroundColor: theme.colors.secondary,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 25,
      marginBottom: 10,
    },
    buttonText: {
      color: theme.colors.primary,
      fontSize: 16,
    },
    dotsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: '#CCC',
      marginHorizontal: 5,
    },
    activeDot: {
      backgroundColor: '#007BFF',
    },
  });

export default Walkthrough;
