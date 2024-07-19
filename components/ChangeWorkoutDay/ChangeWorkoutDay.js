import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const DaySelectionModal = ({
  visible,
  onClose,
  onSelectDay,
  daysOfWeek,
  selectedDays,
}) => {
  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select a Day</Text>
          {daysOfWeek.map((day) => (
            <TouchableOpacity
              key={day.id}
              onPress={() => onSelectDay(day.name)}
              disabled={selectedDays.includes(day.name)}
              style={[
                styles.dayButton,
                selectedDays.includes(day.name) && styles.disabledDayButton,
              ]}>
              <Text
                style={[
                  styles.dayButtonText,
                  selectedDays.includes(day.name) &&
                    styles.disabledDayButtonText,
                ]}>
                {day.name}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  dayButton: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  dayButtonText: {
    color: 'white',
    fontSize: 16,
  },
  disabledDayButton: {
    backgroundColor: '#CCCCCC',
  },
  disabledDayButtonText: {
    color: '#666666',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#FF0000',
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default DaySelectionModal;
