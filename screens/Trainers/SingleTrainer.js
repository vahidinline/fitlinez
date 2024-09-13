import React, { useContext } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Header from '../../components/header';
import { useTheme } from '@rneui/themed';
import { Button, Card, Image } from '@rneui/base';
import { useNavigation } from '@react-navigation/native';
import i18nt from '../../locales';
import LanguageContext from '../../api/langcontext';
import AuthContext from '../../api/context';
import { I18n } from 'i18n-js';
import { IconInstagram, IconStarted } from '../marketplace/filters/icons';
import TrainerPlan from './TrainerPlan';

const SingleItem = ({ title, sub, icon }) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  return (
    <View
      style={{
        //flexDirection: 'row',

        marginVertical: 10,
        marginHorizontal: 10,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          // alignItems: 'center',
          width: Dimensions.get('window').width / 2.3,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {icon}
          <Text
            style={{
              color: theme.colors.grey,
              fontSize: 16,
              fontWeight: '500',
              marginHorizontal: 10,
              fontFamily: 'Vazirmatn',
            }}>
            {title}
          </Text>
        </View>
      </View>

      <Text
        style={{
          color: theme.colors.secondary,
          fontSize: 18,
          fontFamily: 'Vazirmatn',
          fontWeight: '500',
          //marginHorizontal: 10,
        }}>
        {sub}
      </Text>
    </View>
  );
};

function SingleTrainer({ route }) {
  const { theme } = useTheme();
  const { item } = route.params;
  console.log('item', item);
  const navigation = useNavigation();
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  const { userAuth, setUserAuth } = useContext(AuthContext);
  i18n.locale = userLanguage;
  const premium = item?.premium;
  const { data } = route.params.item;
  const userDateRegister = userAuth.date;
  const userLevel = userAuth.level;
  const userId = userAuth.id;
  const date = item.date;
  const RTL = userLanguage === 'fa' ? true : false;
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        //
      }}>
      <Header title={i18n.t('trainerslist')} />
      <ScrollView style={{ flex: 1 }}>
        <View
          style={{
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: 16,
            marginTop: 10,
            marginHorizontal: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
              borderBottomColor: theme.colors.secondary,
              borderBottomWidth: 0.3,
              marginHorizontal: 10,
              marginVertical: 10,

              //backgroundColor: theme.colors.background,
            }}>
            <View
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                zIndex: 1,
              }}>
              <IconStarted size={32} color={theme.colors.gold} />
            </View>

            <View
              style={{
                flexDirection: 'row',
                borderRadius: 10,
                //borderWidth: 0.5,
                borderColor: theme.colors.border,
                marginBottom: 10,
                padding: 5,
              }}>
              <View>
                <Image
                  source={{ uri: item.photo }}
                  style={{
                    width: Dimensions.get('window').width / 4,
                    height: Dimensions.get('window').width / 2.5,

                    borderRadius: 15,
                  }}
                />
                <Text
                  style={{
                    position: 'absolute',
                    bottom: 10,
                    fontSize: 16,
                    color: theme.colors.white,
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignItems: 'center',
                    fontFamily: 'Vazirmatn',
                    marginHorizontal: 10,
                  }}>
                  {item.trainerType}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignContent: 'center',
                  alignItems: 'center',
                  marginHorizontal: 10,
                  //marginVertical: 10,
                  width: Dimensions.get('window').width / 1.5,
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    //fontWeight: 'bold',
                    color: theme.colors.secondary,
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignItems: 'center',
                    fontFamily: 'Vazirmatn',
                    //left: Dimensions.get('window').width / 3,
                    marginHorizontal: 10,
                    // marginVertical: 10,
                    top: 10,
                  }}>
                  {item.name}
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    //fontWeight: 'bold',
                    color: theme.colors.secondary,
                    justifyContent: 'center',
                    // alignContent: 'center',
                    //alignItems: 'center',
                    fontFamily: 'Vazirmatn',
                    //left: Dimensions.get('window').width / 3,
                    //marginHorizontal: 10,
                    marginBottom: 30,
                    top: 10,
                  }}>
                  {item.nickName}
                </Text>

                <Text
                  style={{
                    fontSize: 16,
                    color: theme.colors.grey,
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignItems: 'center',
                    fontFamily: 'Vazirmatn',
                    marginHorizontal: 10,
                  }}>
                  {item?.certificates &&
                    item?.certificates.map((item, index) => {
                      return (
                        <View
                          key={index}
                          style={{
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              fontSize: 14,
                              justifyContent: 'center',
                              alignContent: 'center',
                              alignItems: 'center',
                              textAlign: 'center',
                              color: theme.colors.secondary,
                              fontFamily: 'Vazirmatn',
                            }}>
                            {item.institution}
                          </Text>
                          <Text
                            style={{
                              fontSize: 14,
                              justifyContent: 'center',
                              alignContent: 'center',
                              alignItems: 'center',
                              textAlign: 'center',
                              color: theme.colors.secondary,
                              fontWeight: 'bold',
                              //fontFamily: 'Vazirmatn',
                            }}>
                            {item.name}
                          </Text>
                        </View>
                      );
                    })}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginHorizontal: 10,
              marginBottom: 10,
            }}>
            {item.socialMedia &&
              item.socialMedia.length > 0 &&
              item.socialMedia.map((item, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginHorizontal: 10,
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        Linking.openURL(`${item.link}`);
                      }}>
                      <IconInstagram size={32} color={theme.colors.secondary} />
                    </TouchableOpacity>
                  </View>
                );
              })}
          </View>
          <View
            style={{
              flexDirection: 'column',

              borderColor: theme.colors.border,
              marginBottom: 0,
              padding: 15,
              borderBottomColor: theme.colors.secondary,
              borderBottomWidth: 0.3,
              marginHorizontal: 10,
            }}>
            <Text
              style={{
                fontSize: 20,
                //   fontWeight: 'bold',
                textAlign: 'center',
                color: theme.colors.secondary,
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
                fontFamily: 'Vazirmatn',
              }}>
              {i18n.t('trainerBio')}
            </Text>
            <Text
              style={{
                color: theme.colors.secondary,
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
                fontFamily: 'Vazirmatn',
                textAlign: 'center',
              }}>
              {item.bio}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              // marginTop: 20,
              marginBottom: 0,
              marginHorizontal: 10,
            }}>
            {/* <SingleItem
              title={i18n.t('trainerLocation')}
              sub={item.location}
              // icon={<I />}
            />
            <SingleItem
              title={i18n.t('trainerAvailability')}
              sub={item.availability}
              // icon={<IconWeight />}
            /> */}
          </View>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'space-between',
              //width: Dimensions.get('window').width - 20,
              marginTop: 20,
              marginBottom: 0,
              marginHorizontal: 10,
              borderBottomColor: theme.colors.secondary,
              borderBottomWidth: 0.3,
              // marginHorizontal: 10,
            }}>
            <Text
              style={{
                fontSize: 20,
                //fontWeight: 'bold',
                color: theme.colors.secondary,
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
                fontFamily: 'Vazirmatn',
                textAlign: 'center',
              }}>
              {i18n.t('trainerExpertise')}
            </Text>
            {item.expertise &&
              item.expertise.length > 0 &&
              item.expertise.map((item, index) => {
                return (
                  <SingleItem
                    key={index}
                    // title={i18n.t('trainerExpertise')}
                    sub={item.area}
                    // icon={<IconTimer />}
                  />
                );
              })}
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: Dimensions.get('window').width - 20,
              //  marginTop: 20,
              marginBottom: 0,
              marginHorizontal: 10,
            }}>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'space-between',
                width: Dimensions.get('window').width - 20,
                marginTop: 20,
                marginBottom: 0,
                marginHorizontal: 10,
              }}>
              <Text
                style={{
                  fontSize: 20,
                  //   fontWeight: 'bold',
                  color: theme.colors.secondary,
                  justifyContent: 'center',
                  alignContent: 'center',
                  alignItems: 'center',
                  fontFamily: 'Vazirmatn',
                  textAlign: 'center',
                }}>
                {i18n.t('trainerPlan')}
              </Text>
              <TrainerPlan trainerId={item._id} />
            </View>
          </View>
        </View>
      </ScrollView>
      <View>
        <Button
          disabled
          buttonStyle={{
            backgroundColor: theme.colors.secondary,
            marginHorizontal: 20,
            borderRadius: 12,
            marginVertical: 10,
            width: Dimensions.get('window').width / 1.1,
          }}
          title={i18n.t('bookSession')}
          titleStyle={{
            color: theme.colors.background,
            fontSize: 16,
            fontFamily: 'Vazirmatn',
          }}
        />
      </View>
    </SafeAreaView>
  );
}

export default SingleTrainer;
