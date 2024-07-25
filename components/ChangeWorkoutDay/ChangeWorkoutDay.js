import { Button } from '@rneui/base';
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import updatePlanDay from '../../api/changePlanDay';

const DaySelectionModal = ({
  visible,
  onClose,
  onSelectDay,
  daysOfWeek,
  selectedDays,
  dayExerciseName,
  workoutTitle,
  RTL,
  userId,
}) => {
  const handleUpdateDay = async (userId, title, day) => {
    try {
      const res = await updatePlanDay(userId, title, day);
      console.log('res', res);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{dayExerciseName}</Text>
          <Text style={styles.modalSubTitle}>{workoutTitle}</Text>
          {/* Display the workout title here */}
          {daysOfWeek.map((day) => (
            <TouchableOpacity
              key={day.id}
              onPress={() => onSelectDay(day.name)}
              // disabled={selectedDays.includes(day.name)}>
            >
              <Text
                style={[
                  styles.dayText,
                  selectedDays?.includes(day.name) && styles.dayTextDisabled,
                ]}>
                {RTL ? day.nameT : day.name}
                {userId}
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
