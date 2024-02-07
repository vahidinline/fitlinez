// import { Platform, ScrollView, TouchableOpacity, View } from 'react-native';
// import { Button, Input, Text, Icon, Card, Badge } from '@rneui/themed';
// import React, { useContext, useEffect, useState } from 'react';
// import { useFonts } from 'expo-font';
// import axios from 'axios';
// import { Formik } from 'formik';
// import AuthContext from '../../api/context';
// import { Picker } from '@react-native-picker/picker';
// import { useNavigation } from '@react-navigation/native';
// import { I18n } from 'i18n-js';
// import i18nt from '../../locales/index';
// import LanguageContext from '../../api/langcontext';
// import { SafeAreaView } from 'react-native';
// const Support = () => {
//   const { userLanguage } = useContext(LanguageContext);
//   const i18n = new I18n(i18nt);
//   i18n.locale = userLanguage;

//   const { userAuth } = useContext(AuthContext);
//   const navigation = useNavigation();
//   const [tickets, setTickets] = useState([]);
//   const [buttonDisable, setButtonDisable] = useState(false);
//   const getolderTickets = async () => {
//     setButtonDisable(true);
//     await axios
//       .get(`https://jobitta.com/support`, {
//         params: {
//           userId: userAuth.id,
//         },
//       })
//       .then((res) => {
//         setTickets(res.data);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };
//   useEffect(() => {
//     getolderTickets();
//   }, []);
//   return (
//     <SafeAreaView style={{ flex: 1, height: '100%' }}>
//       <ScrollView>
//         <Text
//           style={{
//             textAlign: 'center',
//             fontSize: 20,
//             fontWeight: 'bold',
//             color: 'black',
//           }}>
//           {i18n.t('support')}
//         </Text>
//         <Formik
//           initialValues={{
//             priority: '',
//             comment: '',
//             userId: userAuth.id,
//             devideName: Platform.OS === 'ios' ? 'ios' : 'android',
//           }}
//           onSubmit={(values) => {
//             axios
//               .post('https://jobitta.com/support', values)
//               .then((res) => {
//                 alert('Ticket sent');
//               })
//               .catch((err) => {
//                 console.log(err);
//               });
//           }}>
//           {({ handleChange, handleSubmit, errors, values, handleBlur }) => (
//             <View>
//               {/* <Picker
//                 selectedValue={values.priority}
//                 // style={{ height: 50, width: '100%' }}
//                 itemStyle={{
//                   // backgroundColor: 'grey',
//                   color: '#000',

//                   fontSize: 17,
//                 }}
//                 onValueChange={(itemValue, itemIndex) =>
//                   handleChange('priority')(itemValue)
//                 }>
//                 <Picker.Item label={i18n.t('priority')} value="0" />
//                 <Picker.Item label={i18n.t('normal')} value="1" />
//                 <Picker.Item label={i18n.t('high')} value="2" />
//               </Picker> */}
//               <Input
//                 placeholder={i18n.t('supportPlaceholder')}
//                 onChangeText={handleChange('comment')}
//                 onBlur={handleBlur('comment')}
//                 value={values.comment}
//                 multiline={true}
//                 numberOfLines={4}
//               />

//               <Button
//                 type="outline"
//                 title={
//                   !buttonDisable
//                     ? `${i18n.t('submitting')}`
//                     : `${i18n.t('submit')}`
//                 }
//                 onPress={handleSubmit}
//                 titleStyle={{ color: '#000' }}
//                 buttonStyle={{
//                   borderColor: '#eee',
//                   borderRadius: 10,
//                   width: 100,
//                   alignSelf: 'center',
//                 }}
//               />
//             </View>
//           )}
//         </Formik>
//         <View style={{ height: 20 }} />
//         <View>
//           <Text
//             style={{
//               textAlign: 'center',
//               fontSize: 15,
//               fontWeight: 'bold',
//               color: '#000',
//             }}>
//             {i18n.t('olderTicket')}
//           </Text>

//           <View>
//             {tickets?.map((ticket, i) => (
//               <ScrollView>
//                 <Card
//                   containerStyle={{
//                     backgroundColor: '#eee',
//                     borderColor: 'darkgray',
//                     borderWidth: 1,
//                   }}
//                   key={i}>
//                   <View
//                     style={{
//                       flex: 1,
//                       flexDirection: 'row',
//                       justifyContent: 'space-between',
//                     }}>
//                     <Text> {ticket.Date.substr(0, 10)} </Text>
//                     <View>
//                       <Text style={{ color: '#000' }}>
//                         {ticket.reply ? (
//                           <Badge value="Answered" status="success" />
//                         ) : (
//                           <Badge
//                             value={i18n.t('underReview')}
//                             status="warning"
//                           />
//                         )}
//                       </Text>
//                     </View>
//                   </View>
//                   <Card.Divider />
//                   <Text style={{ color: '#000' }}>{ticket.comment}</Text>
//                   <Card.Divider />
//                   <Text style={{ color: '#000' }}>
//                     {ticket.reply
//                       ? `support reply: ${ticket.reply}`
//                       : `${i18n.t('underReview')}`}
//                   </Text>
//                 </Card>
//               </ScrollView>
//             ))}
//           </View>
//         </View>
//       </ScrollView>
//       <View style={{ flexDirection: 'row' }}>
//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           style={{
//             flexDirection: 'row',
//             justifyContent: 'flex-start',
//             width: '100%',
//             backgroundColor: '#eee',
//             // borderTopStartRadius: 10,
//           }}>
//           <Icon raised name="keyboard-return" type="material" color="black" />
//           <Text
//             style={{
//               color: '#000',
//               alignSelf: 'center',
//             }}>
//             {i18n.t('back')}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default Support;
