import { Button } from '@rneui/base';
import React, { useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import updatePlanDay from '../../api/changePlanDay';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DaySelectionModal = ({
  visible,
  onClose,
  onSelectDay,
  daysOfWeek,
  selectedDays,
  workoutTitle,
  RTL,
  userId,
}) => {
  const handleUpdateDay = async (day) => {
    console.log('day', day);
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
    console.log('parsedData', parsedData);
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
          <Button title="Close" onPress={onClose} />
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
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalSubTitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  dayText: {
    fontSize: 16,
    marginVertical: 5,
  },
  dayTextDisabled: {
    color: 'gray',
  },
});

export default DaySelectionModal;
