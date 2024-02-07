// import React, { useContext, useEffect, useState } from 'react';
// import { ScrollView, TouchableOpacity, View } from 'react-native';
// import { Text, Input, Button, Image, Icon } from '@rneui/themed';
// import AuthContext from '../../api/context';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import fitnessCalculatorFunctions from 'fitness-calculator';
// import { CommonActions, useNavigation } from '@react-navigation/native';
// import { RadioButton, Switch } from '@rneui/themed';
// import console from '../../api/console';
// import { Picker } from '@react-native-picker/picker';
// import { getLocales } from 'expo-localization';
// import { I18n } from 'i18n-js';
// import i18nt from '../../locales';
// import LanguageContext from '../../api/langcontext';

// const InitialForm = ({ setModalVisible }) => {
//   const { userLanguage } = useContext(LanguageContext);
//   const i18n = new I18n(i18nt);
//   i18n.locale = userLanguage;
//   const { userAuth, setUserAuth } = useContext(AuthContext);
//   const navigation = useNavigation();
//   const [name, setName] = useState('');
//   const [age, setAge] = useState('');
//   const [height, setHeight] = useState('');
//   const [weight, setWeight] = useState('');
//   const [targetWeight, setTargetWeight] = useState('');
//   const [image, setImage] = useState(null);
//   const [email, setEmail] = useState('');
//   const [isEnabled, setIsEnabled] = useState(false);
//   const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
//   const [gender, setGender] = useState('Female');
//   console.log('gender', gender);
//   useEffect(() => {
//     setGender(isEnabled ? 'female' : 'male');
//   }, [isEnabled]);
//   useEffect(() => {
//     const defaultData = async () => {
//       const userData = await AsyncStorage.getItem('userData');
//       if (userData) {
//         const { gender } = JSON.parse(userData);
//         const { age } = JSON.parse(userData);
//         const { height } = JSON.parse(userData);
//         const { weight } = JSON.parse(userData);
//         const { targetWeight } = JSON.parse(userData);

//         setAge(age);
//         setHeight(height);
//         setWeight(weight);
//         setTargetWeight(targetWeight);
//         setGender(gender);
//       }
//     };
//     defaultData();
//   }, []);
//   useEffect(() => {
//     const getUseremail = async () => {
//       setEmail(userAuth.email);
//     };
//     getUseremail();
//   }, []);
//   useEffect(() => {
//     const getUserName = async () => {
//       setName(userAuth.name);
//     };
//     getUserName();
//   }, []);

//   const handleSubmit = () => {
//     AsyncStorage.setItem(
//       'userData',
//       JSON.stringify({
//         name: name,
//         gender: gender,
//         image: image,
//         age: age,
//         height: height,
//         weight: weight,
//         targetWeight: targetWeight,
//       })
//     )
//       .then(async (res) => {
//         navigation.dispatch(
//           CommonActions.reset({
//             index: 0,
//             routes: [{ name: 'Contact' }],
//           })
//         );
//       })

//       .catch((e) => {
//         console.log('e', e);
//       });
//   };

//   const calcBMI = async () => {
//     const data = fitnessCalculatorFunctions.BMI(
//       parseInt(height),
//       parseInt(weight)
//     );
//     await AsyncStorage.setItem(
//       'BMI',
//       JSON.stringify({
//         data,
//       })
//     )
//       .then(async (res) => {
//         const result = await AsyncStorage.getItem('BMI');
//         console.log('async bmi then', result);
//       })
//       .catch((e) => {
//         console.log('async bmi catch', e);
//       });
//   };

//   useEffect(() => {
//     calcBMI();
//   }, [weight, height]);
//   return (
//     <View style={{ flex: 1, height: '100%', top: 10 }}>
//       <ScrollView>
//         <View
//           style={{
//             flex: 1,
//             top: 10,
//           }}>
//           <Text
//             style={{
//               color: '#000',
//               justifyContent: 'center',
//               alignContent: 'center',
//               textAlign: 'center',
//               fontSize: 20,
//               bottom: 5,
//             }}>
//             {i18n.t('titleProfile')}
//           </Text>

