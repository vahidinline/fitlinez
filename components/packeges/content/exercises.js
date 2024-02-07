import React, { useContext } from 'react';
import { Dimensions, ScrollView, View } from 'react-native';
import { Avatar, List, ListItem, Text } from '@rneui/themed';
import { I18n } from 'i18n-js';
import LanguageContext from '../../../api/langcontext';
import i18nt from '../../../locales';
import { Icon, useTheme } from '@rneui/themed';

function Exercises({ data }) {
  const { theme } = useTheme();
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;

  const categorizedData = (Array.isArray(data) ? data : []).reduce(
    (acc, item) => {
      if (item && item.day && Array.isArray(item.data)) {
        if (!acc[item.day]) {
          acc[item.day] = [];
        }
        acc[item.day].push(...item.data);
      }
      return acc;
    },
    {}
  );

  return (
    <View
      style={{
        marginBottom: Dimensions.get('window').height / 1.5,
      }}>
      {Object.keys(categorizedData).map((day) => (
        <View key={day}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 20,
              textAlign: 'center',
              marginVertical: 10,
            }}>
            {day}
          </Text>

          {categorizedData[day].map((exercise, i) => (
            <View key={i}>
              {categorizedData[day].length > 1 && (
                <ListItem bottomDivider>
                  {/* <Avatar source={{ uri: exercise.gifUrl }} /> */}
                  {/* <Image 
                    uri={exercise.gifUrl}
                    style={{ width: 50, height: 50 }}
                  /> */}
                  <ListItem.Content>
                    <ListItem.Title>{exercise.name}</ListItem.Title>
                    <ListItem.Subtitle>{exercise.bodyPart}</ListItem.Subtitle>
                  </ListItem.Content>
                  <Icon
                    name={
                      exercise.loc === 'Both'
                        ? 'home'
                        : exercise.loc === 'Home'
                        ? 'home'
                        : 'dumbbell'
                    }
                    type="font-awesome-5"
                    size={30}
                    color={theme.colors.secondary}
                  />
                </ListItem>
              )}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

export default Exercises;
