import { useTheme } from '@rneui/themed';
import React, { useState } from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Text,
  Image,
} from 'react-native';
import { Divider } from '@rneui/base';
import convertToPersianNumbers from '../../../api/PersianNumber';

const screenWidth = Dimensions.get('window').width;

function DrawerList({
  sortedData,
  index: exerciseId,

  goToIndex,
  RTL,
}) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [status, setStatus] = useState('idle');

  const handlePress = (index) => {
    try {
      goToIndex(index);
      setStatus('modal');
    } catch (error) {
      console.error('Error handling press:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <FlatList
          horizontal={false}
          scrollEnabled={true}
          style={{ marginTop: 10 }}
          data={sortedData}
          keyExtractor={(item) => {
            // Check if exerciseId is an object (e.g., ObjectId) and extract the ID if it is
            if (
              typeof item.exerciseId === 'object' &&
              item.exerciseId !== null
            ) {
              return item.exerciseId.toString();
            }

            // Otherwise, return exerciseId directly if it's a string
            return item.exerciseId;
          }}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                onLongPress={() => console.log(item.exerciseName)}
                onPress={() => handlePress(index)}>
                <View style={styles.listItem}>
                  <View style={styles.textContainer}>
                    <Text style={styles.index}>
                      {convertToPersianNumbers(index + 1, RTL)}
                    </Text>

                    <Image
                      source={{ uri: item.gifUrl }}
                      style={styles.exerciseImage}
                    />
                  </View>
                </View>
                <Divider />
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.white,
      position: 'absolute',
      borderRadius: 12,
      top: 19,
      width: Dimensions.get('window').width / 8,
      height: Dimensions.get('window').height / 3,
      zIndex: 1000,
      borderWidth: 1,

      borderColor: theme.colors.border,
      overflow: 'hidden',
    },
    index: {
      position: 'absolute',
      top: 0,
      right: 0,
      left: 35,
      opacity: 0.9,
      color: theme.colors.secondary,
      zIndex: 1000,
      fontSize: 14,
      fontFamily: 'Vazirmatn',
    },
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    listItem: {
      flexDirection: 'row',
      //backgroundColor: theme.colors.white,
      marginBottom: 10,
      //marginHorizontal: 10,
      height: 45,
      borderRadius: 16,
      borderColor: theme.colors.border,
      //borderWidth: 1,
      overflow: 'hidden',
    },
    iconContainer: {
      width: 30,
      height: 30,
      //backgroundColor: theme.colors.white,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 10,
      marginLeft: 10,
      borderColor: theme.colors.border,
    },
    iconWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    textContainer: {
      borderRadius: 4,
      width: '100%',
      // flexDirection: 'row',
      // justifyContent: 'space-between',
      // marginVertical: 5,
      // width: screenWidth / 1.4 - 100,
      //marginLeft: 5,
      // backgroundColor: theme.colors.white,
    },
    exerciseText: {
      paddingVertical: 2,
      fontSize: 12,
      fontFamily: 'Vazirmatn',
      alignSelf: 'center',
      color: theme.colors.secondary,
      flexWrap: 'wrap',
      //width: Dimensions.get('window').width / 2.3,
    },
    exerciseImage: {
      width: 45,
      height: 45,
      overflow: 'hidden',
    },
  });

export default DrawerList;
