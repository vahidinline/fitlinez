import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Checkbox from 'expo-checkbox';
import { useNavigation } from '@react-navigation/native';
const DatabaseClearer = () => {
  const [databases, setDatabases] = useState([]);
  const [selectedDatabases, setSelectedDatabases] = useState({});
  const navigation = useNavigation();
  useEffect(() => {
    // Fetch the list of databases. This part depends on how you track your databases.
    // For this example, let's assume we have a predefined list of database names
    const dbList = [
      'totalWeight.db',
      'user.db',
      'userWorkOutSession.db',
      'packeges.db',
    ]; // Replace with actual database names
    setDatabases(dbList);

    // Initialize selectedDatabases state
    const initialSelection = dbList.reduce((acc, dbName) => {
      acc[dbName] = false;
      return acc;
    }, {});
    setSelectedDatabases(initialSelection);
  }, []);

  const handleCheckboxChange = (dbName, value) => {
    setSelectedDatabases((prev) => ({ ...prev, [dbName]: value }));
  };

  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      alert('AsyncStorage cache cleared!');
    } catch (e) {
      alert('Failed to clear AsyncStorage cache');
    }
  };

  const dropDatabases = () => {
    Object.keys(selectedDatabases).forEach((dbName) => {
      if (selectedDatabases[dbName]) {
        const db = SQLite.openDatabase(dbName);

        db.transaction((tx) => {
          tx.executeSql(
            `DROP TABLE IF EXISTS packeges`,
            [],
            () => {
              alert(`Database packeges dropped successfully`);
              navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
              });
            },
            (error) => {
              alert(`Failed to drop database packeges: ${error.message}`);
            }
          );
        });
      }
    });
  };

  return (
    <View style={styles.container}>
      {databases.map((dbName, index) => (
        <View key={index} style={styles.checkboxContainer}>
          <Checkbox
            value={selectedDatabases[dbName]}
            onValueChange={(newValue) => handleCheckboxChange(dbName, newValue)}
          />
          <Text>{dbName}</Text>
        </View>
      ))}
      <Button title="Drop Selected Databases" onPress={dropDatabases} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
});

export default DatabaseClearer;
