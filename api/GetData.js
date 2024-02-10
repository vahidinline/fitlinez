import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Alert, Linking } from 'react-native';

const updateWorkoutPlan = async ({ data, userId }) => {
  try {
    await AsyncStorage.setItem('workoutsList', JSON.stringify(data.data)).then(
      () => {
        //setShowCustomAlert(true);
        const res = axios.post(`https://jobitta.com/newplan/usage/`, {
          userId: userId,
          packageId: data._id,
        });
      }
    );
  } catch (error) {
    console.log(error);
    // Possible AsyncStorage error (e.g., storage limit reached)
  }
};

const getWorkOutData = async (userId) => {
  try {
    const response = await axios
      .get('https://jobitta.com/newplan/prebuild')
      .then(async (res) => {
        await updateWorkoutPlan({ data: res.data[2], userId: userId });
      });
    return true;
  } catch (error) {
    console.log(error);
    return false;
    // Possible 404 error (e.g., endpoint not found)
  }
};

const getSubWorkOutData = async (
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
) => {
  try {
    const response = await axios
      .get('https://jobitta.com/workout/subworkout', {
        params: {
          userId: userId,
          exerciseId: exerciseId,
          bodyPart: bodyPart,
          loc: loc,
          category: category,
          allExcerciesIds: allExcerciesIds,
          type: type,
          title: title,
          mainTarget: mainTarget,
          otherTarget: otherTarget,
          target: target,
          userLocation: userLocation,
        },
      })
      .then(async (res) => {
        console.log('res', res.data.length);
        return res.data;
      });
    return response; // <-- This is the missing return statement
  } catch (error) {
    console.log(error);
    return false;
    // Possible 404 error (e.g., endpoint not found)
  }
};

function createGoogleCalendarEvent(
  summary,
  location,
  description,
  startTime,
  endTime,
  recurrence
) {
  let recurrenceParam = '';
  if (recurrence) {
    recurrenceParam = `&recur=RRULE:${recurrence}`;
  }

  const eventUrl = encodeURI(
    `https://www.google.com/calendar/render?action=TEMPLATE&text=${summary}&location=${location}&details=${description}&dates=${startTime}/${endTime}${recurrenceParam}`
  );
  Linking.openURL(eventUrl);
}

const userStatusCheck = async (userAuth, setUserAuth) => {
  try {
    await axios
      .get(`https://jobitta.com/api/userupdate/${userAuth.id}`, {
        headers: {
          Authorization: `Bearer ${userAuth}`,
        },
      })
      .then((res) => {
        if (!res.data) {
          setUserAuth(null);
        } else {
          const { isActive } = res.data[0];
          if (isActive !== true) {
            Alert.alert('Your account is not active. Please upgrade your plan');
            setUserAuth(null);
          } else return;
        }
      });
  } catch (error) {
    //console.log('error getting userId', error);
  }
};

const userLevelCheck = async (userAuth, setUserAuth) => {
  console.log('userAuth', userAuth);

  const key = 'fitlinez-session';

  return new Promise((res, rej) => {
    const fetchData = async () => {
      try {
        let response = await axios.get(
          `https://jobitta.com/api/userupdate/${userAuth.id}`,
          {
            headers: {
              Authorization: `Bearer ${userAuth}`,
            },
          }
        );

        if (!response.data) {
          setUserAuth(null);
        } else {
          const { level } = response.data;
          console.log('level', level);
          if (level === 4) {
            const updatedUserAuth = {
              ...userAuth,
              level: 4, // Update the level to 4
            };
            setUserAuth(updatedUserAuth);
          } else if (level === 0) {
            const updatedUserAuth = {
              ...userAuth,
              level: 0, // Update the level to 4
            };
            setUserAuth(updatedUserAuth);
          }

          const { isExpired } = response.data[0];
          if (isExpired !== undefined && isExpired === true) {
            updateExpiredUser(userAuth, setUserAuth);
          }
        }
        res(userAuth);
      } catch (error) {
        console.log('error getting userId', error);
      }
    };

    fetchData();
  });
};

