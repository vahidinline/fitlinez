// import React, { useRef, useContext, useState } from 'react';
// import { Platform, Pressable, View } from 'react-native';
// import {
//   BannerAd,
//   BannerAdSize,
//   TestIds,
//   useForeground,
// } from 'react-native-google-mobile-ads';
// import AuthContext from '../context';
// import i18nt from '../../locales';
// import { I18n } from 'i18n-js';
// import LanguageContext from '../langcontext';
// import { Text } from '@rneui/base';
// import AdModal from '../../components/AdModal/AdModalIndex';
// import { useNavigation } from '@react-navigation/native';
// import { Iconclose } from '../../screens/marketplace/filters/icons';
// import { useTheme } from '@rneui/themed';

// const adUnitId = __DEV__
//   ? TestIds.ADAPTIVE_BANNER
//   : 'ca-app-pub-8519330785052751~6171768783';

// function BannerAdMob() {
//   const bannerRef = useRef(null);
//   const { userAuth } = useContext(AuthContext);
//   const userLevel = userAuth.level;
//   const { userLanguage } = useContext(LanguageContext);
//   const i18n = new I18n(i18nt);
//   i18n.locale = userLanguage;
//   const [alertVisible, setAlertVisible] = useState(false);
//   const isRTL = userLanguage === 'fa';
//   const navigation = useNavigation();
//   const { theme } = useTheme();
//   // Request a new ad when the app comes to the foreground on iOS
//   useForeground(() => {
//     if (Platform.OS === 'ios') {
//       bannerRef.current?.load();
//     }
//   });

//   const handleRemoveAdPress = () => {
//     setAlertVisible(true);
//   };

//   const handleConfirmRemoveAd = () => {
//     setAlertVisible(false);
//     navigation.navigate('Upgrade');
//   };

//   const handleCancelRemoveAd = () => {
//     setAlertVisible(false);
//   };

//   return (
//     <View style={{ justifyContent: 'center', alignItems: 'center' }}>
//       {userLevel !== 4 && (
//         <>
//           <Pressable
//             style={{
//               position: 'absolute',
//               top: -50,
//               right: 0,
//               zIndex: 1000,
//               flexDirection: 'row',
//               borderWidth: 1,
//               margin: 10,
//               borderRadius: 10,
//               padding: 3,
//               borderColor: theme.colors.border,
//             }}
//             onPress={handleRemoveAdPress}>
//             <Text
//               style={{
//                 fontFamily: 'Vazirmatn',
//                 color: theme.colors.border,
//                 top: 3,
//                 fontSize: 10,
//               }}>
//               {i18n.t('removeAdTitle')}
//             </Text>
//             <Iconclose size={20} color={theme.colors.border} />
//           </Pressable>
//           <BannerAd
//             ref={bannerRef}
//             unitId={adUnitId}
//             size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
//           />
//           <AdModal
//             visible={alertVisible}
//             title={i18n.t('removeAdTitle')}
//             message={i18n.t('upgradeAlertDescription')}
//             onConfirm={handleConfirmRemoveAd}
//             onCancel={handleCancelRemoveAd}
//           />
//         </>
//       )}
//     </View>
//   );
// }

// export default BannerAdMob;
