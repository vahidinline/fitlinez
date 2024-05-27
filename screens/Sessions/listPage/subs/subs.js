import {
  BottomSheet,
  Button,
  Image,
  ListItem,
  Text,
  useTheme,
} from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, Pressable, View } from 'react-native';
import { Icon } from '@rneui/themed';
import { getSubWorkOutData } from '../../../api/GetData';
import { StyleSheet } from 'react-native';

function Subs({
  userId,
  exerciseId,
  bodyPart,
  loc,
  category,
  setVisible,
  visible,
  handleSubsitute,
  allExcerciesIds,
  type,
  title,
  mainTarget,
  otherTarget,
  target,
  userLocation,
}) {
  // console.log('type', type);
  const [subList, setSubList] = useState([]);
  // console.log('subList', subList.length);
  const { theme } = useTheme();
  const styles = getStyles(theme); // Call the function inside the component
  const subListGetter = async () => {
    const subList = await getSubWorkOutData(
      userId,
      exerciseId,
      bodyPart,
      loc,
      category,
      allExcerciesIds,
      type,
      title,
      mainTarget,
      otherTarget,
      target,
      userLocation
    )
      .then((res) => {
        if (res.length === 0) {
          Alert.alert('No Subsitute Found');
          setVisible(false);
        }
        setSubList(res);
      })
      .catch((err) => {
        console.log('err', err);
      });
  };

  useEffect(() => {
    subListGetter();
  }, []);

  return (
    <View>
      <BottomSheet modalProps={{}} isVisible={visible}>
        <ListItem.Content
          style={{
            //position: 'absolute',
            top: 0,
            right: 0,
            width: Dimensions.get('window').width / 7.5,
            backgroundColor: 'red',
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
            height: 50,
            width: 50,
          }}>
          <Button
            title="X"
            titleStyle={{
              color: theme.colors.primary,
              fontSize: 20,
              fontWeight: 'bold',
            }}
            color={theme.colors.primary}
            buttonStyle={{
              backgroundColor: 'transparent',
              borderRadius: 10,
            }}
            onPress={() => setVisible(false)}
          />
        </ListItem.Content>

        {/* {subList.map((l, i) => (
          <ListItem
            key={i}
            backdropStyle={styles.backdropStyle}
            containerStyle={styles.containerStyle}
            style={{
              backgroundColor: theme.colors.primary,
            }}
            //onPress={l.onPress}
          >
            <Pressable
              style={{
                width: '100%',
                height: Dimensions.get('window').height / 9,
                backgroundColor: theme.colors.primary,
                borderRadius: 20,
              }}
              onPress={() => handleSubsitute(exerciseId, l)}>
              <ListItem.Content
                style={{
                  backgroundColor: theme.colors.primary,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  //borderBottomColor: theme.colors.gray,
                  //borderBottomWidth: 1,
                }}>
                <View
                  style={{
                    flexDirection: 'column',
                    //textAlign: 'auto',
                    // alignItems: 'center',
                    // padding: 10,
                  }}>
                  <Text
                    numberOfLines={2}
                    flexShrink={1}
                    width={Dimensions.get('window').width / 1.5}
                    style={{
                      fontSize: 15,
                      fontWeight: 'bold',
                      color: theme.colors.secondary,
                      marginBottom: 20,
                      alignContent: 'center',
                      // textAlign: 'center',
                      borderLeftColor: theme.colors.grey0,
                      borderRightWidth: 1,
                    }}>
                    {l.name}
                  </Text>
                  <Text
                    //numberOfLines={2}
                    style={{
                      fontSize: 15,
                      // fontWeight: 'bold',
                      color: theme.colors.secondary,
                      //marginTop: 50,
                      //alignContent: 'center',
                      //textAlign: 'center',
                      borderLeftColor: theme.colors.grey0,
                      borderRightWidth: 1,
                    }}>
                    {l?.bodyPart}
                  </Text>
                  <Text
                    numberOfLines={2}
                    style={{
                      fontSize: 15,
                      // fontWeight: 'bold',
                      color: theme.colors.secondary,
                      //marginTop: 50,
                      //alignContent: 'center',
                      //textAlign: 'center',
                      borderLeftColor: theme.colors.grey0,
                      borderRightWidth: 1,
                    }}>
                    {l?.equipment}
                  </Text>
                  <Text
                    //numberOfLines={2}
                    style={{
                      fontSize: 15,
                      // fontWeight: 'bold',
                      color: theme.colors.secondary,
                      //marginTop: 50,
                      //alignContent: 'center',
                      //textAlign: 'center',
                      borderLeftColor: theme.colors.grey0,
                      borderRightWidth: 1,
                    }}>
                    {l.loc === 'Both' ? 'Home & Gym' : `${l.loc} edition`}
                  </Text>
                </View>
                <Image
                  source={{ uri: l.gifUrl }}
                  style={{
                    //justifyContent: 'flex-end',
                    width: 100,
                    height: 100,
                  }}
                />
              </ListItem.Content>
            </Pressable>
          </ListItem>
        ))} */}
      </BottomSheet>
    </View>
  );
}
const getStyles = (theme) =>
  StyleSheet.create({
    // backdropStyle: { backgroundColor: 'red' },
    //containerStyle: { backgroundColor: 'red' },
    titleStyle: {
      color: 'white',
      textAlign: 'center',
      alignItems: 'center',
      top: 10,
    },
  });

export default Subs;
