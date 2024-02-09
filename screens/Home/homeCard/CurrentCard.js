import { LinearProgress, Text, useTheme } from '@rneui/themed';
import React from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { Dimensions, View, Animated } from 'react-native';
import { Card } from 'react-native-paper';
import { Path, Svg } from 'react-native-svg';

function CurrentCard({ title, subtitle, component, icon, value, index }) {
  const limit = 15;
  //count the number of characters in the title
  const titleLength = title && typeof title === 'string' && title.length;

  const { theme } = useTheme();
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        right: index === 1 ? 0 : Dimensions.get('window').width / 2.6,
        width: Dimensions.get('window').width / 2.5,
        flexDirection: 'column',
        justifyContent: 'space-between',
        // alignItems: 'center',
        marginTop: 20,
        marginHorizontal: 10,
        height: Dimensions.get('window').height,
      }}>
      <View
        style={{
          //position: 'absolute',
          top: 0,
          right: index === 1 ? 0 : Dimensions.get('window').width / 22,
          flexDirection: 'row',
          //justifyContent: 'flex-start',
          justifyContent: 'flex-start',
          alignItems: 'center',
          marginRight: 0,
          //bottom: 0,
        }}>
        {icon}
        <Text
          style={{
            fontSize: titleLength > limit ? 12 : 16,
            fontWeight: 'bold',
            color: theme.colors.white,
            marginLeft: 10,
          }}>
          {title}
        </Text>
      </View>
      <View
        style={{
          position: 'absolute',
          top: 0,
          right: index === 1 ? 0 : Dimensions.get('window').width / 20,
          width: Dimensions.get('window').width / 2.5,
          flexDirection: 'column',
          justifyContent: 'space-between',
          // alignItems: 'center',
          marginTop: 20,
          marginHorizontal: 0,
          height: Dimensions.get('window').height,
        }}>
        <Card
          style={{
            backgroundColor: theme.colors.background,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: theme.colors.border,
            marginTop: 10,
            height: Dimensions.get('window').height / 9,
            width: Dimensions.get('window').width / 2.5,
            // width: '100%',
          }}>
          <Card.Content>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',

                alignSelf: 'center',
                color: theme.colors.secondary,
              }}>
              {subtitle}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                alignSelf: 'center',
                color: theme.colors.secondary,
              }}>
              {value}
            </Text>
            {component}
          </Card.Content>
        </Card>
      </View>
    </View>
  );
}

export default CurrentCard;
