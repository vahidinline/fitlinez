import { useTheme } from '@rneui/themed';
import React, { useState } from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  Text,
  Image,
} from 'react-native';
import { IconTick } from '../../../screens/marketplace/filters/icons';

const screenWidth = Dimensions.get('window').width;

function DrawerList({
  handleDrawer,
  showDrawer,
  sortedData,
  index: exerciseId,
  sessionData,
  goToIndex,
}) {
  //console.log('  sortedData', sortedData);

  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [status, setStatus] = useState('idle');

  const handlePress = (index) => {
    console.log('index', index);

    try {
      goToIndex(index);

      setStatus('modal');

      // handleDrawer();
    } catch (error) {
      console.error('Error handling press:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* <TouchableWithoutFeedback onPress={handleDrawer}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback> */}
      <View style={styles.drawerStyle}>
        <View>
          <FlatList
            scrollEnabled={true}
            style={{ marginTop: 10 }}
            data={sortedData}
            keyExtractor={(item) => item.exerciseId.toString()}
            renderItem={({ item, index }) => {
              const isInSession = sessionData.some(
                (sessionItem) => sessionItem.exerciseId === item.exerciseId
              );

              return (
                <TouchableOpacity onPress={() => handlePress(index)}>
                  <View style={styles.listItem}>
                    <View style={styles.iconContainer}>
                      <View style={styles.iconWrapper}>
                        {isInSession && (
                          <IconTick size={32} color={theme.colors.green} />
                        )}
                      </View>
                    </View>
                    <View style={styles.textContainer}>
                      <Text
                        multiline
                        ellipsizeMode="tail"
                        style={styles.exerciseText}>
                        {item.exerciseName}
                      </Text>
                      <Image
                        source={{ uri: item.gifUrl }}
                        style={styles.exerciseImage}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      position: 'absolute',
      width: '100%',
      height: Dimensions.get('window').height,
      zIndex: 1000,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    drawerStyle: {
      width: screenWidth / 1.4,
      position: 'absolute',
      left: 0,
      top: 10,
      height: '100%',
      zIndex: 1000,
      backgroundColor: theme.colors.background,
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20,
    },
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    listItem: {
      flexDirection: 'row',
      backgroundColor: theme.colors.white,
      marginBottom: 10,
      marginHorizontal: 10,
      height: 45,
      borderRadius: 16,
      borderColor: theme.colors.border,
      borderWidth: 1,
    },
    iconContainer: {
      width: 30,
      height: 30,
      backgroundColor: theme.colors.white,
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
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 5,
      width: screenWidth / 1.4 - 100,
      marginLeft: 5,
      backgroundColor: theme.colors.white,
    },
    exerciseText: {
      paddingVertical: 2,
      fontSize: 12,
      fontFamily: 'Vazirmatn',
      alignSelf: 'center',
      color: theme.colors.secondary,
      flexWrap: 'wrap',
      width: Dimensions.get('window').width / 2.3,
    },
    exerciseImage: {
      width: 30,
      height: 30,
    },
  });

export default DrawerList;
