import { Button, Icon, Text } from '@rneui/themed';
import React from 'react';
import { Pressable, View } from 'react-native';

function Sidebar({
  progress,
  dataLength,
  undoneItem,
  doneItem,
  index,
  setVisible,
  subtitle,
  nextExercise,
  previousExercise,
  theme,
  visible,
  instructionTitle,
  instructor,
  setShowInstruction,
  faInstructor,
  userLanguage,
}) {
  return (
    <View
      style={{
        position: 'absolute',
        top: 40,
        right: 10,
        width: 50,
      }}>
      <View
        style={{
          flexDirection: 'column',
          textAlign: 'auto',
          alignItems: 'center',
          padding: 10,
        }}>
        {userLanguage === 'en' && (
          <Button
            titleStyle={{
              fontSize: 8,
              color: theme.colors.primary,
            }}
            buttonStyle={{
              borderRadius: 5,
              width: 60,
              backgroundColor: theme.colors.secondary,

              marginTop: 2,
            }}
            onPress={() => setShowInstruction(true)}>
            {instructionTitle}
            <Icon
              name="info-circle"
              type="font-awesome-5"
              size={10}
              color={theme.colors.primary}
            />
          </Button>
        )}
        <Button
          icon={{
            name: 'list',
            type: 'font-awesome-5',
            size: 15,
            color: 'white',
          }}
          iconRight
          title={subtitle}
          titleStyle={{
            fontSize: 8,
            color: theme.colors.primary,
          }}
          buttonStyle={{
            width: 60,
            backgroundColor: theme.colors.secondary,
            backgroundColor: theme.colors.secondary,
            borderRadius: 5,
            width: 60,
            marginTop: 2,
          }}
          onPress={() => setVisible(true)}
        />
        {/* ) : null} */}
        <Button
          icon={{
            name: 'chevron-right',
            type: 'font-awesome-5',
            size: 15,
            color: 'white',
          }}
          iconRight
          title={previousExercise}
          titleStyle={{
            fontSize: 8,
            color: theme.colors.primary,
          }}
          buttonStyle={{
            borderRadius: 5,
            width: 60,
            backgroundColor: theme.colors.secondary,
            backgroundColor: theme.colors.secondary,

            marginTop: 2,
          }}
          onPress={() => undoneItem(index)}
        />

        <Button
          icon={{
            name: 'chevron-left',
            type: 'font-awesome-5',
            size: 15,
            color: 'white',
          }}
          iconRight
          titleStyle={{
            fontSize: 8,
            color: theme.colors.primary,
          }}
          buttonStyle={{
            borderRadius: 5,
            width: 60,
            backgroundColor: theme.colors.secondary,

            marginTop: 2,
          }}
          onPress={() => doneItem(index)}>
          {nextExercise}
        </Button>
      </View>
    </View>
  );
}

export default Sidebar;
