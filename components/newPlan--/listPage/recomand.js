import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Chip, Icon, Text, useTheme } from '@rneui/themed';
import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, View, StyleSheet } from 'react-native';
import { Tooltip } from '@rneui/themed';
import { Overlay } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { I18n } from 'i18n-js';
import i18nt from '../../../locales';
import LanguageContext from '../../../api/langcontext';
function Recommend() {
  const [oneRm, setOneRm] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const { theme } = useTheme();
  const [open, setOpen] = React.useState(false);
  const [visible, setVisible] = useState(false);
  const navigator = useNavigation();
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;

  const getOneRm = async () => {
    const oneRM = await AsyncStorage.getItem('oneRM');
    if (oneRM) {
      const numericalPart = oneRM.match(/\d+(\.\d+)?/)[0]; // Extract the numerical part using regex
      setOneRm(parseFloat(numericalPart)); // Convert to float for calculations
    }
  };

  const generateSuggestions = (oneRm) => {
    const percentages = [95, 90, 85, 80, 75, 70, 65, 60, 55, 50];
    const reps = [2, 4, 6, 8, 10, 12, 16, 20, 24, 30];
    return percentages
      .map((percentage, index) => {
        let weight = (oneRm * percentage) / 100;
        weight = Math.round(weight / 2.5) * 2.5; // Round to the nearest multiple of 2.5
        return { weight, reps: reps[index] };
      })
      .filter((suggestion) => suggestion.reps <= 15); // Filter out suggestions with more than 15 reps
  };

  useEffect(() => {
    getOneRm();
  }, []);

  useEffect(() => {
    if (oneRm) {
      const newSuggestions = generateSuggestions(oneRm);
      setSuggestions(newSuggestions);
    }
  }, [oneRm]);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  return (
    <View
      style={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: suggestions && suggestions.length > 0 ? 50 : 0,
        width: Dimensions.get('window').width,
        backgroundColor: theme.colors.grey3,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          height: 50,
          width: Dimensions.get('window').width,
        }}>
        <View>
          <Tooltip
            containerStyle={{
              width: Dimensions.get('window').width / 1.5,
              height: 60,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: theme.colors.secondary,
            }}
            visible={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            popover={
              <Text
                style={{
                  color: theme.colors.primary,
                  fontSize: 12,
                  textAlign: 'center',
                }}>
                {i18n.t('recommandtoolTip')}
              </Text>
            }></Tooltip>
          {suggestions && suggestions.length > 0 ? (
            <Text
              style={{
                color: theme.colors.secondary,
                fontSize: 12,
                textAlign: 'center',
              }}>
              {i18n.t('weightSuggestion')}
            </Text>
          ) : null}
        </View>

        {suggestions.map((suggestion, index) => {
          if (suggestion.reps === 8) {
            return (
              <Chip
                onPress={toggleOverlay}
                title={` ${suggestion.weight} kg x ${suggestion.reps}`}
                titleStyle={{ color: theme.colors.secondary }}
                key={index}
                containerStyle={{ margin: 5 }}
              />
            );
          }
          return null; // Return null for other cases
        })}

        {/* <Button
          title="more..."
          buttonStyle={{
            backgroundColor: theme.colors.orange,
            borderRadius: 10,
          }}
          titleStyle={{ color: theme.colors.secondary, fontSize: 12 }}
          type="solid"
          icon={{
            name: 'arrow-down',
            type: 'font-awesome',
            size: 15,
            color: theme.colors.secondary,
          }}
          onPress={toggleOverlay}
        /> */}
      </View>
      <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
        <Text
          style={{
            color: theme.colors.secondary,
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
          {i18n.t('suggestionOverlayTitle')}
        </Text>
        {suggestions.map((suggestion, index) => {
          return (
            <Chip
              color={theme.colors.primary}
              title={`${suggestion.weight} kg x ${suggestion.reps}`}
              titleStyle={{ color: theme.colors.secondary }}
              key={index}
              containerStyle={{
                margin: 5,
                borderBottomColor: 'black',
                borderBottomWidth: 1,
              }}
            />
          );
        })}
        <Text>{i18n.t('recommandtoolTip')}</Text>
      </Overlay>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    margin: 10,
  },
  textPrimary: {
    marginVertical: 20,
    textAlign: 'center',
    fontSize: 20,
  },
  textSecondary: {
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 17,
  },
});

export default Recommend;
