import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('db.db');

const RecordChecker = () => {
  const [improvement, setImprovement] = useState({});

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS totalWeight (id INTEGER PRIMARY KEY AUTOINCREMENT, weight REAL, reps INTEGER, category TEXT, exerciseId INTEGER, totalWeight REAL, title TEXT, itemIndex INTEGER,timestamp DATETIME DEFAULT CURRENT_TIMESTAMP);'
      );
    });
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS userRecords (id INTEGER PRIMARY KEY AUTOINCREMENT, weightrecord REAL, repsrecored INTEGER, category TEXT, exerciseId INTEGER, title TEXT, itemIndex INTEGER,timestamp DATETIME DEFAULT CURRENT_TIMESTAMP);'
      );
    });

    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM totalWeight', [], (_, { rows }) =>
        //console.log(JSON.stringify(rows))
      );
    });
  }, []);

  useEffect(() => {
    // Create the table if it doesn't exist
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS totalWeight (id INTEGER PRIMARY KEY, weight INTEGER, reps INTEGER, category TEXT, exerciseId INTEGER, totalWeight INTEGER, title TEXT, itemIndex INTEGER, timestamp DATETIME);'
      );
    });

    // Fetch the latest two records for each exercise
    // Fetch all records from the totalWeight table
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT exerciseId, title, weight, reps, timestamp
        FROM totalWeight
        ORDER BY exerciseId, timestamp DESC;`,
        [],
        (_, { rows }) => {
          const data = rows._array;
          const improvementData = {};

          // Process the data and compare the latest record with the previous one
          data.forEach((record) => {
            const { exerciseId, title, weight, reps, timestamp } = record;

            if (!improvementData[exerciseId]) {
              improvementData[exerciseId] = {
                title,
                current: { weight, reps, timestamp },
              };
            } else if (!improvementData[exerciseId].previous) {
              improvementData[exerciseId].previous = {
                weight,
                reps,
                timestamp,
              };
            }
          });

          // Set the improvement state
          const finalImprovementData = {};

          Object.entries(improvementData).forEach(([exerciseId, data]) => {
            if (data.previous) {
              finalImprovementData[exerciseId] = {
                title: data.title,
                weight:
                  data.current.weight > data.previous.weight
                    ? 'Improved'
                    : data.current.weight === data.previous.weight
                    ? 'Same'
                    : 'Decreased',
                reps:
                  data.current.reps > data.previous.reps
                    ? 'Improved'
                    : data.current.reps === data.previous.reps
                    ? 'Same'
                    : 'Decreased',
              };
            } else {
              finalImprovementData[exerciseId] = {
                title: data.title,
                weight: 'No previous record',
                reps: 'No previous record',
              };
            }
          });

          setImprovement(finalImprovementData);
        }
      );
    });
  }, []);

  return (
    <View>
      <Text>Exercise Improvement</Text>
      {Object.entries(improvement).map(([exerciseId, data]) => (
        <View key={exerciseId}>
          <Text>{data.title}</Text>
          <Text>Weight: {data.weight}</Text>
          <Text>Reps: {data.reps}</Text>
        </View>
      ))}
    </View>
  );
};

export default RecordChecker;
