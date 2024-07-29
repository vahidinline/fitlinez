import AsyncStorage from '@react-native-async-storage/async-storage';

import { Alert, Linking } from 'react-native';
import api from './api';
import { savePackages } from './assignNewPlan';

const getPlanUsage = async ({ packageId, userId }) => {
  console.log('getPlanUsage', packageId);
  try {
    const response = await api.post(`/newplan/userPlan/`, {
      params: {
        userId: userId,
        packageId: packageId,
      },
    });
    const data = response.data;
    console.log('data in getData', data);

    await AsyncStorage.setItem('workoutsList', JSON.stringify(data)).then(
      () => {
        console.log('stored into async updateWorkoutPlan');
        console.log('data in getData', data);
        //setShowCustomAlert(true);
        //for previous plan use "usage" endpoint
      }
    );

    return response.data;
  } catch (error) {
    console.log(error);
    return false;
    // Possible 404 error (e.g., endpoint not found)
  }
};

const updateWorkoutPlan = async (data, addedDateTime, userId) => {
  getPlanUsage(userId);
  return;
  //console.log('updateWorkoutPlan by asyncstorage', data, addedDateTime);
  try {
    await AsyncStorage.setItem(
      'workoutsList',
      JSON.stringify({ data, addedDateTime })
    ).then(() => {
      console.log('stored into async updateWorkoutPlan');
      //setShowCustomAlert(true);
      //for previous plan use "usage" endpoint
      const res = api.post(`/newplan/userPlan/`, {
        userId: userId,
        packageId: data._id,
      });
    });
  } catch (error) {
    console.log(error);
    // Possible AsyncStorage error (e.g., storage limit reached)
  }
};

const getWorkOutData = async (userId) => {
  console.log('what are you doing getWorkOutData');
  try {
    const response = await api.get('/newplan/prebuild').then(async (res) => {
      await updateWorkoutPlan({ data: res.data[2], userId: userId });
    });
    //console.log('response', response);
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
  console.log(
    'getSubWorkOutData',
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
  );
  try {
    const response = await api
      .get('/workout/subworkout', {
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
        //console.log('res', res.data.length);
        return res.data;
      });
    return response; // <-- This is the missing return statement
  } catch (error) {
    //console.log(error);
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
    await api
      .get(`/api/userupdate/${userAuth.id}`, {
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
  //console.log('userAuth', userAuth);

  const key = 'fitlinez-session';

  return new Promise((res, rej) => {
    const fetchData = async () => {
      try {
        let response = await api.get(`/api/userupdate/${userAuth.id}`, {
          headers: {
            Authorization: `Bearer ${userAuth}`,
          },
        });

        if (!response.data) {
          setUserAuth(null);
        } else {
          const { level } = response.data;
          //cconsole.log('level', level);
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
        //console.log('error getting userId', error);
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
    const value = await api.get('/api/checkNewVersion');
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
    await api
      .put(`/api/updateUserLevelAfterExpire/${userAuth.id}`, {
        headers: {
          Authorization: `Bearer ${userAuth}`,
        },
      })
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

const getPackages = async (userId) => {
  //setLoading(true);
  return new Promise(async (resolve) => {
    await api.get('/newplan/prebuild').then((res) => {
      resolve(res.data);
      try {
        //add to asyncstorage
        AsyncStorage.setItem('Allpackages', JSON.stringify(res.data));
      } catch (error) {
        //console.log('error', error);
      }
    });
  });
};

const getUpdatedWorkoutPlan = async ({ userId, packageId }) => {
  console.log('getUpdatedWorkoutPlan', userId, packageId);
  try {
    const response = await api.post('/newplan/currentPlan', {
      userId: userId,
      packageId: packageId,
    });
    console.log('response', response.data);
    const savePlan = await savePackages(response.data, userId);
    const res = await AsyncStorage.setItem(
      'workoutsList',
      JSON.stringify(savePlan)
    );
    console.log('response in getUpdatedWorkoutPlan', res);
  } catch (error) {
    console.log(error);
    return false;
    // Possible 404 error (e.g., endpoint not found)
  }
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
  getPlanUsage,
  getUpdatedWorkoutPlan,
};
