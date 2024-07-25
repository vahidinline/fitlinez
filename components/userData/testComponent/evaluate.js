import { ButtonGroup, Text, useTheme } from '@rneui/themed';
import AnimatedLottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, View } from 'react-native';
import CategoryList from '../../../screens/Home/categoryList';
import getPackages from '../../../api/getLatestPackage';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
function Evaluate(props) {
  const { route, message } = props;
  const [oneRM, setOneRM] = useState(null);

  const userScore =
    route && route.params && route.params.userScore
      ? route.params.userScore
      : props.userScore;

  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [workoutCategories, setWorkoutCategories] = useState([]);
  const [sort, setSort] = useState(0);
  const [buttonIndex, setButtonIndex] = useState();
  const navigation = useNavigation();
  useEffect(() => {
    const getAllCategories = async () => {
      const result = await getPackages();
      setWorkoutCategories(result);
    };
    getAllCategories();
  }, []);

  useEffect(() => {
    //removeDB();
    if (buttonIndex === 1) {
      navigation.navigate('packageNavigator');
    } else if (buttonIndex === 0) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    }
  }, [buttonIndex]);

  useEffect(() => {
    if (userScore <= 6.5) {
      setSort(0);
    } else if (userScore > 4 && userScore < 6) {
      setSort(1);
    } else if (userScore > 6) {
      setSort(2);
    } else {
      setSort(null);
    }
  }, [userScore]);

  const oneRMchecker = async () => {
    const oneRM = await AsyncStorage.getItem('oneRM');
    if (oneRM) {
      console.log('oneRMds', oneRM);
      setOneRM(oneRM);
    } else {
      console.log('no oneRM');
    }
  };

  useEffect(() => {
    // readData();

    oneRMchecker();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.screen}>
        <Text style={styles.heading}>
          You can pick a workout plan based on your score
        </Text>
        <Text style={styles.heading}>
          {oneRM ? `Your 1RM is ${oneRM}` : null}
        </Text>
        <View
          style={{
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height / 2,
          }}>
          <CategoryList data={workoutCategories} view={false} sort={sort} />
        </View>
        <ButtonGroup
          buttons={['Back to Home', 'View more Plans']}
          selectedIndex={sort}
          onPress={(index) => setButtonIndex(index)}
          containerStyle={{ height: 40, top: 50 }}
          selectedTextStyle={{ color: theme.colors.primary }}
          buttonStyle={{ backgroundColor: theme.colors.secondary }}
          selectedButtonStyle={{ backgroundColor: theme.colors.secondary }}
          buttonContainerStyle={{ backgroundColor: theme.colors.secondary }}
          textStyle={{ color: theme.colors.primary }}
        />
      </View>
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primary,
      height: Dimensions.get('window').height,
    },
    screen: {},
    heading: {
      fontSize: 14,
      fontWeight: 'bold',
      // marginBottom: 10,
      color: theme.colors.secondary,
      textAlign: 'center',
    },
    description: {
      color: theme.colors.secondary,
      fontSize: 16,
      marginBottom: 20,

      textAlign: 'center',
    },
    button: {
      backgroundColor: theme.colors.secondary,
      //position: 'absolute',
      bottom: 30,
      //paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      marginBottom: 10,
    },
    homeButton: {
      backgroundColor: theme.colors.secondary,
      position: 'absolute',
      marginTop: 20,
      bottom: 0,
      height: 30,
      //paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      marginBottom: 10,
    },

    disabledButton: {
      backgroundColor: theme.colors.secondary,
      position: 'absolute',
      bottom: 20,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 25,
      marginBottom: 10,
    },
    buttonText: {
      color: theme.colors.primary,
      fontSize: 16,
      fontWeight: 'bold',
    },
    disabledButtonText: {
      color: theme.colors.seonndary,
      fontSize: 16,
    },
    dotsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: '#CCC',
      marginHorizontal: 5,
    },
    activeDot: {
      backgroundColor: '#007BFF',
    },
  });

export default Evaluate;
