import React from 'react';
import { Dialog, Text } from '@rneui/themed';
import { View } from 'react-native';

function FitAlert({ visible, message, toggleDialog, buttonArray }) {
  return (
    <View>
      <Dialog isVisible={visible} onBackdropPress={toggleDialog}>
        <Dialog.Title title="Dialog Title" />
        <Text>{message}</Text>
        {buttonArray?.map((button, index) => {
          return (
            <Dialog.Button
              key={index}
              onPress={button.onPress}
              label={button.label}
            />
          );
        })}
      </Dialog>
    </View>
  );
}

export default FitAlert;
