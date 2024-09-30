import { Text, useTheme } from '@rneui/themed';
import React, { useContext, useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import DropdownCountries from '../../components/dropDown/countries';
import AuthContext from '../../api/context';
import { useNavigation } from '@react-navigation/native';
import api from '../../api/api';
import LanguageContext from '../../api/langcontext';
import i18nt from '../../locales';
import { I18n } from 'i18n-js';
import FitlinezLoading from '../../components/FitlinezLoading';

function PlanSelection({ handleSubmit }) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [selectedIds, setSelectedIds] = useState([]);
  const [location, setLocation] = useState('');
  const { userAuth } = useContext(AuthContext);
  const navigation = useNavigation();
  const [priceList, setPriceList] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [price, setPrice] = useState(null);
  const [finalList, setFinalList] = useState([]);
  const { userLanguage } = useContext(LanguageContext);
  const [status, setStatus] = useState('loading');
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const RTL = userLanguage === 'fa';
  const handleSelect = (value) => {
    // Handle the selection logic, update the state, or perform any necessary actions
    setSelectedValue(value);
    //find price based on value
    const item = priceList.find((item) => item._id === value);
    setPrice(item.price);
    setTitle(item.description);
  };
  //   useEffect(() => {
  //     trackUserData(userAuth, 'Upgrade page loaded');
  //   }, [userAuth]);

  const getPriceList = async () => {
    try {
      const response = await api.get('/price');
      //  setStatus('success');
      setPriceList(response.data);
    } catch (error) {
      setStatus('error');
    }
  };

  useEffect(() => {
    if (userAuth.level === 4) {
      navigation.navigate('WorkoutListIndex');
    }
  }, []);

  useEffect(() => {
    getPriceList();
  }, []);

  useEffect(() => {
    if (location !== '') setStatus('success');
  }, [location]);

  const [email, setEmail] = useState(null);
  useEffect(() => {
    //setLocation(userAuth.location);
    setEmail(userAuth.email);
  }, [location]);

  const handleUpgrade = async (email, location, price, title) => {
    try {
      await handleSubmit();
      // Open the URL
      await Linking.openURL(
        `http://fitlinez.com/payfromapp/?email=${email}&location=${location}&amount=${price}&amountRial=${price}&product=${title}`
      );

      // Log out the user
      // console.log('userAuth', userAuth);
      // setUserAuth(null);
      //AuthStorage.removeToken();
      navigation.navigate('ConfirmPayment');

      // If _handlePressButtonAsync is another function you want to call, you can call it here
      //   _handlePressButtonAsync();
    } catch (error) {
      console.error('Error opening URL or logging out:', error);
    }
  };

  const filteredListFa = priceList
    ? priceList.filter((item) => item.sign === 'Iran').slice(0, 4)
    : [];
  const filteredList = priceList
    ? priceList.filter((item) => item.sign !== 'Iran').slice(0, 4)
    : [];

  const onSelect = ({ id, title }) => {
    setSelectedIds([id]);

    // onGenderSelect({
    //   gender: title,
    //   id: id,
    // });
  };
  const isSelected = (id) => selectedIds.includes(id);

  useEffect(() => {
    if (location === 'Iran') {
      setFinalList(
        priceList
          ? priceList.filter((item) => item.sign === 'Iran').slice(0, 4)
          : []
      );
    } else {
      setFinalList(
        priceList
          ? priceList.filter((item) => item.sign !== 'Iran').slice(0, 4)
          : []
      );
    }
  }, [location]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        direction: RTL ? 'rtl' : 'ltr',
        //paddingTop: Dimensions.get('window').height / 15,
      }}>
      <Text
        style={{
          fontFamily: 'Vazirmatn',
          textAlign: 'center',
          color: theme.colors.secondary,
          fontSize: 12,
        }}>
        {i18n.t('upgradeLocationText')}
      </Text>

      <DropdownCountries setLocation={setLocation} />
      {status === 'loading' && <FitlinezLoading />}
      {status === 'success' && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: Dimensions.get('window').width / 1.1,
            flexWrap: 'wrap',
          }}>
          <FlatList
            data={finalList ? finalList : []}
            numColumns={2} // Specify the number of columns
            renderItem={({ item }) => (
              <TouchableOpacity
                key={item._id}
                onPress={() =>
                  handleUpgrade(email, location, item.price, item.title)
                }
                style={[
                  styles.halfBox,
                  isSelected(item._id) && styles.selectedItem,
                  item.status === 'featured' && styles.featuredItem,
                  item.status === 'comming soon' && styles.disableItem,
                ]}>
                <View
                  style={{
                    position: 'absolute',
                    bottom: 5,
                    right: 15,
                  }}>
                  <Text style={styles.price}>{item?.badge}</Text>
                </View>
                {item?.status === 'comming soon' && (
                  <View
                    style={{
                      position: 'absolute',
                      bottom: '50%',
                      opacity: 0.7,
                      //   justifyContent: 'center',
                      //right: 0,
                      left: '2%',
                      backgroundColor: theme.colors.primary,
                      width: '100%',
                      height: 35,
                      borderRadius: 8,
                      zIndex: 100,
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Vazirmatn',
                        fontSize: 20,
                        textAlign: 'center',
                      }}>
                      بزودی
                    </Text>
                  </View>
                )}
                <View
                  style={{
                    // width: Dimensions.get('window').width,
                    flexDirection: 'column',
                    // justifyContent: 'space-between',
                  }}>
                  <Text
                    style={[
                      styles.title,
                      item.status === 'featured' && {
                        color: theme.colors.primary,
                        fontSize: 16,
                        textAlign: 'center',
                      },
                    ]}>
                    {item.title}
                  </Text>
                  <View
                    style={{
                      borderBottomColor: theme.colors.border,
                      ///borderBottomWidth: 1,
                      width: '10%',
                    }}
                  />
                  <Text
                    style={[
                      styles.price,
                      item.status === 'featured' && {
                        color: theme.colors.primary,
                        fontSize: 16,
                        textAlign: 'center',
                      },
                    ]}>
                    {item.priceDisplay}
                  </Text>
                </View>

                <View
                  style={{
                    borderBottomColor: theme.colors.border,
                    borderBottomWidth: 1,
                    width: '90%',
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    marginVertical: 5,
                  }}>
                  <Text style={styles.desc}>{item.description}</Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    top: 10,
                  }}>
                  <FlatList
                    data={item.features}
                    // numColumns={1} // Specify the number of columns
                    renderItem={({ item }) => (
                      <Text style={styles.desc}>{item}</Text>
                    )}
                  />
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item._id}
          />
        </View>
      )}
      <TouchableOpacity
        onPress={async () => {
          try {
            await handleSubmit();
            navigation.navigate('WorkoutListIndex');
            console.log('free plan');
          } catch {
            console.log('error ');
          }
        }}
        //   key={item._id}
        // onPress={() =>
        //   item.status === ' comming soon'
        //     ? console.log('comming soom')
        //     : onSelect({
        //         id: item._id,
        //         title: item.title,
        //       })
        // }
        style={[
          styles.fullBoxFree,
          isSelected({ id: 0 }) && styles.selectedItem,
        ]}>
        {status === 'success' && (
          <View
            style={{
              // width: Dimensions.get('window').width,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={styles.title}>نسخه پایه</Text>
            <View
              style={{
                borderBottomColor: theme.colors.border,
                ///borderBottomWidth: 1,
                width: '10%',
              }}
            />
            <Text style={styles.price}>رایگان</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (theme, RTL) =>
  StyleSheet.create({
    icon: {},
    text: {
      color: theme.colors.secondary,
      fontSize: 18,
      fontWeight: 'bold',
      justifyContent: 'flex-start',
      fontFamily: 'Vazirmatn',
    },

    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    desc: {
      fontSize: 10,
      fontWeight: '400',
      marginTop: 0,
      color: theme.colors.grey0,
      fontFamily: 'Vazirmatn',
      textAlign: RTL ? 'right' : 'left',
    },
    price: {
      fontSize: 12,
      fontWeight: '500',
      marginTop: 0,
      textAlign: 'center',
      color: theme.colors.secondary,
      fontFamily: 'Vazirmatn',
    },
    title: {
      fontSize: 14,
      fontWeight: '400',
      color: theme.colors.grey0,
      fontFamily: 'Vazirmatn',
    },
    value: {
      fontSize: 14,
      fontWeight: '500',
      marginTop: 10,
      color: theme.colors.secondary,
      fontFamily: 'Vazirmatn',
    },
    selectedCalories: {
      backgroundColor: theme.colors.background,
      //alignItems: 'center',
      marginHorizontal: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 16,
      padding: 20,
      //    paddingTop: 5,
      marginBottom: 20,
      flexDirection: 'row',
      height: Dimensions.get('window').height / 12,
      // alignContent: 'center',
      // justifyContent: 'center',
    },
    fullBox: {
      backgroundColor: theme.colors.background,
      //  alignItems: 'center',
      marginHorizontal: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 16,
      padding: 20,
      paddingTop: 5,
      marginBottom: 20,
      width: Dimensions.get('window').width / 1.2,
      height: Dimensions.get('window').height / 6,
      alignContent: 'center',
      justifyContent: 'center',
    },
    fullBoxFree: {
      position: 'absolute',
      backgroundColor: theme.colors.background,
      //  alignItems: 'center',
      marginHorizontal: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 16,
      paddingHorizontal: 20,
      paddingTop: 5,
      bottom: 0,
      width: Dimensions.get('window').width / 1.2,
      height: Dimensions.get('window').height / 15,
      alignContent: 'center',
      justifyContent: 'center',
    },
    halfBox: {
      backgroundColor: theme.colors.background,
      alignItems: 'center',
      marginHorizontal: 15,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 16,
      padding: 5,
      height: Dimensions.get('window').height / 3,
      width: Dimensions.get('window').width / 2 - 50,
      alignContent: 'center',
      justifyContent: 'center',
    },
    unit: {
      color: theme.colors.grey0,
      fontSize: 12,
      fontWeight: '400',
      paddingLeft: 15,
      fontFamily: 'Vazirmatn',
    },
    selectedItem: {
      borderColor: theme.colors.secondary,
      backgroundColor: theme.colors.selected,
      borderWidth: 2,
    },
    featuredItem: {
      borderColor: theme.colors.gold,
      backgroundColor: theme.colors.gold,
      borderWidth: 2,
    },
    disableItem: {
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.border,
      borderWidth: 2,
    },
  });

export default PlanSelection;
