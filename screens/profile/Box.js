import * as React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions, PixelRatio, StyleSheet } from 'react-native';
import { View } from 'react-native';
import { Path, Svg } from 'react-native-svg';
import { Text } from '@rneui/themed';
import LanguageContext from '../../api/langcontext';
import { IconPremium } from '../marketplace/filters/icons';

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
          flexDirection: 'column',
          //marginLeft: 10,
          width: Dimensions.get('window').width / 1.1,
          height: 100,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 10,
            marginTop: 20,
          }}>
          <IconPremium size={24} color="white" />

          <Text
            style={{
              fontSize: PixelRatio.get() > 2 ? 15 : 18,

              color: 'white',
              marginHorizontal: 10,
              fontFamily: 'Vazirmatn',
              // position: 'absolute',
              // right: Dimensions.get('window').width,
              bottom: 0,
            }}>
            {title}
          </Text>
        </View>
        <View>
          <Text
            style={{
              position: 'absolute',
              left: 0,
              top: 10,
              fontSize: PixelRatio.get() > 2 ? 16 : 18,
              justifyContent: 'center',
              textAlign: 'center',

              color: 'white',
              marginHorizontal: 20,
              marginTop: 5,
              fontFamily: 'Vazirmatn',
            }}>
            {subTitle}
          </Text>
        </View>
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
    marginBottom: 30,
    // backgroundColor: 'orange',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: Dimensions.get('window').height / 8,
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
