import { LinearProgress, Text } from '@rneui/themed';
import React from 'react';
import { View } from 'react-native';

function Usage({ usage, usagePercentage, userLimitExceeded }) {
  console.log(userLimitExceeded);
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        height: 200,
      }}>
      <Text
        style={{
          fontSize: 16,
          fontWeight: '500',
        }}>
        {!userLimitExceeded
          ? `You have used ${usage} of your credits.`
          : 'You have exceeded your daily limit.'}
      </Text>
      {usage !== null && (
        <LinearProgress
          value={usagePercentage > 100 ? 100 : usagePercentage}
          style={{
            marginTop: 10,
            height: 10,
            borderRadius: 8,
            width: 200,
          }}
        />
      )}
    </View>
  );
}

export default Usage;