//           {/* <Input
//             returnKeyType="done"
//             disabled
//             placeholder="name"
//             value={name}
//             inputContainerStyle={{
//               borderColor: '#fff',
//               backgroundColor: '#eee',
//             }}
//             onChangeText={(e) => {
//               setName(e);
//             }}
//           /> */}
//           <Input
//             returnKeyType="done"
//             placeholder={i18n.t('age')}
//             value={age}
//             inputContainerStyle={{
//               borderColor: '#eee',
//               backgroundColor: '#eee',
//             }}
//             keyboardType="numeric"
//             onChangeText={(e) => {
//               setAge(e);
//             }}
//           />
//           <Input
//             returnKeyType="done"
//             placeholder={i18n.t('height')}
//             value={height}
//             keyboardType="numeric"
//             inputContainerStyle={{
//               borderColor: '#eee',
//               backgroundColor: '#eee',
//             }}
//             onChangeText={(e) => {
//               setHeight(e);
//             }}
//           />
//           <Input
//             returnKeyType="done"
//             placeholder={i18n.t('weight')}
//             value={weight}
//             keyboardType="numeric"
//             inputContainerStyle={{
//               borderColor: '#eee',
//               backgroundColor: '#eee',
//             }}
//             onChangeText={(e) => {
//               setWeight(e);
//             }}
//           />
//           <Input
//             returnKeyType="done"
//             placeholder={i18n.t('targetWeight')}
//             value={targetWeight}
//             keyboardType="numeric"
//             inputContainerStyle={{
//               borderColor: '#eee',
//               backgroundColor: '#eee',
//             }}
//             onChangeText={(e) => {
//               setTargetWeight(e);
//             }}
//           />
//           <Input
//             returnKeyType="done"
//             placeholder="Email"
//             value={email}
//             keyboardType="default"
//             disabled
//             inputContainerStyle={{
//               borderColor: '#eee',
//               backgroundColor: '#eee',
//             }}
//             onChangeText={(e) => {
//               setTargetWeight(e);
//             }}
//           />
//           <View>
//             <View
//               style={{
//                 flexDirection: 'row',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 width: '100%',
//                 margin: 20,
//               }}>
//               <Text
//                 style={{
//                   color: gender === 'male' ? '#000' : 'darkgray',
//                   marginRight: 10,
//                   fontWeight: gender === 'male' ? 'bold' : 'normal',
//                 }}>
//                 {i18n.t('male')}
//               </Text>
//               <Switch
//                 trackColor={{ false: 'lightgray', true: 'lightgray' }}
//                 thumbColor={isEnabled ? '3F3B6C' : '#f5dd4b'}
//                 ios_backgroundColor="lightgray"
//                 onValueChange={toggleSwitch}
//                 value={isEnabled}
//               />
//               <Text
//                 style={{
//                   color: isEnabled ? '#000' : 'darkgray',
//                   marginLeft: 10,
//                   fontWeight: gender === 'female' ? 'bold' : 'normal',
//                 }}>
//                 {i18n.t('female')}
//               </Text>
//             </View>
//           </View>
//         </View>
//       </ScrollView>

//       <View style={{ flexDirection: 'row' }}>
//         <View
//           style={{
//             flexDirection: 'row',
//             justifyContent: 'flex-start',
//             width: '50%',
//             backgroundColor: '#eee',
//             borderTopStartRadius: 10,
//           }}>
//           <Icon
//             raised
//             name="keyboard-return"
//             type="material"
//             color="black"
//             onPress={() => navigation.goBack()}
//           />
//           <Text
//             style={{
//               color: '#000',
//               alignSelf: 'center',
//             }}>
//             {i18n.t('back')}
//           </Text>
//         </View>
//         <View
//           style={{
//             flexDirection: 'row',
//             width: '50%',
//             //left: 250,
//             justifyContent: 'flex-end',
//             backgroundColor: '#eee',
//             borderTopEndRadius: 10,
//           }}>
//           <Text
//             style={{
//               color: '#000',
//               alignSelf: 'center',
//             }}>
//             {i18n.t('submit')}
//           </Text>
//           <Icon
//             raised
//             name="save"
//             type="material"
//             color="black"
//             onPress={() => handleSubmit()}
//           />
//         </View>
//       </View>
//     </View>
//   );
// };
// export default InitialForm;
