import { LinearProgress, Text, useTheme } from '@rneui/themed';
import React from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { Dimensions, View, Animated, PixelRatio } from 'react-native';
import { Card } from 'react-native-paper';
import { Path, Svg } from 'react-native-svg';

function CurrentCard({ title, subtitle, component, icon, value, index }) {
  const limit = 15;
  console.log('PixelRatio', PixelRatio.get());
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
            fontSize: PixelRatio.get() < 3 ? 11 : 12,
            fontWeight: '500',
            color: theme.colors.white,
            marginLeft: 10,
          }}>
          {title}
        </Text>
      </View>
      <View
        style={{
          position: 'absolute',
          top: PixelRatio.get() < 3 ? 0 : 10,
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
            height:
              PixelRatio.get() < 3
                ? Dimensions.get('window').height / 7.5
                : Dimensions.get('window').height / 9,
            width: Dimensions.get('window').width / 2.5,
            // width: '100%',
          }}>
          <Card.Content>
            <Text
              style={{
                fontSize: PixelRatio.get() < 3 ? 10 : 16,
                fontWeight: 'bold',

                alignSelf: 'center',
                color: theme.colors.secondary,
              }}>
              {subtitle}
            </Text>
            <Text
              style={{
                fontSize: PixelRatio.get() < 3 ? 10 : 16,
                fontWeight: '500',
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
