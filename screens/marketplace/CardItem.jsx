import { useNavigation } from '@react-navigation/native';
import { Skeleton, Text, useTheme } from '@rneui/themed';
import { Icon } from 'iconsax-react-native';
import React, { useContext } from 'react';
import { Dimensions, Pressable, TouchableOpacity, View } from 'react-native';
import { Card, Chip, Divider, List } from 'react-native-paper';
import { Svg, Path } from 'react-native-svg';
import LanguageContext from '../../api/langcontext';
import i18nt from '../../locales';
import { I18n } from 'i18n-js';
import { Iconstar } from './filters/icons';
import { LinearGradient } from 'expo-linear-gradient';

const SingleItem = ({ title, sub, level, location, mainTitle }) => {
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
      {title && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            // alignItems: 'center',
          }}>
          <Text
            style={{
              color: mainTitle ? theme.colors.secondary : theme.colors.grey,
              fontSize: mainTitle ? 16 : 12,
              fontWeight: '500',
              fontFamily: 'Vazirmatn',
              //marginHorizontal: 10,
            }}>
            {title}
          </Text>

          <Text
            style={{
              color: theme.colors.text,
              fontSize: 14,
              fontWeight: '500',
              fontFamily: 'Vazirmatn',
              //marginHorizontal: 10,
            }}>
            {sub}
          </Text>
        </View>
      )}
      {level && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            // alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',

              // alignItems: 'center',
              //marginLeft: 10,
            }}>
            {/* <Iconstar size={32} color={theme.colors.gold} /> */}
            <Text
              style={{
                color: theme.colors.text,
                fontSize: 12,
                fontWeight: '500',
                marginHorizontal: 5,
                fontFamily: 'Vazirmatn',
              }}>
              {location}
            </Text>
          </View>
          <Chip
            style={{
              borderWidth: 1,
              borderColor:
                level === 'Beginner'
                  ? theme.colors.beginnerText
                  : level === 'Intermediate'
                  ? theme.colors.intermediateText
                  : theme.colors.advancedText,
              backgroundColor:
                level === 'Beginner'
                  ? theme.colors.beginnerbg
                  : level === 'Intermediate'
                  ? theme.colors.intermediatebg
                  : theme.colors.border,
            }}>
            {level}
          </Chip>
        </View>
      )}
    </View>
  );
};

