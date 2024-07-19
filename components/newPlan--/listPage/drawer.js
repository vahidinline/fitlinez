import { useTheme } from '@rneui/themed';
import React from 'react';
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
import {
  IconArrowLeft,
  IconArrowRight,
} from '../../../screens/marketplace/filters/icons';

const screenWidth = Dimensions.get('window').width;

function DrawerList({
  setShowDrawer,
  title,
  showDrawer,
  sortedData,
  userLanguages,
  goToIndex,
  index: ecerciseId,
  img,
}) {
  //console.log('in drawer', goToIndex);
  const { theme } = useTheme();
  const styles = getStyles(theme); // Call the function inside the component
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPress={() => {
          setShowDrawer(!showDrawer);
        }}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>
      <View style={styles.drawerStyle}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            zIndex: 1000,
          }}
          onPress={() => {
            setShowDrawer(!showDrawer);
          }}>
          {userLanguages === 'fa' ? <IconArrowLeft /> : <IconArrowRight />}
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <FlatList
            style={{
              marginTop: 50,
            }}
            data={sortedData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => {
                  goToIndex(index);
                  //setShowDrawer(!showDrawer);
                }}>
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    backgroundColor:
                      ecerciseId === index
                        ? theme.colors.lightPrimary
                        : theme.colors.background,
                    //borderRadius: 20,
                    marginBottom: 10,
                    //width: Dimensions.get('window').width - 20,
                    marginHorizontal: 10,
                    height: 60,
                    borderRadius: 16,
                    borderColor: theme.colors.grey,
                    borderWidth: 1,
                  }}>
                  <View
                    style={{
                      width: 35,
                      height: 35,
                      backgroundColor:
                        ecerciseId !== index
                          ? theme.colors.lightPrimary
                          : theme.colors.background,
                      borderRadius: 4,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginVertical: 10,
                      marginLeft: 10,
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '500',
                        color: theme.colors.secondary,
                        //padding: 10,
                      }}>
                      {index + 1}
                    </Text>
                  </View>
                  <View
                    style={{
                      borderRadius: 4,
                      // justifyContent: 'center',
                      //alignItems: 'center',
                      marginVertical: 10,
                      width: screenWidth / 1.4 - 100,
                      marginLeft: 10,
                    }}>
                    <Text
                      multiline // Add this
                      ellipsizeMode="tail" // And this
                      style={{
                        flexShrink: 1,
                        flexWrap: 'wrap',
                        paddingVertical: 10,
                        //alignItems: 'center',
                        justifyContent: 'flex-start',

                        fontSize: 14,
                        fontWeight: '500',
                        color: theme.colors.secondary,
                      }}>
                      {item.name}
                    </Text>
                  </View>
                  {/* {ecerciseId !== index && (
                    <Image
                      source={{ uri: img }}
                      style={{ width: 50, height: 50 }}
                    />
                  )} */}
                </View>
              </TouchableOpacity>
            )}
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
    },
    drawerStyle: {
      width: screenWidth / 1.4, // half of the screen width
      position: 'absolute', // position the drawer above other components
      left: 0, // position the drawer on the right side of the screen
      top: 10, // position the drawer at the top of the screen
      height: '100%', // make the drawer cover the full height of the screen
      zIndex: 1000, // ensure the drawer is above other components
      backgroundColor: theme.colors.background,
    },
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
    },
  });

export default DrawerList;
