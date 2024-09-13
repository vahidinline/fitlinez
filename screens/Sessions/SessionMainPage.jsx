import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View,
  FlatList,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { I18n } from 'i18n-js';
import { BottomSheet, useTheme, Button, Text } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TimeSpentContext } from '../../api/TimeSpentContext';
import i18nt from '../../locales';
import LanguageContext from '../../api/langcontext';
import AuthContext from '../../api/context';
import Item from './listPage/item';
import { updateSession } from '../../api/workoutSessionTracker';
import DrawerList from './listPage/drawer';
import SessionTimer from '../../components/timer/sessionTimer';
import { IconArrowRight } from '../marketplace/filters/icons-';
import { IconCloseCircle } from '../marketplace/filters/icons';
import AdModal from '../../components/AdModal/AdModalIndex';

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
  const { workouts, category, location } = props.route.params;
  const [saveTimer, setSaveTimer] = useState(false);
  const [data, setData] = useState(workouts);
  const flatListRef = useRef(null);
  const hideDialog = () => setVisible(false);
  const [progress, setProgress] = useState(1);
  const { setTimeSpent } = useContext(TimeSpentContext);
  const scrollEnabled = true;
  const ITEM_HEIGHT = Dimensions.get('window').height;
  const ITEM_WEIGHT = Dimensions.get('window').width;
  const [alertVisible, setAlertVisible] = useState(false);
  const RTL = userLanguage === 'fa';
  const style = {
    textAlign: 'center',
    alignItems: 'center',
    width: width,
    height: height,
    flex: 1,
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
          animated: true,
        });
      }
    } catch (error) {
      console.log(new Error(error));
      alert('Error updating exercise state');
    }
  };
  const undoneItem = (index) => {
    // Scroll to the previous item if it exists
    if (index > 0) {
      //console.log('iside undoneItem', index);
      flatListRef.current.scrollToIndex({ index: index - 1, animated: true });
      setProgress(progress - 1);
    } else {
      flatListRef.current.scrollToIndex({ index: 0, animated: true });
      setProgress(1);
    }
  };

  const handleSubsitute = (exerciseId, item) => {
    //console.log('handleSubsitute', exerciseId, item);
    //return;
    const { _id, name, instructor, gifUrl, inputType } = item;

    const updatedData = data.map((item, i) => {
      if (item.exerciseId === exerciseId) {
        //update the item with the new exercis
        return {
          ...item,
          name: name,
          instructor: instructor,
          gifUrl: gifUrl,
          inputType: inputType,
        };
      } else {
        console.log('item._id in main', item.exerciseId);
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
        //console.log('time_spend recovered', value);
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

  const finishWorkout = async () => {
    try {
      setStoptimer(true);
      const sessionId = await AsyncStorage.getItem('sessionId');
      console.log('sessionId', sessionId);
      await updateSession({
        sessionId,

        status: 'completed',
        userId,
      });

      setTimeout(() => {
        navigation.navigate('FinishSession', {
          // duration: timeSpentParent,
          category: category,
          location: location,
          // completionPercentage:
          //   category === 'Cardio' ? 100 : completionPercentage,
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

  //console.log('data', sortedData);

  //console.log('sortedData', sortedData.length);
  const getItemLayout = (data, index) => ({
    length: ITEM_WEIGHT,
    offset: ITEM_WEIGHT * index,
    index,
  });

  const closeSession = async () => {
    console.log('closing session');
    const sessionId = await AsyncStorage.getItem('sessionId');
    const res = await updateSession({
      sessionId,
      status: 'uncompleted',
    });
    if (res) {
      console.log('session closed');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    }
  };

  const handleCloseSession = async () => {
    setAlertVisible(true);
    console.log('close session', alertVisible);

    // Alert.alert(
    //   i18n.t('closeSession'),
    //   i18n.t('closeSessionMessage'),
    //   [
    //     {
    //       text: i18n.t('cancel'),
    //       onPress: () => console.log('Cancel Pressed'),
    //       style: 'cancel',
    //     },
    //     {
    //       text: i18n.t('confirm'),
    //       onPress: async () => closeSession(),
    //     },
    //   ],
    //   { cancelable: false }
    // );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <View
          style={{
            top: Platform.OS === 'ios' ? 0 : 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',

            width: Dimensions.get('window').width / 1.1,
            height: 50,
            backgroundColor: theme.colors.background,
            paddingHorizontal: 10,
            borderWidth: 0.5,
            borderColor: theme.colors.border,
            borderRadius: 16,
            margin: 15,
          }}>
          <TouchableOpacity
            style={{
              width: '30%',
            }}
            onPress={() => handleCloseSession()}>
            {/* <IconInfo /> */}
            <IconCloseCircle
              color={theme.colors.secondary}
              size={24}
              style={{ marginRight: 10 }}
            />
          </TouchableOpacity>
          <SessionTimer
            saveTimer={saveTimer}
            setSaveTimer={setSaveTimer}
            stoptimer={stoptimer}
            RTL={RTL}
          />
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => setFinish(true)}>
            <Text
              style={{
                color: theme.colors.secondary,
                fontWeight: '400',
                fontSize: 16,
                marginLeft: 10,
                fontFamily: 'Vazirmatn',
              }}>
              {i18n.t('finishWorkout')}
            </Text>
            <IconArrowRight />
          </TouchableOpacity>
        </View>
        <FlatList
          initialNumToRender={2} // Adjust according to your need
          onEndReached={() => {
            console.log('End of list');
            // Alert.alert(i18n.t('alertEndOfList'));
          }}
          removeClippedSubviews={true}
          maxToRenderPerBatch={2}
          horizontal
          getItemLayout={getItemLayout}
          ref={flatListRef}
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
          renderItem={({ item, index }) => (
            <View key={item.exerciseId} style={style}>
              <Item
                goToIndex={goToIndex}
                image={item.image}
                userLevel={userLevel}
                sortedData={sortedData}
                navigation={navigation}
                stoptimer={stoptimer}
                setFinish={setFinish}
                length={data.length}
                exerciseId={item.exerciseId}
                title={item.exerciseName}
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
                allExcerciesIds={sortedData.map((item) => item.exerciseId)}
                mainTarget={item.mainTarget}
                otherTarget={item.otherTarget}
                target={item.target}
                userLocation={location}
                setSaveTimer={setSaveTimer}
                setAlertVisible={setAlertVisible}
                alertVisible={alertVisible}
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
        <View
          style={{
            position: 'absolute',
            top: 95,

            right: Dimensions.get('window').width - 38,
            //right: 0,
            bottom: 10,
            //justifyContent: 'center',
            alignItems: 'center',
            //backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1000,
          }}>
          <DrawerList
            sortedData={sortedData}
            userLanguage={userLanguage}
            goToIndex={goToIndex}
            RTL={RTL}
            //index={index}
            //img={gifUrl}
          />
        </View>
        {alertVisible && (
          <AdModal
            visible={alertVisible}
            title={i18n.t('closeSession')}
            message={i18n.t('closeSessionMessage')}
            onConfirm={closeSession}
            onCancel={() => setAlertVisible(false)}
          />
        )}
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
            <Text
              style={{
                textAlign: 'center',
                fontSize: 20,
                fontFamily: 'Vazirmatn',
                color: theme.colors.secondary,
                marginBottom: 10,
              }}>
              {i18n.t('finishWorkout')}
            </Text>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 16,
                color: theme.colors.secondary,
                fontFamily: 'Vazirmatn',
              }}>
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
                titleStyle={{
                  color: theme.colors.secondary,
                  fontFamily: 'Vazirmatn',
                }}
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
                titleStyle={{
                  fontFamily: 'Vazirmatn',
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
      marginHorizontal: 16,
      width: width / 1.2,
      height: height / 1.1,
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
