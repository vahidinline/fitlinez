// CustomAlert.js
import React, { useContext, useState } from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import AuthContext from '../../api/context';
import LanguageContext from '../../api/langcontext';
import i18nt from '../../locales';
import { I18n } from 'i18n-js';

const AdModal = ({ visible, title, message, onConfirm, onCancel }) => {
  const { userAuth } = useContext(AuthContext);
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const [alertVisible, setAlertVisible] = useState(false);
  const isRTL = userLanguage === 'fa';
  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.confirmButton]}
              onPress={onConfirm}>
              <Text style={styles.buttonText}>{i18n.t('yes')}</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}>
              <Text style={styles.buttonText}>{i18n.t('no')}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  alertBox: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Vazirmatn',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Vazirmatn',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: 'green',
    marginRight: 5,
  },
  cancelButton: {
    backgroundColor: 'red',
    marginLeft: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Vazirmatn',
  },
});

export default AdModal;
