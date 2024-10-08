import { Button } from '@rneui/base';
import React, { useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import updatePlanDay from '../../api/changePlanDay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@rneui/themed';

const DaySelectionModal = ({
  visible,
  onClose,
  onSelectDay,
  daysOfWeek,
  selectedDays,
  workoutTitle,
  RTL,
  userId,
  theme,
  i18n,
}) => {
  const handleUpdateDay = async (day) => {
    onSelectDay(day);
    try {
      const res = await updatePlanDay(userId, workoutTitle, day);

      // Update local storage after cloud update
      const data = await AsyncStorage.getItem('workoutsList');
      const parsedData = JSON.parse(data) || {};

      if (
        parsedData.data &&
        parsedData.data.weeklyPlan &&
        Array.isArray(parsedData.data.weeklyPlan)
      ) {
        const updatedWeeklyPlan = parsedData.data.weeklyPlan.map((plan) => {
          if (plan.title === workoutTitle) {
            return { ...plan, dayName: day };
          }
          return plan;
        });

        const updatedData = {
          ...parsedData,
          data: {
            ...parsedData.data,
            weeklyPlan: updatedWeeklyPlan,
          },
        };

        await AsyncStorage.setItem('workoutsList', JSON.stringify(updatedData));

        console.log('Local data updated:', updatedData);
      } else {
        console.error('weeklyPlan is missing or not an array');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getLocalPackageData = async () => {
    const data = await AsyncStorage.getItem('workoutsList');
    const parsedData = JSON.parse(data);

    // console.log('parsedData', parsedData);
  };

  useEffect(() => {
    getLocalPackageData();
  }, []);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalSubTitle}>{workoutTitle}</Text>
          {daysOfWeek.map((day) => (
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: theme.colors.border,
                borderRadius: 8,
                width: Dimensions.get('window').width / 2,
                margin: 4,
              }}
              key={day.id}
              onPress={() => handleUpdateDay(day.name)}>
              <Text
                style={[
                  styles.dayText,
                  selectedDays?.includes(day.name) && styles.dayTextDisabled,
                ]}>
                {RTL ? day.nameT : day.name}
              </Text>
            </TouchableOpacity>
          ))}
          <Button
            buttonStyle={{
              backgroundColor: theme.colors.secondary,
              width: Dimensions.get('window').width / 2,
              height: 40,
              borderRadius: 8,
              marginTop: 5,
            }}
            title={i18n.t('close')}
            onPress={onClose}
            titleStyle={{
              fontFamily: 'Vazirmatn',
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

// Your styles for the modal
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    // fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Vazirmatn',
  },
  modalSubTitle: {
    fontSize: 16,
    marginBottom: 20,
    fontFamily: 'Vazirmatn',
  },
  dayText: {
    fontSize: 16,
    marginVertical: 5,
    fontFamily: 'Vazirmatn',
    textAlign: 'center',
  },
  dayTextDisabled: {
    color: 'gray',
  },
});

export default DaySelectionModal;
