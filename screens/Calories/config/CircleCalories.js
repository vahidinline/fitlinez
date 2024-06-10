import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const CircularProgress = ({ dailyCalories, result, i18n }) => {
  const percentage = (dailyCalories / result) * 100;
  const angle = (percentage / 100) * 360;

  return (
    <View style={styles.container}>
      <View
        style={[styles.circle, { transform: [{ rotate: `${angle}deg` }] }]}
      />
      <Text style={styles.percentage}>{percentage.toFixed(0)}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007bff', // Blue color
    position: 'absolute',
    top: 10,
    left: 10,
    overflow: 'hidden',
  },
  percentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
  },
});

export default CircularProgress;
