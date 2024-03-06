import React from 'react';
import { Dimensions, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { IconLoading } from '../marketplace/filters/icons';

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
      <IconLoading name="loading" size={24} />
    </View>
  );
}

export default Loading;
