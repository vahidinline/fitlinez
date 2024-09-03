import { Text, useTheme } from '@rneui/themed';
import React, { useContext, useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { I18n } from 'i18n-js';
import i18nt from '../../locales';
import LanguageContext from '../../api/langcontext';
import AuthContext from '../../api/context';
import convertToPersianNumbers from '../../api/PersianNumber';
import AsyncStorage from '@react-native-async-storage/async-storage';

function BeforeSubmit({ onBeforeSubmitSelect, data }) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const { userAuth } = useContext(AuthContext);
  const [bio, setBio] = useState('');
  const RTL = userLanguage === 'fa';
  const [selectedIds, setSelectedIds] = useState([]);
  const isSelected = (id) => selectedIds.includes(id);
  const [selectedCalories, setSelectedCalories] = useState();
  const [status, setStatus] = useState('idle');
  const onSelect = ({ id, title, dailyCalories }) => {
    setSelectedIds([id]);
    console.log('title', title, 'dailyCalories', dailyCalories);
    getDailyCaloriesGoals(dailyCalories);
    setSelectedCalories(dailyCalories);
    setStatus('calorieSelected');
  };
  //onsole.log('bmr', bmr);
  // console.log('data', data);
  const [bmr, setBmr] = useState('');
  const [mildWeightLossCalories, setMildWeightLossCalories] = useState('');

  const [bulkWeightCalories, setBulkWeightCalories] = useState('');
  const [weightLossCalories, setWeightLossCalories] = useState('');
  const [extremeWeightLossCalories, setExtremeWeightLossCalories] =
    useState('');
  useEffect(() => {
    if (data && data.length > 0) {
      const gender = data[0]?.gender || 'person';
      const age = data[1]?.age || '';
      const height = data[2]?.height || '';
      const weight = data[3]?.weight || '';
      const goalWeight = `${convertToPersianNumbers(
        data[4]?.goalWeight || '',
        RTL
      )} ${i18n.t(data[4]?.unit || '')}`.trim();
      const activityLevel = data[8]?.activityLevel || '';
      const goal = data[5]?.mainGoal || '';
      const fitnessLevel = data[7]?.fitnessLevel || '';
      const activityLevelValue = data[8]?.value || 1; // Ensure this has a fallback value
      const daysPerWeek = convertToPersianNumbers(
        data[9]?.dayPreferences || '',
        RTL
      );
      const location = data[6]?.location || '';

      const phraseEn = `You are a ${age} year old ${gender} with a height of ${height} and a weight of ${weight} and activity level of ${activityLevel}, who wants to ${goal}. To reach  ${goalWeight} you can train ${daysPerWeek} days a week, your fitness level is ${fitnessLevel}, and you prefer to train at ${location}.`;
      const phraseFa = `شما یک ${gender}  ${convertToPersianNumbers(
        age,
        RTL
      )} ساله با قد ${convertToPersianNumbers(height, RTL)} ${i18n.t(
        'cm'
      )} و وزن ${convertToPersianNumbers(weight, RTL)} ${i18n.t(
        'kg'
      )} و با  ${activityLevel} که بدنبال ${goal} هستید. برای رسیدن به وزن ${goalWeight} می‌توانید ${daysPerWeek} در هفته تمرین کنید، سطح آمادگی جسمانی شما ${fitnessLevel} است و ترجیح می‌دهید در ${location} تمرین کنید.`;

      setBio(RTL ? phraseFa : phraseEn);

      let calculatedBmr = 0;
      if (data[0]?.id === 1) {
        // Male calculation
        calculatedBmr = 10 * weight + 6.25 * height - 5 * age + 5;
      } else {
        // Female calculation
        calculatedBmr = 10 * weight + 6.25 * height - 5 * age - 161;
      }

      const finalBmr = calculatedBmr * activityLevelValue;

      // Update the BMR state
      setBmr(Number(finalBmr).toFixed(0));
      setMildWeightLossCalories(finalBmr) * (0.89).toFixed(0); // 89% of maintenance
      setWeightLossCalories(Math.round(Number(finalBmr) * 0.81).toFixed(0)); // 79% of maintenance
      setExtremeWeightLossCalories(
        Math.round(Number(finalBmr) * 0.6) < 1200
          ? 1200
          : Math.round(Number(finalBmr) * 0.6)
      ); // 58% of maintenance
      setBulkWeightCalories(Math.round(Number(finalBmr) * 1.1)); // 110% of maintenance

      console.log('Calculated BMR:', calculatedBmr);
      console.log('Final BMR after activity level:', finalBmr);
    } else {
      console.log('Data is not available or empty');
    }
  }, [data]);

  const getDailyCaloriesGoals = async (dailyCalories) => {
    const carbsCalories = Math.round((dailyCalories / 100) * 40);
    const proteinCalories = Math.round((dailyCalories / 100) * 30);
    const fatCalories = Math.round((dailyCalories / 100) * 30);

    try {
      await AsyncStorage.setItem(
        'dailyCaloriesGoals',
        JSON.stringify({
          dailyCalories: dailyCalories,
          fatPercentage: 30,
          proteinPercentage: 30,
          carbsPercentage: 40,
          fatGrams: Math.round(fatCalories / 9),
          proteinGrams: Math.round(proteinCalories / 4),
          carbsGrams: Math.round(carbsCalories / 4),
        })
      );
    } catch (error) {
      console.error('Error saving dailyCaloriesGoals:', error);
    }
  };

  // New useEffect to handle changes to `bmr`
  useEffect(() => {
    console.log('bmr updated:', bmr); // This will show the correct value after the state has been updated

    if (bmr) {
      // Perform any actions you need after `bmr` is updated
      console.log('last step'); // This will now run when `bmr` has a value
    }
  }, [bmr]);

  const allCalories = [
    {
      id: 1,
      title: i18n.t('maintenanceCalorie'),
      description: i18n.t('maintenanceCalorieDesc'),
      dailyCalories: bmr,
    },
    {
      id: 2,
      title: i18n.t('bulkWeightCalories'),
      description: i18n.t('bulkWeightCaloriesDesc'),
      dailyCalories: bulkWeightCalories,
    },
    {
      id: 3,
      title: i18n.t('mildWeightLossCalories'),
      description: i18n.t('mildWeightLossCaloriesDesc'),
      dailyCalories: mildWeightLossCalories,
    },
    {
      id: 4,
      title: i18n.t('weightLossCalories'),
      description: i18n.t('weightLossCaloriesDesc'),
      dailyCalories: weightLossCalories,
    },
    {
      id: 5,
      title: i18n.t('extremeWeightLossCalories'),
      description: i18n.t('extremeWeightLossCaloriesDesc'),
      dailyCalories: extremeWeightLossCalories,
    },
  ];

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        //paddingTop: Dimensions.get('window').height / 15,
      }}>
      <View style={styles.fullBox}>
        <Text
          style={{
            fontFamily: 'Vazirmatn',
            textAlign: RTL ? 'right' : 'left',
            color: theme.colors.secondary,
            fontSize: 12,
          }}>
          {bio}
        </Text>
      </View>
      {/* <TouchableOpacity
        onPress={() =>
          onSelect({ title: i18n.t('maintenanceCalorie'), dailyCalories: bmr })
        }
        style={styles.selectedCalories}>
        <Text style={styles.title}>{i18n.t('maintenanceCalorie')}</Text>

        <Text style={styles.value}>
          {convertToPersianNumbers(bmr, RTL)} {i18n.t('caloriePerDay')}
        </Text>
        <Text style={styles.desc}>{i18n.t('maintenanceCalorieDesc')}</Text>
      </TouchableOpacity> */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: Dimensions.get('window').width / 1.1,
          flexWrap: 'wrap',
        }}>
        <FlatList
          data={allCalories}
          numColumns={2} // Specify the number of columns
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item.id}
              onPress={() =>
                onSelect({
                  id: item.id,
                  title: item.title,
                  dailyCalories: item.dailyCalories,
                })
              }
              style={[
                styles.halfBox,
                isSelected(item.id) && styles.selectedItem,
              ]}>
              <Text style={styles.title}>{item.title}</Text>
              <View
                style={{
                  borderBottomColor: theme.colors.border,
                  borderBottomWidth: 1,
                  width: '90%',
                }}
              />
              <Text style={styles.value}>
                {' '}
                {convertToPersianNumbers(item.dailyCalories, RTL)}{' '}
                {i18n.t('caloriePerDay')}
              </Text>
              <Text style={styles.desc}>{item.description}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    icon: {},
    text: {
      color: theme.colors.secondary,
      fontSize: 18,
      fontWeight: 'bold',
      justifyContent: 'flex-start',
      fontFamily: 'Vazirmatn',
    },

    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    desc: {
      fontSize: 10,
      fontWeight: '400',
      marginTop: 0,
      color: theme.colors.grey0,
      fontFamily: 'Vazirmatn',
    },
    title: {
      fontSize: 14,
      fontWeight: '400',
      color: theme.colors.grey0,
      fontFamily: 'Vazirmatn',
    },
    value: {
      fontSize: 14,
      fontWeight: '500',
      marginTop: 10,
      color: theme.colors.secondary,
      fontFamily: 'Vazirmatn',
    },
    selectedCalories: {
      backgroundColor: theme.colors.background,
      //alignItems: 'center',
      marginHorizontal: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 16,
      padding: 20,
      //    paddingTop: 5,
      marginBottom: 20,
      flexDirection: 'row',
      height: Dimensions.get('window').height / 12,
      // alignContent: 'center',
      // justifyContent: 'center',
    },
    fullBox: {
      backgroundColor: theme.colors.background,
      alignItems: 'center',
      marginHorizontal: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 16,
      padding: 20,
      paddingTop: 5,
      marginBottom: 20,
      height: Dimensions.get('window').height / 7,
      alignContent: 'center',
      justifyContent: 'center',
    },
    halfBox: {
      backgroundColor: theme.colors.background,
      alignItems: 'center',
      marginHorizontal: 15,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 16,
      padding: 5,
      height: Dimensions.get('window').height / 9,
      width: Dimensions.get('window').width / 2 - 50,
      alignContent: 'center',
      justifyContent: 'center',
    },
    unit: {
      color: theme.colors.grey0,
      fontSize: 12,
      fontWeight: '400',
      paddingLeft: 15,
      fontFamily: 'Vazirmatn',
    },
    selectedItem: {
      borderColor: theme.colors.secondary,
      backgroundColor: theme.colors.selected,
      borderWidth: 2,
    },
  });

export default BeforeSubmit;
