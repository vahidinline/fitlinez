import React, { useEffect, useState } from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getCustomCalorieInTakeReport } from '../../api/dailyCalorieInTake';
import { useTheme } from '@rneui/themed';
import { Button, Text } from '@rneui/base';

const DatePickerExample = ({ userId }) => {
  const [date1, setDate1] = useState(new Date());
  const [date2, setDate2] = useState(new Date());
  const [showDatePicker1, setShowDatePicker1] = useState(false);
  const [showDatePicker2, setShowDatePicker2] = useState(false);
  const [status, setStatus] = useState('idle');
  const [report, setReport] = useState({});
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const onChangeDate1 = (event, selectedDate) => {
    const currentDate = selectedDate || date1;
    setShowDatePicker1(Platform.OS === 'ios');
    setDate1(currentDate);
  };

  const onChangeDate2 = (event, selectedDate) => {
    const currentDate = selectedDate || date2;
    setShowDatePicker2(Platform.OS === 'ios');
    setDate2(currentDate);
  };

  const showMode1 = () => {
    setShowDatePicker1(true);
  };

  const showMode2 = () => {
    setShowDatePicker2(true);
  };

  const handleGetReport = async () => {
    setStatus('loading');
    try {
      const result = await getCustomCalorieInTakeReport(
        userId,
        formatDate(date1),
        formatDate(date2)
      );

      setStatus('success');
      setReport(result);
    } catch (error) {
      setStatus('error');
      console.log('error in custom report', error);
    }
  };

  const formatDate = (date) => {
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <View style={styles.container}>
      {status === 'idle' && (
        <>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ marginBottom: 20 }}>
              <Button
                buttonStyle={styles.pickerButton}
                titleStyle={styles.buttontitle}
                onPress={showMode1}
                title="From"
              />
              <Text style={styles.dateText}> {formatDate(date1)}</Text>
              {showDatePicker1 && (
                <DateTimePicker
                  value={date1}
                  mode="date"
                  display="default"
                  onChange={onChangeDate1}
                />
              )}
            </View>
            <View>
              <Button
                buttonStyle={styles.pickerButton}
                titleStyle={styles.buttontitle}
                onPress={showMode2}
                title="To"
              />
              <Text style={styles.dateText}> {formatDate(date2)}</Text>
              {showDatePicker2 && (
                <DateTimePicker
                  value={date2}
                  mode="date"
                  display="default"
                  onChange={onChangeDate2}
                />
              )}
            </View>
          </View>

          <Button title="Get Report" onPress={() => handleGetReport()} />
        </>
      )}
    </View>
  );
};

export default DatePickerExample;

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
    },
    footerContainer: {
      padding: 20,
      flexDirection: 'column',
      justifyContent: 'center',
      backgroundColor: 'white',
      marginHorizontal: 15,
    },
    dateText: {
      color: 'white',
      fontSize: 16,
      margin: 10,
    },
    buttontitle: {
      color: theme.colors.Text,
      fontSize: 16,
      margin: 10,
    },
    pickerButton: {
      backgroundColor: 'white',
      color: 'black',
      fontSize: 16,
      margin: 10,
    },
  });
//     marginVertical: 10,
