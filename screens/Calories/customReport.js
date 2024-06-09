import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Platform,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getCustomCalorieInTakeReport } from '../../api/dailyCalorieInTake';
import { useTheme } from '@rneui/themed';
import { Button, Text, Tab, TabView } from '@rneui/base';
import AuthContext from '../../api/context';
import ListReport from './reports/ListReport';
import Header from '../../components/header';
import LanguageContext from '../../api/langcontext';
import i18nt from '../../locales';
import { I18n } from 'i18n-js';

const CustomCalorieReport = () => {
  const { userAuth } = useContext(AuthContext);
  const [date1, setDate1] = useState(new Date());
  const [date2, setDate2] = useState(new Date());
  const [showDatePicker1, setShowDatePicker1] = useState(false);
  const [showDatePicker2, setShowDatePicker2] = useState(false);
  const [status, setStatus] = useState('idle');
  const [report, setReport] = useState({});
  const [index, setIndex] = useState(0);
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
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

  useEffect(() => {
    if (index === 0) {
      handleGetWeeklyReport();
    } else if (index === 1) {
      handleGetMonthlyReport();
    }
  }, [index]);

  const handleGetWeeklyReport = async () => {
    setStatus('loading');
    try {
      const result = await getCustomCalorieInTakeReport(
        userAuth.id,
        //calculate 7 days ago
        new Date(new Date().setDate(new Date().getDate() - 8)),
        new Date(new Date().setDate(new Date().getDate() - 1))
      );
      setStatus('success');
      setReport(result);
    } catch (error) {
      setStatus('error');
      console.log('error in weekly report', error);
    }
  };

  const handleGetMonthlyReport = async () => {
    setStatus('loading');
    try {
      const result = await getCustomCalorieInTakeReport(
        userAuth.id,
        //calculate 30 days ago
        new Date(new Date().setDate(new Date().getDate() - 31)),
        new Date(new Date().setDate(new Date().getDate() - 1))
      );
      setStatus('success');
      setReport(result);
    } catch (error) {
      setStatus('error');
      console.log('error in weekly report', error);
    }
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
        userAuth._id,
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
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        width: Dimensions.get('window').width,
      }}>
      <Header
        title={i18n.t('caloriesReport')}
        rightContent={
          <Button
            onPress={() => navigation.navigate('CalorieSettings')}
            title="Settings"
          />
        }
      />
      <View style={styles.container}>
        <Tab value={index} onChange={setIndex} dense>
          <Tab.Item>{<Text>{i18n.t('lastWeek')}</Text>}</Tab.Item>
          <Tab.Item>{<Text>{i18n.t('lastMonth')}</Text>}</Tab.Item>
          {/* <Tab.Item>Custom Dates</Tab.Item> */}
        </Tab>

        <TabView value={index} onChange={setIndex}>
          <TabView.Item>
            {status === 'success' && <ListReport i18n={i18n} report={report} />}
          </TabView.Item>
          <TabView.Item>
            {status === 'success' && <ListReport i18n={i18n} report={report} />}
          </TabView.Item>
          {/* <TabView.Item>
            <Text>Custom Date</Text>
          </TabView.Item> */}
        </TabView>

        {/* {status === 'idle' && (
          <>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ marginBottom: 20 }}>
                <Button
                  // buttonStyle={styles.pickerButton}
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
                  // buttonStyle={styles.pickerButton}
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
          </>
        )} */}
        {/* {status === 'loading' && (  } */}

        <Button
          buttonStyle={styles.pickerButton}
          title="Get Report"
          onPress={() => handleGetReport()}
        />
      </View>
    </SafeAreaView>
  );
};

export default CustomCalorieReport;

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      //flex: 1,
      //justifyContent: 'center',
      padding: 20,
      //backgroundColor: theme.colors.primary,
      height: '100%',
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
      position: 'absolute',
      // top: 10,
      bottom: 100,
      backgroundColor: theme.colors.secondary,
      color: 'black',
      fontSize: 16,
      margin: 10,
      width: 100,
      height: 40,
    },
  });
//     marginVertical: 10,
