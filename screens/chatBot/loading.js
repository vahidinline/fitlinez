import React from 'react';
import { Dimensions, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

function Loading() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        flexDirection: 'row',
        width: Dimensions.get('window').width,
      }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}

export default Loading;
