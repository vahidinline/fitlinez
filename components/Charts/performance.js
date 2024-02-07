import { Button, ButtonGroup, Divider, Text, useTheme } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
  VictoryLine,
  VictoryPie,
  VictoryPolarAxis,
  VictoryScatter,
} from 'victory-native';
import { Dimensions, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { material } from './theme';
const db = SQLite.openDatabase('performance.db'); // Open or create the database

const PerformanceChart = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [data, setData] = useState(0);
  //console.log('data', data);
  const [mockData, setMockData] = useState([
    { x: 'Oct 10', y: 75 },
    { x: 'Oct 17', y: 73 },
    { x: 'Oct 20', y: 74 },
    { x: 'Oct 23', y: 72 },
    { x: 'Oct 30', y: 70 },
  ]);

  useEffect(() => {
    //create performance table

    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS performance (id INTEGER PRIMARY KEY AUTOINCREMENT,  category TEXT, location TEXT, timeSpent INTEGER, performance INTEGER, date TEXT);'
      );
    });
  }, []);

  useEffect(() => {
    //drop table
    // db.transaction((tx) => {
    //   tx.executeSql('DROP TABLE userWeight');
    //   console.log('table dropped');
    // });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        db.transaction(async (tx) => {
          await tx.executeSql('SELECT * FROM performance', [], (_, results) => {
            let tempObject = {}; // Temporary object to store performances
            for (let i = 0; i < results.rows.length; ++i) {
              const row = results.rows.item(i);
              const rawDate = new Date(row.date);
              if (isNaN(rawDate.getTime())) {
                // Check if the date is valid
                continue; // Skip this iteration if the date is not valid
              }
              const formattedDate = rawDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              });
              // Store or replace the performance for the formattedDate
              tempObject[formattedDate] = {
                y: row.performance,
                x: formattedDate,
              };
            }
            const tempArray = Object.values(tempObject); // Convert to array
            setData(tempArray);
          });
        });
      } catch (err) {
        console.error('Database error:', err);
      }
    };

    // const fetchData = async () => {
    //   try {
    //     db.transaction(async (tx) => {
    //       await tx.executeSql('SELECT * FROM performance', [], (_, results) => {
    //         let temp = [];
    //         for (let i = 0; i < results.rows.length; ++i) {
    //           const row = results.rows.item(i);
    //           const formattedDate = new Date(row.date).toLocaleDateString(
    //             'en-US',
    //             {
    //               month: 'short',
    //               day: 'numeric',
    //             }
    //           );
    //           temp.push({
    //             y: row.performance,
    //             x: formattedDate,
    //           });
    //         }
    //         setData(temp);
    //       });
    //     });
    //   } catch (err) {
    //     console.error('Database error:', err);
    //   }
    // };

    fetchData();
  }, []);

  const fill = theme.colors.secondary;
  const colors = ['#428517', '#77D200', '#D6D305', '#EC8E19', '#C92B05'];
  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        //top: 10,
        height: Dimensions.get('window').height / 5,
        //width: Dimensions.get('window').width - 50,
        marginBottom: 10,
      }}>
      <View
        style={{
          height: Dimensions.get('window').height,
          flexDirection: 'row',
          justifyContent: 'space-between',
          //marginTop: 20,
          marginBottom: 0,
          marginHorizontal: 10,
          backgroundColor: theme.colors.background,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.colors.background,
            height: Dimensions.get('window').height / 2,
            width: Dimensions.get('window').width,
            // marginBottom: 10,
          }}>
          {data.length !== 0 ? (
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: theme.colors.background,
                // height: 50,
                width: Dimensions.get('window').width,
                // marginBottom: 10,
                position: 'absolute',
                //left: 10,
                bottom: 60,
                top: 30,
              }}></View>
          ) : null}
          <View
            style={{
              zIndex: 1,
              opacity: data.length === 0 ? 0.5 : 1,
            }}>
            <VictoryChart domainPadding={30}>
              <VictoryBar
                cornerRadius={{ top: ({ datum }) => datum.y * 0.1 }}
                style={{
                  data: { fill: theme.colors.secondary },
                }}
                labels={({ datum }) => `${datum.y}%`}
                theme={{ material }}
                domain={{ y: [0, 100] }}
                data={data && data.length > 0 ? data : mockData}
              />
            </VictoryChart>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PerformanceChart;
