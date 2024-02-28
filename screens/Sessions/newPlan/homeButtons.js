import React from 'react';
import { View } from 'react-native';
import { Button } from '@rneui/themed';

const CircleButtonLayout = () => {
  const buttonSize = 80; // Adjust the size of the buttons as per your requirement
  const containerSize = buttonSize * 2.5; // Adjust the container size based on the button size

  return (
    <View
      style={{
        width: containerSize,
        height: containerSize,
        borderRadius: containerSize / 2,
        overflow: 'hidden',
      }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button
          mode="contained"
          style={{
            width: buttonSize,
            height: buttonSize,
            borderRadius: buttonSize / 2,
          }}>
          Button 1
        </Button>
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button
          mode="contained"
          style={{
            width: buttonSize,
            height: buttonSize,
            borderRadius: buttonSize / 2,
          }}>
          Button 2
        </Button>
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button
          mode="contained"
          style={{
            width: buttonSize,
            height: buttonSize,
            borderRadius: buttonSize / 2,
          }}>
          Button 3
        </Button>
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button
          mode="contained"
          style={{
            width: buttonSize,
            height: buttonSize,
            borderRadius: buttonSize / 2,
          }}>
          Button 4
        </Button>
      </View>
    </View>
  );
};

export default CircleButtonLayout;