const checkVersion = async (
  currentVersion,
  Userplatform,
  userLocation,
  i18n
) => {
  try {
    const value = await axios.get('https://jobitta.com/api/checkNewVersion');
    const {
      version,
      status,
      platform,
      location,
      itunesItemId,
      androidPackageName,
      forceUpdate,
    } = value.data[0];

    const laterDate = await AsyncStorage.getItem('LATER_DATE');

    if (laterDate !== null) {
      const delayDate = new Date(JSON.parse(laterDate));
      delayDate.setDate(delayDate.getDate() + 1);
      const now = new Date();
      if (now < delayDate) {
        return;
      }
    }

    if (
      status == true &&
      version !== currentVersion &&
      (platform === 'Both' || platform === Userplatform) &&
      (location === 'All' || location === userLocation)
    ) {
      Alert.alert(
        i18n.t('newVersionTitle'),
        i18n.t('newVersionSubTitle'),
        [
          {
            text: i18n.t('update'),
            onPress: () => {
              if (Userplatform === 'ios') {
                // Open the iOS App Store directly
                Linking.openURL(
                  `itms-apps://itunes.apple.com/app/viewContentsUserReviews/id${itunesItemId}`
                );
              } else {
                // Open the Android Play Store directly
                Linking.openURL(`market://details?id=${androidPackageName}`);
              }
            },
          },
          forceUpdate === true
            ? null
            : {
                text: i18n.t('later'),
                onPress: async () => {
                  const now = new Date();
                  AsyncStorage.setItem('LATER_DATE', JSON.stringify(now));
                },
                style: 'cancel',
              },
        ].filter(Boolean) // This will filter out any null values
      );
    }
  } catch (e) {
    // error reading value
  }
};

//check new version
// const checkVersion = async (
//   currentVersion,
//   Userplatform,
//   userLocation,
//   i18n
// ) => {
//   try {
//     const value = await axios.get('https://jobitta.com/api/checkNewVersion');
//     const {
//       version,
//       status,
//       platform,
//       location,
//       itunesItemId,
//       androidPackageName,
//       forceUpdate,
//     } = value.data[0];

//     if (
//       status == true &&
//       version !== currentVersion &&
//       (platform === 'Both' || platform === Userplatform) &&
//       (location === 'All' || location === userLocation)
//     ) {
//       Alert.alert(
//         i18n.t('newVersionTitle'),
//         i18n.t('newVersionSubTitle'),
//         [
//           {
//             text: i18n.t('update'),
//             onPress: () => {
//               if (Userplatform === 'ios') {
//                 // Open the iOS App Store directly
//                 Linking.openURL(
//                   `itms-apps://itunes.apple.com/app/viewContentsUserReviews/id${itunesItemId}`
//                 );
//               } else {
//                 // Open the Android Play Store directly
//                 Linking.openURL(`market://details?id=${androidPackageName}`);
//               }
//             },
//           },
//           forceUpdate === true
//             ? null
//             : {
//                 text: i18n.t('later'),
//                 onPress: () => console.log('Cancel Pressed'),
//                 style: 'cancel',
//               },
//         ].filter(Boolean) // This will filter out any null values
//       );
//     }
//   } catch (e) {
//     // error reading value
//   }
// };

const updateExpiredUser = async (userAuth, setUserAuth) => {
  try {
    await axios
      .put(
        `https://jobitta.com/api/updateUserLevelAfterExpire/${userAuth.id}`,
        {
          headers: {
            Authorization: `Bearer ${userAuth}`,
          },
        }
      )
      .then((res) => {
        // if (!res.data) {
        //   setUserAuth(null);
        // } else {
        const { isExpired } = res.data[0];
        const { level } = res.data[0];
        // console.log('level', level);
        // console.log('isExpired', isExpired);
        //}
      });
  } catch (error) {
    //console.log('error getting userId', error);
  }
};

const getPackages = async () => {
  //setLoading(true);
  return new Promise(async (resolve) => {
    await axios.get('https://jobitta.com/newplan/prebuild').then((res) => {
      resolve(res.data);
    });
  });
};

export {
  userStatusCheck,
  getWorkOutData,
  userLevelCheck,
  updateWorkoutPlan,
  checkVersion,
  getSubWorkOutData,
  createGoogleCalendarEvent,
  getPackages,
};
