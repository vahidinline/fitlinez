import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View,
  FlatList,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { I18n } from 'i18n-js';
import { BottomSheet, useTheme, Button, Text } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SessionContext } from '../../api/sessionContext';
import { TimeSpentContext } from '../../api/TimeSpentContext';
import i18nt from '../../locales';
import LanguageContext from '../../api/langcontext';
import AuthContext from '../../api/context';
import calculateTaskCompletionPercentage from '../../api/performanceCalc';
import Item from './listPage/item';
const { width, height } = Dimensions.get('window');

const SessionMainPage = (props) => {
  const [stoptimer, setStoptimer] = useState(false);
  const { userAuth } = useContext(AuthContext);
  const userId = userAuth.id;
  const userLevel = userAuth.level;
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [finish, setFinish] = useState(false);
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const { workouts, category, location, catTname } = props.route.params;
  const [data, setData] = useState(workouts);
  const flatListRef = useRef(null);
  const hideDialog = () => setVisible(false);
  const [progress, setProgress] = useState(1);
  const { sessionData } = useContext(SessionContext);
  const { timeSpent, setTimeSpent } = useContext(TimeSpentContext);
  const scrollEnabled = true;

  const completionPercentage = calculateTaskCompletionPercentage(
    sessionData,
    data.length
  );
  const style = {
    textAlign: 'center',
    alignItems: 'center',
    width: width,
    height: height,
    flex: 1,
    //borderWidth: 1,
    backgroundColor: theme.colors.background,
  };

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.setNativeProps({ scrollEnabled: false });
    } else {
      console.log('flatListRef.current is null');
    }
  }, [scrollEnabled]);

  const goToIndex = (index) => {
    if (index) {
      flatListRef.current.scrollToIndex({ index: index, animated: false });
    } else {
      flatListRef.current.scrollToIndex({ index: 0, animated: false });
    }
  };
  const doneItem = (index) => {
    try {
      const updatedData = data.map((item, i) => {
        if (i === index) {
          return { ...item, isDone: true };
        }
        return item;
      });
      setProgress(progress + 1);
      setData(updatedData);

      // Scroll to the next item if it exists
      if (index < data.length - 1) {
        console.log('Index to scroll to:', index + 1);

        flatListRef.current.scrollToIndex({
          index: index + 1,
          animated: false,
        });
      }
    } catch (error) {
      console.log(new Error(error));
      alert('Error updating exercise state');
    }
  };
  const undoneItem = (index) => {
    // Scroll to the previous item if it exists
    if (index >= 1) {
      //console.log('iside undoneItem', index);
      flatListRef.current.scrollToIndex({ index: index - 1, animated: false });
      setProgress(progress - 1);
    } else {
      flatListRef.current.scrollToIndex({ index: 0, animated: false });
      setProgress(1);
    }
  };

  const handleSubsitute = (exerciseId, item) => {
    //console.log('handleSubsitute', exerciseId, item);
    //return;
    const { _id, name, instructor, gifUrl, inputType } = item;

    const updatedData = data.map((item, i) => {
      if (item._id === exerciseId) {
        //update the item with the new exercis
        return {
          ...item,
          name: name,
          instructor: instructor,
          gifUrl: gifUrl,
          inputType: inputType,
        };
      } else {
        console.log('item._id', item._id);
      }

      return item;
    });
    setData(updatedData);
  };

  const setupApp = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@current_exercise_state');

      if (jsonValue) {
        const currentExerciseState = JSON.parse(jsonValue);
        const { itemIndex, setIndex } = currentExerciseState;
        //alert(i18n.t('alertUnfinishSession'));
        // Add a delay to ensure FlatList is fully loaded.
        setTimeout(() => {
          // if (itemIndex < data.length - 1) {
          //   // Call the goToIndex function with the next index
          //   goToIndex(itemIndex + 1);
          // } else {
          // Optionally, you can handle the case when it is the last index
          goToIndex(itemIndex);
        }, 500); // Adjust delay as needed.

        // Dispatch action or call function to resume set. Depends on your implementation.
      }
    } catch (error) {
      console.error('Error loading exercise state', error);
      Alert.alert(i18n.t('alertUnfinishSession'));

      //go tho the last index
      goToIndex(1);
    }
  };

  const restoreTimeSpend = async () => {
    try {
      const value = await AsyncStorage.getItem('@time_spend');
      if (value !== null) {
        console.log('time_spend recovered', value);
        setTimeSpent(value);
      }
    } catch (error) {
      console.error('Error getting time spend', error);
      setTimeSpent(0);
    }
  };

  useEffect(() => {
    setupApp();
    restoreTimeSpend();
  }, []);

  const finishWorkout = () => {
    try {
      setStoptimer(true);

      setTimeout(() => {
        navigation.navigate('FinishSession', {
          // duration: timeSpentParent,
          category: category,
          location: location,
          completionPercentage:
            category === 'Cardio' ? 100 : completionPercentage,
        });
      }, 1000);
    } catch (e) {
      console.log(e);
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (a.type === 'warmup' && b.type !== 'warmup') {
      return -1; // "warmup" appears before other types
    } else if (a.type !== 'warmup' && b.type === 'warmup') {
      return 1; // Other types appear after "warmup"
    } else if (a.type === 'cooldown' && b.type !== 'cooldown') {
      return 1; // Other types appear before "cooldown"
    } else if (a.type !== 'cooldown' && b.type === 'cooldown') {
      return -1; // "cooldown" appears after other types
    } else {
      return a.order - b.order;
    }
  });

  //console.log('sortedData', sortedData.length);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <FlatList
          initialNumToRender={2} // Adjust according to your need
          onEndReached={() => {
            Alert.alert(i18n.t('alertEndOfList'));
          }}
          removeClippedSubviews={true}
          maxToRenderPerBatch={2}
          horizontal
          ref={flatListRef}
          keyExtractor={(item) => item._id}
          renderItem={({ item, index }) => (
            <View style={style}>
              <Item
                goToIndex={goToIndex}
                userLevel={userLevel}
                sortedData={sortedData}
                navigation={navigation}
                stoptimer={stoptimer}
                setFinish={setFinish}
                length={data.length}
                exerciseId={item._id}
                title={item.name}
                index={index}
                gifUrl={item.gifUrl}
                isDone={item.isDone}
                description={item.description}
                instructor={item.instructor}
                subsitute={item.subsitute}
                inputType={item.inputType}
                sets={item.sets}
                type={item.type}
                level={item.level}
                isLiked={item.isLiked}
                sub={item.subsitute}
                faInstructor={item.faInstructor}
                faDescription={item.faDescription}
                video={item.video}
                loc={item.loc}
                progress={progress}
                dataLength={data.length}
                visible={visible}
                hideDialog={hideDialog}
                category={category}
                handleSubsitute={handleSubsitute}
                doneItem={doneItem}
                undoneItem={undoneItem}
                userId={userId}
                bodyPart={item.bodyPart}
                allExcerciesIds={sortedData.map((item) => item._id)}
                mainTarget={item.mainTarget}
                otherTarget={item.otherTarget}
                target={item.target}
                userLocation={location}
              />
            </View>
          )}
          data={sortedData}
          pagingEnabled
          ListEmptyComponent={
            <Text
              style={{
                textAlign: 'center',
                fontSize: 20,
                color: theme.colors.primary,
              }}>
              {i18n.t('noExercises')}
            </Text>
          }
        />

        <BottomSheet isVisible={finish}>
          <View
            style={{
              backgroundColor: theme.colors.primary,
              padding: 16,
              height: 200,
              backgroundColor: theme.colors.background,
              paddingHorizontal: 20,
              // height: 300,
              borderRadius: 16,
            }}>
            <Text style={{ textAlign: 'center', fontSize: 20 }}>
              {i18n.t('finishWorkout')}
            </Text>
            <Text style={{ textAlign: 'center', fontSize: 16 }}>
              {i18n.t('workoutDoneprompt')}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginTop: 20,
              }}>
              <Button
                icon="close"
                mode="contained"
                buttonStyle={{
                  backgroundColor: theme.colors.white,
                  borderColor: theme.colors.border,
                  borderWidth: 1,
                  borderRadius: 12,
                  width: Dimensions.get('window').width / 3,
                }}
                titleStyle={{ color: theme.colors.secondary }}
                onPress={() => setFinish(false)}>
                {i18n.t('no')}
              </Button>
              <Button
                icon="check"
                mode="contained"
                buttonStyle={{
                  backgroundColor: theme.colors.button,
                  borderColor: theme.colors.borderColor,
                  borderWidth: 1,
                  borderRadius: 12,
                  width: Dimensions.get('window').width / 3,
                }}
                onPress={() => finishWorkout(setFinish(!finish))}>
                {i18n.t('yes')}
              </Button>
            </View>
          </View>
        </BottomSheet>
      </View>
    </SafeAreaView>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: Platform.OS === 'ios' ? 0 : 15,
      height: height,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingTop: 20,
      alignItems: 'center',
      textAlign: 'center',
    },
    item: {
      padding: 20,
      //marginVertical: 8,
      //marginHorizontal: 16,
      height: height,
    },
    title: {
      fontSize: 25,
      fontWeight: 'bold',
      color: 'black',
      textAlign: 'center',
      alignItems: 'center',
      textAlign: 'center',
    },
    doneText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: 'green',
    },
    fab: {
      // position: 'absolute',
      margin: 2,
      width: 55,
      left: 0,
      bottom: 0,
      backgroundColor: 'blue',
    },
    button: {
      height: 35,
      backgroundColor: '#3f51b5',
    },
  });

export default SessionMainPage;
