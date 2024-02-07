import React from 'react';
import { Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from '@rneui/themed';
import { Avatar } from '@rneui/themed';

const Tile = ({ title, onPress, image }) => {
  return (
    <TouchableOpacity style={styles.tile} onPress={onPress}>
      <Image source={image} style={{ width: '100%', height: '80%' }} />
      <Text style={styles.tileText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tile: {
    width: '100%', // or any desired width
    height: 100, // or any desired height
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2, // gives a small space between tiles
    borderRadius: 5,
  },
  tileText: {
    marginTop: 10,
  },
});

export default Tile;
