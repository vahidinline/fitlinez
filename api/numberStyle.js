import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const AthleticNumber = ({ number }) => {
  let suffix = 'th'; // Default suffix is "th"

  if (number === 1) {
    suffix = 'st'; // Use "st" for 1
  } else if (number === 2) {
    suffix = 'nd'; // Use "nd" for 2
  } else if (number === 3) {
    suffix = 'rd'; // Use "rd" for 3
  }

  return (
    <View style={styles.container}>
      <Text style={styles.number}>{number}</Text>
      <Text style={styles.suffix}>{suffix}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'center',
    //borderRadius: 50,
    //width: 100,
    //height: 50,
    //backgroundColor: '#FF6347', // Change this color to your desired athletic color
  },
  number: {
    color: '#3F3B6C',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    // textShadowColor: '#000',
    // textShadowOffset: { width: 2, height: 2 },
    // textShadowRadius: 3,
  },
  suffix: {
    color: '#3F3B6C',
    fontSize: 12,
    textAlign: 'center',
    // textShadowColor: '#000',
    // textShadowOffset: { width: 2, height: 2 },
    // textShadowRadius: 3,
  },
});

export default AthleticNumber;
