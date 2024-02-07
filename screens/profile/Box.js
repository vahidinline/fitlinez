import * as React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions, StyleSheet } from 'react-native';
import { View } from 'react-native';
import { Path, Svg } from 'react-native-svg';
import { Text } from '@rneui/themed';

function Box({ title, subTitle }) {
  return (
    <View style={styles.container}>
      <LinearGradient
        // Background Linear Gradient
        colors={['#5B31FF', '#7462BB']}
        style={styles.background}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          //marginTop: 20,
          marginLeft: 20,
          alignItems: 'center',
          width: Dimensions.get('window').width / 1.1,
          height: Dimensions.get('window').height / 14,
          // marginHorizontal: 20,
        }}>
        <View>
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none">
            <Path
              d="M17 22H7C6.59 22 6.25 21.66 6.25 21.25C6.25 20.84 6.59 20.5 7 20.5H17C17.41 20.5 17.75 20.84 17.75 21.25C17.75 21.66 17.41 22 17 22Z"
              fill="white"
            />
            <Path
              d="M20.35 5.51906L16.35 8.37906C15.82 8.75906 15.06 8.52906 14.83 7.91906L12.94 2.87906C12.62 2.00906 11.39 2.00906 11.07 2.87906L9.16998 7.90906C8.93998 8.52906 8.18997 8.75906 7.65998 8.36906L3.65998 5.50906C2.85998 4.94906 1.79998 5.73906 2.12998 6.66906L6.28998 18.3191C6.42998 18.7191 6.80998 18.9791 7.22998 18.9791H16.76C17.18 18.9791 17.56 18.7091 17.7 18.3191L21.86 6.66906C22.2 5.73906 21.14 4.94906 20.35 5.51906ZM14.5 14.7491H9.49998C9.08998 14.7491 8.74998 14.4091 8.74998 13.9991C8.74998 13.5891 9.08998 13.2491 9.49998 13.2491H14.5C14.91 13.2491 15.25 13.5891 15.25 13.9991C15.25 14.4091 14.91 14.7491 14.5 14.7491Z"
              fill="white"
            />
          </Svg>
        </View>
        <View
          style={{
            flexDirection: 'column',
            // justifyContent: 'center',
            alignItems: 'flex-start',
            marginLeft: 0,
            // marginTop: 15,
            alignSelf: 'center',
            alignContent: 'center',
          }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '400',
              color: 'white',
              marginLeft: 10,
              position: 'absolute',
              right: 180,
              top: -10,
            }}>
            {title}
          </Text>
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: -80,
              // flexDirection: 'row',
              //justifyContent: 'space-between',
              //alignItems: 'center',
              // marginHorizontal: 20,
            }}>
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="24"
              viewBox="0 0 24 24"
              fill="none">
              <Path
                d="M8.90997 19.9201L15.43 13.4001C16.2 12.6301 16.2 11.3701 15.43 10.6001L8.90997 4.08008"
                stroke="white"
                stroke-width="1.5"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </Svg>
          </View>
        </View>
        <Text
          style={{
            position: 'absolute',
            left: 0,
            top: 50,
            fontSize: 12,
            fontWeight: '400',
            color: 'white',
            marginLeft: 10,
            marginTop: 5,
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
