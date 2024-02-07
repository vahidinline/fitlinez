import React, { useState } from 'react';
import { Button, Overlay, Icon, CheckBox, useTheme } from '@rneui/themed';
import { View, Text, StyleSheet } from 'react-native';

const AlertUser = ({ setOpenAlert, openAlert, msg, title }) => {
  const [visible, setVisible] = useState(true);
  const { theme } = useTheme();
  const [checked, setChecked] = useState(true);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  return (
    <View>
      <Overlay
        isVisible={visible}
        onBackdropPress={() => setOpenAlert(!openAlert)}>
        <Text style={styles.textPrimary}>{title}</Text>
        <Text style={styles.textSecondary}>{msg}</Text>
        <Button
          buttonStyle={styles.button}
          title="Close"
          onPress={() => {
            setOpenAlert(!openAlert);
          }}
        />
      </Overlay>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    margin: 10,
    borderRadius: 10,
    backgroundColor: '#1E90FF',
  },
  textPrimary: {
    marginVertical: 20,
    textAlign: 'center',
    fontSize: 20,
  },
  textSecondary: {
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 17,
  },
});

export default AlertUser;
