import React from 'react';
import { Dimensions, FlatList, SafeAreaView, View } from 'react-native';
import { useState } from 'react';
import { Text, ThemeContext, useTheme } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import LanguageContext from '../../api/langcontext';
import { useContext } from 'react';
import { I18n } from 'i18n-js';
import AuthContext from '../../api/context';
import i18nt from '../../locales';
import Header from '../../components/header';
import RadioButtonfitlinez from '../../components/RadioButtonFitlinez';
import api from '../../api/api';
import { useEffect } from 'react';
import { updateWorkoutPlan } from '../../api/GetData';

function CustomPlan() {
  const key = 'fitlinez-session';
  const [isFocus, setIsFocus] = useState(false);
  const [value, setValue] = useState(null);
  const [customPlan, setCustomPlan] = useState([]);
  console.log('customPlan', customPlan.length);
  const navigation = useNavigation();
  const { userLanguage, setUserLanguage } = useContext(LanguageContext);
  const { userAuth, setUserAuth } = useContext(AuthContext);
  const userId = userAuth.id;
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const { toggleTheme } = useContext(ThemeContext);
  const [avatar, setAvatar] = useState(null);
  const { theme } = useTheme();
  const addedDateTime = new Date().toISOString();
  const getCustomPlan = async () => {
    const res = await api.get(`/newplan/customPrebuild/${userAuth.id}`);
    if (res) {
      setCustomPlan(res.data);
    }
  };

  useEffect(() => {
    getCustomPlan();
  }, []);

  const savePackages = (item, addedDateTime, userId) => {
    try {
      const jsonString = JSON.stringify({ item, addedDateTime });
      updateWorkoutPlan(item, addedDateTime, userId);

      console.log('new package saved');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header title="Select Custom Plan" />

      <View
        style={{
          flexDirection: 'column',
          marginTop: 50,
          marginBottom: 0,
          borderRadius: 24,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: Dimensions.get('window').width,
            marginBottom: 0,
            borderRadius: 10,
          }}>
          <FlatList
            ListEmptyComponent={
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 50,
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: theme.colors.secondary,
                  }}>
                  No Custom Plan Available
                </Text>
              </View>
            }
            data={customPlan}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View
                style={{
                  marginHorizontal: 10,
                }}>
                <RadioButtonfitlinez
                  label={item.name}
                  onSelect={() => savePackages(item, addedDateTime, userId)}
                />
              </View>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

export default CustomPlan;
