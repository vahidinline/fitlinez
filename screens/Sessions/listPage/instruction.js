import { Button, Overlay, Text, useTheme } from '@rneui/themed';
import React from 'react';
import { Dimensions, ScrollView, View } from 'react-native';
import { IconCloseCircle } from '../../../screens/marketplace/filters/icons';

function Instruction({
  title,
  openInstruction,
  setOpenInstruction,
  userLanguage,
  instructor,
  faInstructor,
}) {
  const { theme } = useTheme();
  return (
    <View
      style={{
        borderRadius: 16,
      }}>
      <Button
        titleStyle={{ color: theme.colors.secondary, fontWeight: 'bold' }}
        onPress={() => setOpenInstruction(true)}>
        {title}
      </Button>
      <Overlay
        visible={openInstruction}
        onBackdropPress={() => setOpenInstruction(false)}
        overlayStyle={{
          width: Dimensions.get('window').width / 1.2,
          height: Dimensions.get('window').height / 4,
          padding: 0,
          margin: 0,
          borderRadius: 16,
          backgroundColor: theme.colors.grey3,
          overflow: 'hidden',
        }}>
        <Button
          icon={<IconCloseCircle />}
          titleStyle={{
            color: theme.colors.red,
            fontSize: 20,
            fontWeight: 'bold',
          }}
          color={theme.colors.primary}
          buttonStyle={{
            backgroundColor: 'transparent',
            justifyContent: 'flex-end',
          }}
          onPress={() => setOpenInstruction(false)}
        />
        <View
          style={{
            width: Dimensions.get('window').width / 1.2,
            height: Dimensions.get('window').height / 1.5,
            padding: 0,
            margin: 0,
            // backgroundColor: theme.colors.grey3,
          }}>
          <ScrollView>
            <Text
              style={{
                color: '#000',
                // fontSize: 10,
                // fontWeight: 'bold',
                textAlign: `${userLanguage === 'fa' ? 'right' : 'left'}`,
                padding: 10,
              }}>
              {userLanguage === 'fa' ? faInstructor : instructor}
            </Text>
          </ScrollView>
        </View>
      </Overlay>
    </View>
  );
}

export default Instruction;
