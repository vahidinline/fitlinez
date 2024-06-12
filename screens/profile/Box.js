import * as React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions, PixelRatio, StyleSheet } from 'react-native';
import { View } from 'react-native';
import { Path, Svg } from 'react-native-svg';
import { Text } from '@rneui/themed';
import LanguageContext from '../../api/langcontext';
import { IconPremium } from '../marketplace/filters/icons-';

function Box({ title, subTitle, dayLeft, type }) {
  const { userLanguage } = React.useContext(LanguageContext);
  const RTL = userLanguage == 'fa' ? true : false;
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={
          type === 'premium' ? ['#FFA07A', '#FF6347'] : ['#5B31FF', '#7462BB']
        }
        style={styles.background}
      />
      <View
        style={{
          direction: RTL ? 'rtl' : 'ltr',
          flexDirection: 'row',
          //marginLeft: 10,
          width: Dimensions.get('window').width / 1.1,
          height: Dimensions.get('window').height / 14,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 10,
          }}>
          <IconPremium size={24} color="white" />
        </View>
        <View
          style={{
            flexDirection: 'column',
            // direction: RTL ? 'rtl' : 'ltr',
            // justifyContent: 'center',

            marginHorizontal: 0,
            // marginTop: 15,
            alignSelf: 'center',
            //alignContent: 'center',
          }}>
          <Text
            style={{
              fontSize: PixelRatio.get() > 2 ? 15 : 18,
              fontWeight: '400',
              color: 'white',
              marginLeft: 0,
              fontFamily: 'Vazirmatn',
              // position: 'absolute',
              // right: Dimensions.get('window').width,
              bottom: 0,
            }}>
            {title}
          </Text>
        </View>
        <Text
          style={{
            position: 'absolute',
            left: 0,
            top: 50,
            fontSize: PixelRatio.get() > 2 ? 10 : 16,
            fontWeight: '500',
            color: 'white',
            marginLeft: 10,
            marginTop: 5,
            fontFamily: 'Vazirmatn',
          }}>
          {subTitle}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    //alignItems: 'center',
    // justifyContent: 'center',
    width: Dimensions.get('window').width / 1.1,
    height: Dimensions.get('window').height / 10,
    //marginHorizontal: 20,
    marginLeft: 10,
    // backgroundColor: 'orange',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: Dimensions.get('window').height / 10,
    borderRadius: 24,
  },
  button: {
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 20,
  },
});

export default Box;
