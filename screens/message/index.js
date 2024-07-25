import { Badge, Text, useTheme, Button } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, TouchableOpacity, FlatList } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Header from '../../components/header';
import { Modal } from 'react-native';
import moment from 'moment';
import { I18n } from 'i18n-js';
import i18nt from '../../locales';
import LanguageContext from '../../api/langcontext';
import { useContext } from 'react';
import MsgContext from '../../api/messageContext';
import {
  markMessageAsRead,
  markMessageAsDeleted,
} from '../../api/notification';
import { Icon } from '@rneui/base';

function MessageCenter() {
  const [messages, setMessages] = useState([]);
  const { userLanguage } = useContext(LanguageContext);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const { msg, setMsg } = useContext(MsgContext);

  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [deletedMsg, setDeletedMsg] = useState(false);

  const { theme } = useTheme();
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;

  // useEffect(() => {
  //   // deleteTable('messages');
  //   getMessages();
  // }, [deletedMsg]);

  const deleteMessages = async (item) => {
    try {
      setSelectedMessage(item);
      // setModalVisible(true);
      markMessageAsRead(item._id); // Here's the call
      markMessageAsDeleted(item._id);
      setDeletedMsg(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const unreadCount = messages.filter(
      (message) => message.isRead === 0
    ).length;
    setMsg(unreadCount);

    // If there are no unread messages, you can update the component or perform any other actions here.
    if (unreadCount === 0) {
      // Update component or perform other actions
    }
  }, []);

  // const getMessages = async () => {
  //   try {
  //     const messages = await fetchMessages();
  //     setMessages(messages);
  //     setIsLoading(false);
  //     setErrorMessage('');
  //   } catch (error) {
  //     console.log(error);
  //     setIsLoading(false);
  //     setIsError(true);
  //     setErrorMessage('No messages found');
  //   }
  // };

  const renderRightActions = (item) => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: 'red',
          justifyContent: 'center',
          paddingHorizontal: 20,
        }}
        onPress={() => {
          deleteMessages(item);
        }}>
        <Text style={{ color: 'white' }}>Delete</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView>
      <Header
        title={i18n.t('inbox')}
        showBackButton={true}
        showMenuButton={false}
      />
      {errorMessage && (
        <View>
          <Text>{errorMessage}</Text>
          <Button
            titleStyle={{ color: theme.colors.primary }}
            buttonStyle={{
              backgroundColor: theme.colors.secondary,
              width: 100,
            }}
            title="Try "
            onPress={() => getMessages()}
          />
        </View>
      )}
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={messages.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Swipeable renderRightActions={() => renderRightActions(item)}>
              <TouchableOpacity
                onPress={() => {
                  setSelectedMessage(item);
                  setModalVisible(true);
                  markMessageAsRead(item._id);
                }}
                style={{
                  padding: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: theme.colors.grey,
                  height: 100,
                  backgroundColor: item.isRead ? '#f5f5f5' : 'white', // Highlight if the message is read
                }}>
                <View
                  style={{
                    marginBottom: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  {!item.isRead && (
                    <Badge
                      color="primary"
                      value="new"
                      badgeStyle={{
                        position: 'absolute',
                        top: 0,
                        left: 0,

                        backgroundColor: 'green',
                      }}
                    />
                  )}
                  <Text
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      color: theme.colors.grey2,
                    }}>
                    {moment(item.createdAt).startOf('hour').fromNow()}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}>
                  <View
                    style={{
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}>
                    <Text>{item.title}</Text>

                    <Text>{item.sender}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}></View>
                </View>
              </TouchableOpacity>
            </Swipeable>
          )}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View
            style={{
              width: '90%',
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 10,
            }}>
            <View
              style={{
                flexDirection: userLanguage === 'fa' ? 'row-reverse' : 'row', // Change this line
                justifyContent: 'space-between',
                marginBottom: 10,
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.grey3,
              }}>
              <Icon
                color={theme.colors.grey2}
                style={{ position: '', top: 0, right: 0 }}
                name="close"
                onPress={() => setModalVisible(false)}
              />
              <Text
                style={{
                  textAlign: userLanguage === 'fa' ? 'right' : 'left', // Keep this line as is
                }}>
                {moment(selectedMessage?.createdAt).startOf('hour').fromNow()}{' '}
                {i18n.t('by')} {selectedMessage?.sender}
              </Text>
            </View>

            <Text
              style={{
                textAlign: 'center',
                marginBottom: 10,
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.grey0,
                fontWeight: 'bold',
              }}>
              {selectedMessage?.title}
            </Text>
            {/* <Image
              source={{ uri: selectedMessage?.image }}
              style={{ width: '100%', height: 200 }}
            /> */}

            <Text
              style={{
                textAlign: userLanguage === 'fa' ? 'right' : 'left', // Keep this line as is
              }}>
              {selectedMessage?.text}
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default MessageCenter;
