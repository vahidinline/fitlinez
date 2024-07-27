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

const screenWidth = Dimensions.get('window').width;

function DrawerList({ sortedData, index: exerciseId, sessionData, goToIndex }) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [status, setStatus] = useState('idle');

  const handlePress = (index) => {
    console.log('index', index);

    try {
      goToIndex(index);
      setStatus('modal');
    } catch (error) {
      console.error('Error handling press:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* <TouchableWithoutFeedback
        onPress={() => {
          console.log('Backdrop pressed');
          handleDrawer(!showDrawer);
        }}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback> */}

      <View>
        <FlatList
          horizontal={false}
          scrollEnabled={true}
          style={{ marginTop: 10 }}
          data={sortedData}
          keyExtractor={(item) => item.exerciseId.toString()}
          renderItem={({ item, index }) => {
            // const isInSession = sessionData.some(
            //   (sessionItem) => sessionItem.id === item.exerciseId
            // );

            return (
              <TouchableOpacity
                onLongPress={() => console.log(item.exerciseName)}
                onPress={() => handlePress(index)}>
                <View style={styles.listItem}>
                  <View style={styles.textContainer}>
                    <Text style={styles.index}>{index + 1}</Text>

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
      //  flex: 0.2,
      position: 'absolute',
      //borderTopEndRadius: 0,
      // borderTopStartRadius: 0,
      borderRadius: 12,
      top: 19,
      width: Dimensions.get('window').width / 8,
      height: Dimensions.get('window').height / 3,
      zIndex: 1000,
      // borderTopWidth: 0,
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