function CardItem({ item, showSkeleton }) {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { userLanguage } = useContext(LanguageContext);
  const RTL = userLanguage === 'fa' ? true : false;
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  return (
    <TouchableOpacity
      //onPress={() => navigation.navigate('PlanItem', { item: item })}
      onPress={() => navigation.navigate('PlanItem', { item: item })}
      style={{
        borderRadius: 16,
        marginHorizontal: 20,
        marginBottom: 20,
        marginTop: 0,
        backgroundColor: theme.colors.background,
        shadowOpacity: 0,
        borderWidth: 0.5,
        borderColor: theme.colors.border,
        //height: Dimensions.get('window').height / 2,
      }}>
      <View
        style={{
          flexDirection: 'column',
        }}>
        <Card.Cover
          style={{
            width: Dimensions.get('window').width / 2,
            height: Dimensions.get('window').height / 6,
            resizeMode: 'cover',
            marginHorizontal: 10,
            marginVertical: 10,
          }}
          source={{ uri: item.image }}
        />

        <View
          style={{
            direction: RTL ? 'rtl' : 'ltr',
            //marginHorizontal: 10,
          }}>
          <SingleItem title={item.name} mainTitle={true} />
          <SingleItem title={i18n.t('trainer')} sub={item.creator} />
          <SingleItem
            title={i18n.t('duration')}
            sub={`${item.duration} ${i18n.t('week')}`}
          />
          <SingleItem title={i18n.t('target')} sub={item.target} />

          <SingleItem
            title={i18n.t('daysperweek')}
            sub={`${item.DaysPerWeek} ${i18n.t('daysinweek')}`}
          />
          <SingleItem
            level={item.level}
            // star={item.star}
            location={item.locarion}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default CardItem;

// import { useNavigation } from '@react-navigation/native';
// import { Text, useTheme } from '@rneui/themed';
// import { Icon } from 'iconsax-react-native';
// import React, { useContext } from 'react';
// import { Dimensions, Pressable, View } from 'react-native';
// import { Card, Chip, Divider, List } from 'react-native-paper';
// import { Svg, Path } from 'react-native-svg';
// import LanguageContext from '../../api/langcontext';
// import i18nt from '../../locales';
// import { I18n } from 'i18n-js';

// function CardItem({ item }) {
//   const { theme } = useTheme();
//   const navigator = useNavigation();
//   const { userLanguage } = useContext(LanguageContext);
//   const i18n = new I18n(i18nt);
//   i18n.locale = userLanguage;
//   return (
//     <Card
//       onPress={() => navigator.navigate('PlanItem', { item: item })}
//       style={{
//         direction: userLanguage === 'fa' ? 'rtl' : 'ltr',
//         height: Dimensions.get('window').height / 2,
//         //overflow: 'hidden',
//         // justifyContent: 'center',
//         // alignSelf: 'center',
//         borderRadius: 10,
//         marginHorizontal: 16, // Add some margin to the right of each item
//         marginTop: 0,
//         marginRight: 40,
//         backgroundColor: theme.colors.background,
//         shadowColor: theme.colors.background,
//         shadowOpacity: 0.2,
//         borderWidth: 1,
//         borderColor: theme.colors.border,
//         // alignItems: 'center',
//       }}>
//       <Card.Cover
//         style={{
//           width: Dimensions.get('window').width / 2,
//           borderRadius: 10,
//           height: Dimensions.get('window').height / 6,
//           resizeMode: 'fit',
//           marginHorizontal: 16, // Add some margin to the right of each item
//           marginTop: 20,
//         }}
//         source={{ uri: item.image }}
//       />
//       <Text
//         style={{
//           fontSize: 16,
//           marginLeft: 0,
//           // marginTop: 30,
//           marginVertical: 20,

//           alignSelf: 'center',
//           //fontFamily: 'Roboto',
//           //fontWeight: 'bold',
//           color: theme.colors.secondary,
//         }}>
//         {item.name}
//       </Text>
//       <Divider
//         width={Dimensions.get('window').width / 2}
//         style={{
//           marginHorizontal: 16, // Add some margin to the right of each item
//           //marginTop: 30,
//           //marginRight: 40,
//         }}
//       />
//       <View
//         style={{
//           //marginHorizontal: 10, // Add some margin to the right of each item
//           justifyContent: 'space-between',
//           marginLeft: 20, // Add some margin to the right of each item
//           marginRight: 10, // Add some margin to the right of each item
//           //marginTop: 30,
//           //marginRight: 40,
//         }}>
//         <List.Item
//           titleStyle={{
//             justifyContent: 'flex-end',
//           }}
//           right={(props) => <Text>{item.creator}</Text>}
//           left={(props) => <Text>{`${i18n.t('trainer')}:`}</Text>}
//         />
//         <List.Item
//           right={(props) => <Text>{`${item.duration} ${i18n.t('week')}`}</Text>}
//           left={(props) => <Text>{`${i18n.t('duration')}:`}</Text>}
//         />
//         <List.Item
//           right={(props) => <Text>{item.target}</Text>}
//           left={(props) => <Text>{`${i18n.t('target')}:`}</Text>}
//         />
//         <List.Item
//           right={(props) => (
//             <Text>{`${item.DaysPerWeek} ${i18n.t('days')}`}</Text>
//           )}
//           left={(props) => <Text>{`${i18n.t('daysperweek')}:`}</Text>}
//         />
//       </View>
//       <View
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           marginHorizontal: 16,
//         }}>
//         <Chip onPress={() => console.log('Pressed')}>{item.level}</Chip>
//         <View
//           style={{
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//           }}>
//           {item?.star && (
//             <View
//               style={{
//                 flexDirection: 'row',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//                 //marginHorizontal: 16,
//               }}>
//               <Text>{item.star}</Text>
//               <Svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="32"
//                 height="32"
//                 viewBox="0 0 32 32"
//                 fill="none">
//                 <Path
//                   d="M15.9978 23.36L21.5312 26.7067C22.5445 27.32 23.7845 26.4133 23.5178 25.2667L22.0512 18.9733L26.9445 14.7333C27.8378 13.96 27.3578 12.4933 26.1845 12.4L19.7445 11.8533L17.2245 5.90668C16.7712 4.82668 15.2245 4.82668 14.7712 5.90668L12.2512 11.84L5.81117 12.3867C4.63784 12.48 4.15784 13.9467 5.05117 14.72L9.94451 18.96L8.47784 25.2533C8.21117 26.4 9.45117 27.3067 10.4645 26.6933L15.9978 23.36Z"
//                   fill="#FABB05"
//                 />
//               </Svg>
//             </View>
//           )}
//         </View>
//       </View>
//     </Card>
//   );
// }

// export default CardItem;
