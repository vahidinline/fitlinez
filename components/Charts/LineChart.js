import { Divider, Text, useTheme } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
  VictoryLine,
  VictoryScatter,
} from 'victory-native';
import { Dimensions, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@rneui/themed';
import { material } from './theme';
const db = SQLite.openDatabase('userWeight.db'); // Open or create the database

const LineChartWeight = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [data, setData] = useState([]);
  const [mockData, setMockData] = useState([
    { x: 'Oct 10', y: 75 },
    { x: 'Oct 17', y: 73 },
    { x: 'Oct 20', y: 74 },
    { x: 'Oct 23', y: 72 },
    { x: 'Oct 30', y: 70 },
  ]);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS userWeight (id INTEGER PRIMARY KEY NOT NULL, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, weight NUMBER);'
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
          await tx.executeSql('SELECT * FROM userWeight', [], (_, results) => {
            let temp = [];
            for (let i = 0; i < results.rows.length; ++i) {
              const row = results.rows.item(i);
              const formattedDate = new Date(row.timestamp).toLocaleDateString(
                'en-US',
                {
                  month: 'short',
                  day: 'numeric',
                }
              );
              temp.push({
                y: row.weight,
                x: formattedDate,
              });
            }
            setData(temp);
          });
        });
      } catch (err) {
        console.error('Database error:', err);
      }
    };

    fetchData();
  }, []);

  const fill = theme.colors.secondary;

  return (
    <View
      style={{
        backgroundColor: theme.colors.primary,
        top: 10,
        // height: 50,
        //width: Dimensions.get('window').width - 50,
        // marginBottom: 10,
      }}>
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.colors.primary,
            // height: 50,
            width: Dimensions.get('window').width,
            // marginBottom: 10,
          }}>
          {data.length !== 0 ? (
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: theme.colors.primary,
                // height: 50,
                width: Dimensions.get('window').width,
                // marginBottom: 10,
                position: 'absolute',
                //left: 10,
                bottom: 60,
                top: 30,
              }}>
              <Text
                style={{
                  fontSize: 15,
                  //fontWeight: 'bold',
                  color: theme.colors.secondary,
                }}>
                Weight chart from {data[0]?.x} to {data[data.length - 1]?.x}
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  //fontWeight: 'bold',
                  color: theme.colors.secondary,
                }}>
                {data[0]?.y} kg to {data[data.length - 1]?.y} kg
              </Text>
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: theme.colors.primary,
                // height: 50,
                width: Dimensions.get('window').width,
                // marginBottom: 10,
                position: 'absolute',
                //left: 10,
                bottom: 60,
                top: 30,
                zIndex: 2,
              }}>
              <Button
                icon="plus"
                mode="contained"
                onPress={() => navigation.navigate('GetUserData')}
                style={{
                  backgroundColor: theme.colors.orange,
                  borderRadius: 5,
                  marginTop: 10,
                  marginBottom: 10,

                  zIndex: 20,
                }}>
                Add Weight
              </Button>
            </View>
          )}
          <View
            style={{
              zIndex: 1,
              opacity: data.length === 0 ? 0.5 : 1,
            }}>
            <VictoryChart
              theme={material}
              domain={{ y: [30, 200] }}
              height={Dimensions.get('window').height / 3}>
              <VictoryAxis
                style={{
                  axis: { stroke: theme.colors.secondary },
                  ticks: { stroke: theme.colors.secondary },
                  tickLabels: { fill: theme.colors.secondary },
                }}
              />

              <VictoryLine
                data={data ? data : mockData}
                labels={({ datum }) => datum.y + ' kg'}
                labelComponent={
                  <VictoryLabel
                    style={{
                      fill: theme.colors.orange,
                      fontSize: 15,
                    }}
                    dy={-20}
                    dx={-30}
                  />
                }
              />
            </VictoryChart>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LineChartWeight;
