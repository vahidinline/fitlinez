import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext, useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Card, Icon, Image, Text } from '@rneui/themed';
import AuthContext from '../../api/context';
import InitialForm from './InitialForm';
import console from '../../api/console';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Default from '../../assets/defaultAvatar.png';
import woman from '../../assets/woman.jpg';
import man from '../../assets/man.jpeg';
import LottieView from 'lottie-react-native';
import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';
import i18nt from '../../locales';
import LanguageContext from '../../api/langcontext';
import Header from '../header';

const Profile = (props) => {
  const { userAuth } = useContext(AuthContext);
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const [bmi, setBmi] = useState();
  const [data, setData] = useState([]);
  useEffect(() => {
    AsyncStorage.getItem('BMI').then((res) => {
      setBmi(JSON.parse(res));
    });
  }, []);

  const getUserData = async () => {
    const userData = await AsyncStorage.getItem('userData');
    if (!userData) {
      return;
    }
    setData(JSON.parse(userData));
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <SafeAreaView>
      <ScrollView>
        <Header title={i18n.t('profilePageTitle')} rightIcon={true} />
        <View
          style={{
            flex: 1,
            backgroundColor: '#fff',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20,
            }}>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('Update')}>
              <Image
                source={
                  data?.gender === 'female'
                    ? woman
                    : data?.gender === 'male'
                    ? man
                    : Default
                }
                style={{
                  width: 200,
                  height: 200,
                  resizeMode: 'cover',
                  borderRadius: 100,
                }}
              />
              {data?.image ? (
                <Icon
                  name="edit"
                  type="font-awesome"
                  color="#fff"
                  size={20}
                  containerStyle={{
                    bottom: 0,
                    right: 0,
                  }}
                />
              ) : null}
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: 'column',
              marginLeft: 0,
              marginTop: 10,
            }}>
            <Card>
              <Card.Title>{i18n.t('profilePageTitle')}</Card.Title>
              <Card.Divider />

              <Text
                style={{
                  textAlign: 'center',
                }}>
                {userAuth?.email}
              </Text>
              {userAuth.level == 1 ? (
                <LottieView
                  source={require('../../assets/silver.json')}
                  autoPlay
                  loop
                  style={{
                    width: 50,
                    height: 50,
                    alignSelf: 'center',
                  }}></LottieView>
              ) : userAuth.level == 4 ? (
                <LottieView
                  source={require('../../assets/gold.json')}
                  autoPlay
                  loop
                  style={{
                    width: 50,
                    height: 50,
                    alignSelf: 'center',
                  }}></LottieView>
              ) : (
                <Text
                  style={{
                    textAlign: 'center',
                  }}>
                  {i18n.t('trial')}
                </Text>
              )}
              <Card.Divider />

              <Text
                style={{
                  textAlign: 'center',
                }}>
                BMI: {bmi ? bmi.data : 'Not Calculated'}
              </Text>
            </Card>
            {data?.weight || data?.height || data?.targetWeight ? (
              <Card>
                <Card.Title>Body Details</Card.Title>
                <Card.Divider />
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <View style={{ justifyContent: 'flex-start', width: '50%' }}>
                    <Text>Weight: </Text>
                  </View>
                  <View style={{ justifyContent: 'flex-end' }}>
                    <Text>{data?.weight}</Text>
                  </View>
                </View>

                <Card.Divider />
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <View style={{ justifyContent: 'flex-start', width: '50%' }}>
                    <Text>Height: </Text>
                  </View>
                  <View style={{ justifyContent: 'flex-end' }}>
                    <Text>{data?.height}</Text>
                  </View>
                </View>
                <Card.Divider />
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <View style={{ justifyContent: 'flex-start', width: '50%' }}>
                    <Text>Target Weight: </Text>
                  </View>
                  <View style={{ justifyContent: 'flex-end' }}>
                    <Text>{data?.targetWeight}</Text>
                  </View>
                </View>
              </Card>
            ) : null}
          </View>
        </View>
        <View>{!data ? <InitialForm /> : null}</View>
      </ScrollView>

      <View
        style={{
          flexDirection: 'row',
          position: 'absolute',
          topvahid: 0,
          right: 0,
        }}>
        <TouchableOpacity onPress={() => props.navigation.openDrawer()}>
          <Icon name="menu" type="material" color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  profileText: {
    color: '#000',
    fontSize: 20,
    flexWrap: 'wrap',
    fontWeight: 'bold',
  },
});

export default Profile;
