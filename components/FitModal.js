import React, { useState } from 'react';
import { View, Button, StyleSheet, Modal, Text } from 'react-native';

const FitModal = ({ visible, title, message, onClose }) => (
  <Modal
    transparent={true}
    visible={visible}
    animationType="slide"
    onRequestClose={onClose}>
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.title}>{'title'}</Text>
        <Text style={styles.message}>{'message'}</Text>
        <Button title="Close" onPress={onClose} />
      </View>
    </View>
  </Modal>
);

export default FitModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
  },
});
