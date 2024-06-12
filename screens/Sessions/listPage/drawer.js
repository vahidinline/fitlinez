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
  setShowDrawer,
  showDrawer,
  sortedData,
  index: ecerciseId,
  sessionData,
  goToIndex,
}) {
  const { theme } = useTheme();
  const styles = getStyles(theme); // Call the function inside the component
  const [status, setStatus] = useState('idle');
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPress={() => {
          setShowDrawer(!showDrawer);
        }}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>
      <View style={styles.drawerStyle}>
        <View>
          <FlatList
            scrollEnabled={true}
            style={{
              marginTop: 10,
            }}
            data={sortedData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              const isInSession = sessionData.some(
                (sessionItem) => sessionItem.exerciseId === item._id
              );

              return (
                <TouchableOpacity
                  onPress={() => {
                    goToIndex(index);
                    setStatus('modal');
                    setShowDrawer(!showDrawer);
                  }}>
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      backgroundColor: theme.colors.white,
                      marginBottom: 10,
                      marginHorizontal: 10,
                      height: 45,
                      borderRadius: 16,
                      borderColor: theme.colors.border,
                      borderWidth: 1,
                    }}>
                    <View
                      style={{
                        width: 30,
                        height: 30,
                        backgroundColor: theme.colors.white,
                        borderRadius: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginVertical: 10,
                        marginLeft: 10,
                        borderColor: theme.colors.border,
                      }}>
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        {isInSession && (
                          <IconTick size={32} color={theme.colors.green} />
                        )}
                      </View>
                    </View>
                    <View
                      style={{
                        borderRadius: 4,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        //alignItems: 'center',
                        marginVertical: 5,
                        width: screenWidth / 1.4 - 100,
                        marginLeft: 5,
                        backgroundColor: theme.colors.white,
                      }}>
                      <Text
                        multiline // Add this
                        ellipsizeMode="tail" // And this
                        style={{
                          paddingVertical: 2,
                          fontSize: 12,
                          fontFamily: 'Vazirmatn',
                          alignSelf: 'center',
                          // fontWeight: 'bold',
                          color: theme.colors.secondary,
                          flexWrap: 'wrap',
                          width: Dimensions.get('window').width / 2.3,
                        }}>
                        {item.name}
                      </Text>

                      <Image
                        source={{ uri: item.gifUrl }}
                        style={{ width: 30, height: 30 }}
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
      //  backgroundColor: theme.colors.white,
      borderColor: theme.colors.border,
    },
    drawerStyle: {
      width: screenWidth / 1.4, // half of the screen width
      position: 'absolute', // position the drawer above other components
      left: 0, // position the drawer on the right side of the screen
      top: 10, // position the drawer at the top of the screen
      height: '100%', // make the drawer cover the full height of the screen
      zIndex: 1000, // ensure the drawer is above other components
      backgroundColor: theme.colors.background,
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20,
    },
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
    },
  });

export default DrawerList;
