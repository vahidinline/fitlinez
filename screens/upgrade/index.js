import { Button, Text } from '@rneui/themed';
import React, { useContext, useEffect } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, View } from 'react-native';
import { useTheme } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { Linking } from 'react-native';
import AuthContext from '../../api/context';
import DropdownCountries from '../../components/dropDown/countries';
import api from '../../api/api';
import AnimatedLottieView from 'lottie-react-native';
import { I18n } from 'i18n-js';
import i18nt from '../../locales';
import LanguageContext from '../../api/langcontext';
import Header from '../../components/header';
const { width, height } = Dimensions.get('window');
import { LinearGradient } from 'expo-linear-gradient';
import { BackgroundImage } from '@rneui/base';
import PriceRadionButton from '../profile/PriceRadioButton';
import { useState } from 'react';
import checkFreeTrial from '../../api/checkFreeTrial';
import { IconWarning } from '../marketplace/filters/icons';
import UserPrivilegeContext from '../../api/userPrivilegeContext';

function Upgrade() {
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const { theme } = useTheme();
  const navigator = useNavigation();
  const { userAuth, setUserAuth } = useContext(AuthContext);
  const [location, setLocation] = useState('');
  const [priceList, setPriceList] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [price, setPrice] = useState(null);
  const { userPrivilege } = useContext(UserPrivilegeContext);

  const [title, setTitle] = useState(null);

  const RTL = userLanguage === 'fa' ? true : false;
  const handleSelect = (value) => {
    // Handle the selection logic, update the state, or perform any necessary actions
    setSelectedValue(value);
    //find price based on value
    const item = priceList.find((item) => item._id === value);
    setPrice(item.price);
    setTitle(item.description);
  };

  const getPriceList = async () => {
    const response = await api.get('/price');
    setPriceList(response.data);
  };

  const [email, setEmail] = React.useState(null);
  useEffect(() => {
    //setLocation(userAuth.location);
    setEmail(userAuth.email);
  }, [userAuth.location]);

  useEffect(() => {
    getPriceList();
  }, []);

  const handleUpgrade = async (email, location, price) => {
    try {
      // Open the URL
      await Linking.openURL(
        `http://fitlinez.com/payfromapp/?email=${email}&location=${location}&amount=${price}&amountRial=${price}&product=${title}`
      );

      // Log out the user
      // console.log('userAuth', userAuth);
      // setUserAuth(null);
      //AuthStorage.removeToken();
      navigator.navigate('ConfirmPayment');

      // If _handlePressButtonAsync is another function you want to call, you can call it here
      //   _handlePressButtonAsync();
    } catch (error) {
      console.error('Error opening URL or logging out:', error);
    }
  };

  const filteredList = priceList
    ? priceList
        .filter((item) => item.sign === location || item.sign === '€')
        .slice(0, 3)
    : [];

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        height: height,
        paddingTop: 50,
        direction: userLanguage === 'fa' ? 'rtl' : 'ltr',
      }}>
      <Header title={i18n.t('upgrade')} />

      <View
        style={{
          height: height,
        }}>
        <BackgroundImage
          source={require('../../assets/trainers.jpeg')}
          style={styles.background}>
          <Text style={styles.textHeader}>{i18n.t('upgradeHeaderText')}</Text>
          <Text style={styles.textSubHeader}>
            {i18n.t('upgradeSubHeaderText')}
          </Text>
          <Text style={styles.textSmallHeader}>
            {i18n.t('upgradeSmallText')}
          </Text>
          {!userPrivilege && (
            <View style={styles.textWarning}>
              <IconWarning color={theme.colors.red} size={36} />
              <Text
                style={{
                  color: theme.colors.info,
                  fontSize: 16,
                  fontWeight: '700',
                  marginVertical: 10,
                  marginHorizontal: 10,
                  justifyContent: 'center',
                  bottom: 10,
                  flexWrap: 'wrap',
                }}>
                {i18n.t('trialExpired')}
              </Text>
            </View>
          )}
          <LinearGradient
            // Background Linear Gradient
            colors={['#5B5891D1', '#FCF8FF']}
            style={styles.background}
          />
        </BackgroundImage>
        <View>
          {!location ? (
            <View
              style={{
                // alignItems: 'center',
                justifyContent: RTL ? 'right' : 'left',
                marginVertical: 20,
              }}>
              <Text
                style={{
                  color: theme.colors.secondary,
                  fontSize: 14,
                  fontWeight: '500',
                  marginVertical: 10,
                  marginHorizontal: 20,
                  textAlign: RTL ? 'left' : 'right',
                }}>
                {i18n.t('upgradeLocationText')}
              </Text>
              <DropdownCountries setLocation={setLocation} />
            </View>
          ) : (
            <View>
              {filteredList
                ? filteredList.map((item, index) => {
                    return (
                      <View>
                        <PriceRadionButton
                          itemId={item._id}
                          label={item.title}
                          value={item._id}
                          description={item.description}
                          selected={selectedValue === item._id}
                          price={
                            item.discount ? item.discount : item.priceDisplay
                          }
                          priceDisplay={item.priceDisplay}
                          sign={item.sign}
                          setSelectedValue={setSelectedValue}
                          onSelect={(value) => handleSelect(value)}
                          userLanguage={userLanguage}
                        />
                      </View>
                    );
                  })
                : null}
            </View>
          )}
        </View>
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          width: Dimensions.get('window').width,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 100,
        }}>
        <Button
          disabled={price === null ? true : false}
          buttonStyle={{
            backgroundColor: theme.colors.button,
            borderColor: theme.colors.secondary,
            borderWidth: 1,
            borderRadius: 16,
            width: Dimensions.get('window').width / 1.1,
            height: Dimensions.get('window').height / 20,
            marginVertical: 10,
            marginHorizontal: 10,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            direction: userLanguage === 'fa' ? 'rtl' : 'ltr',
          }}
          onPress={() => handleUpgrade(email, location, price)}>
          {i18n.t('upgrade')}
        </Button>
        {userPrivilege && (
          <Text
            onPress={() => {
              navigator.navigate('Home');
            }}
            style={{
              color: theme.colors.secondary,
              fontSize: 14,
              fontWeight: '400',
              marginVertical: 10,
            }}>
            {i18n.t('trialText')}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //alignItems: 'center',
    // justifyContent: 'center',
    width: Dimensions.get('window').width / 1.1,
    //height: Dimensions.get('window').height / 3,
    marginHorizontal: 20,
    // backgroundColor: 'orange',
  },
  background: {
    //position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: Dimensions.get('window').height / 3,
    // borderRadius: 16,
  },
  textHeader: {
    position: 'absolute',
    fontSize: 32,
    top: Dimensions.get('window').height / 5 - 100,
    fontWeight: '700',
    color: '#17124A',
    textAlign: 'center',
    margin: 10,
    zIndex: 10,
  },
  textSubHeader: {
    position: 'absolute',
    fontSize: 24,
    top: Dimensions.get('window').height / 5 - 30,
    fontWeight: '500',
    color: '#17124A',
    textAlign: 'center',
    margin: 10,
    zIndex: 10,
  },
  textSmallHeader: {
    position: 'absolute',
    fontSize: 14,
    top: Dimensions.get('window').height / 5 - 0,
    fontWeight: '500',
    color: '#17124A',
    textAlign: 'center',
    margin: 10,
    zIndex: 10,
  },
  textWarning: {
    flexDirection: 'row',
    position: 'absolute',
    fontSize: 14,
    top: Dimensions.get('window').height / 4 - 0,
    fontWeight: '500',
    color: '#17124A',
    textAlign: 'center',
    margin: 10,
    zIndex: 10,
    width: Dimensions.get('window').width / 1.1,
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
  },
});
export default Upgrade;
