import { Text, useTheme } from '@rneui/themed';
import React from 'react';
import { Dimensions, View, PixelRatio } from 'react-native';
import { Card } from 'react-native-paper';
import StartSessionIndexHome from '../../Sessions/StartSessionIndexHome';

function CurrentCard({
  title,
  subtitle,
  component,
  icon,
  value,
  index,
  width,
}) {
  const limit = 15;
  //count the number of characters in the title
  const titleLength = title && typeof title === 'string' && title.length;

  const { theme } = useTheme();
  return (
    <View
      style={{
        width: Dimensions.get('window').width / 1.2,
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginTop: 20,
        marginHorizontal: 10,
        // backgroundColor: theme.colors.background,
      }}>
      <View
        style={{
          // position: 'absolute',
          //top: PixelRatio.get() < 3 ? 0 : 10,
          //right: index === 1 ? 0 : Dimensions.get('window').width / 20,
          width: Dimensions.get('window').width / 1.1,
          flexDirection: 'column',
          justifyContent: 'space-between',
          // alignItems: 'center',
          marginTop: 20,
          marginHorizontal: 0,
          height: Dimensions.get('window').height,
        }}>
        <Card
          style={{
            //backgroundColor: theme.colors.background,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: theme.colors.border,
            marginTop: 0,
            // height: Dimensions.get('window').height / 7,
            width: Dimensions.get('window').width / 1.2,
            // width: '100%',
            marginHorizontal: 0,
            bottom: 5,
          }}>
          <Card.Content>
            <Text
              style={{
                fontSize: PixelRatio.get() < 3 ? 10 : 14,
                //fontWeight: 'bold',
                fontFamily: 'Vazirmatn',
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
                fontFamily: 'Vazirmatn',
              }}>
              {/* {value} */}
            </Text>
          </Card.Content>
        </Card>
      </View>
    </View>
  );
}

export default CurrentCard;
