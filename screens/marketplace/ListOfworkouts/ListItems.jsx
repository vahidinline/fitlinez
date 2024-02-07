import React from 'react';
import { Text, useTheme } from '@rneui/themed';
import { Icon } from 'iconsax-react-native';
import { Dimensions, Pressable, View } from 'react-native';
import { Card, Chip, Divider, List } from 'react-native-paper';
function WorkoutListItems() {
  const { theme } = useTheme();
  return (
    <Card
      style={{
        height: Dimensions.get('window').height / 1.9,
        //overflow: 'hidden',
        // justifyContent: 'center',
        // alignSelf: 'center',
        borderRadius: 20,
        marginHorizontal: 16, // Add some margin to the right of each item
        marginTop: 30,
        marginRight: 40,
        // alignItems: 'center',
      }}>
      <Card.Cover
        style={{
          width: Dimensions.get('window').width / 2,

          height: Dimensions.get('window').height / 6,
          resizeMode: 'fit',
          marginHorizontal: 16, // Add some margin to the right of each item
          marginTop: 30,
        }}
        source={{ uri: item.image }}
      />
      <Text
        style={{
          fontSize: 25,
          marginLeft: 0,
          // marginTop: 30,
          marginVertical: 20,

          alignSelf: 'center',

          fontWeight: 'bold',
          color: theme.colors.secondary,
        }}>
        {item.name}
      </Text>
      <Divider
        width={Dimensions.get('window').width / 2}
        style={{
          marginHorizontal: 16, // Add some margin to the right of each item
          //marginTop: 30,
          //marginRight: 40,
        }}
      />
      <View
        style={{
          marginHorizontal: 16, // Add some margin to the right of each item
          //marginTop: 30,
          //marginRight: 40,
        }}>
        <List.Item
          title={item.creator}
          left={(props) => <Text>Trainer:</Text>}
        />
        <List.Item
          title={item.duration}
          left={(props) => <Text>Duration:</Text>}
        />
        <List.Item title={item.target} left={(props) => <Text>Target:</Text>} />
        <List.Item
          title={item.DaysPerWeek}
          left={(props) => <Text>Days per week:</Text>}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginHorizontal: 16,
        }}>
        <Chip onPress={() => console.log('Pressed')}>Example Chip</Chip>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text>5.0</Text>
          <Icon name="star" size={24} color="black" />
        </View>
      </View>
    </Card>
  );
}

export default WorkoutListItems;
