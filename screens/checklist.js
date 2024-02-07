import { Calendar } from 'react-native-calendars';
import { StyleSheet, ScrollView, View, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
import moment from 'moment';

export default function CheckList(props) {
  console.log('props', props.date);
  const [markedDates, setMarkedDates] = useState({});
  const [workoutDate, setWorkoutDate] = useState([]);

  useEffect(() => {
    setWorkoutDate(props.date);
  }, []);
  const getMarkedDates = () => {
    workoutDate?.map((item) => {
      setMarkedDates((current) => ({
        ...current,
        [item]: {
          selected: true,
          selectedColor: 'green',
          dotColor: 'red',
          activeOpacity: 0,
        },
      }));
    });
  };
  useEffect(() => {
    getMarkedDates();
  }, [workoutDate]);
  return (
    <SafeAreaView style={{ paddingTop: 100 }}>
      <ScrollView>
        <>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
            <Calendar markedDates={markedDates} />
          </View>
        </>
      </ScrollView>
    </SafeAreaView>
  );
}

const Styles = StyleSheet.create({
  text: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  title: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  tableText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  container: {
    margin: 10,
    borderRadius: 10,
    padding: 10,
    flex: 1,
    top: Platform.OS === 'ios' ? 30 : 40,
  },
});
