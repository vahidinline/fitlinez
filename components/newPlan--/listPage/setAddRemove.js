import { Button, Text } from '@rneui/themed';
import React from 'react';
import { Dimensions, View } from 'react-native';

function SetAddRemove({ inputType, type, title, theme, addSet, removeSet }) {
  return (
    <>
      {inputType !== 'timer' && type !== 'warmup' && type !== 'cooldown' && (
        <View
          style={{
            flexDirection: 'column',
            width: Dimensions.get('window').width,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            {/* {subsitute.length !== 0 ? ( */}

            <Button
              title="+"
              titleStyle={{
                color: theme.colors.primary,
              }}
              buttonStyle={{
                backgroundColor: theme.colors.secondary,
                width: Dimensions.get('window').width / 6 - 10,
              }}
              onPress={() => addSet()}
            />

            <View>
              <Text
                style={{
                  fontSize: 20,
                  color: theme.colors.secondary,
                  textAlign: 'center',
                  marginTop: 10,
                  fontWeight: 'bold',
                }}>
                {title}
              </Text>
            </View>

            <Button
              title="-"
              titleStyle={{
                color: theme.colors.primary,
              }}
              buttonStyle={{
                backgroundColor: theme.colors.secondary,
                width: Dimensions.get('window').width / 6 - 10,
              }}
              onPress={() => removeSet()}
            />
          </View>
        </View>
      )}
    </>
  );
}

export default SetAddRemove;
