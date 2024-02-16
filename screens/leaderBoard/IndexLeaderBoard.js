import { Text } from '@rneui/base';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import Header from '../../components/header';
import { useTheme } from '@rneui/themed';
import { IconMedal, IconPremium } from '../marketplace/filters/icons';
import TopUsers from './lists/TopUsers';
import ListItems from './lists/allList';
import api from '../../api/api';

function IndexLeaderBoard() {
  const [users, setUsers] = useState([]);
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const getTopUser = async () => {
    console.log('inside ');
    try {
      const res = await api.get('/leaderBoard');

      setUsers(res.data);
    } catch {
      console.log('no  result in leader board');
    }
  };

  useEffect(() => {
    getTopUser();
  }, []);

  const sortedUsers = users.sort((a, b) => a.rank - b.rank);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        height: Dimensions.get('window').height,
      }}>
      <Header title={'Top Users'} />

      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.button,
          height: Dimensions.get('window').height,
          marginBottom: 10,
        }}>
        <TopUsers users={users} theme={theme} />
        <View>
          <FlatList
            scrollEnabled={true}
            data={sortedUsers}
            renderItem={({ item, index }) => (
              <ListItems key={item._id} user={item} index={index} />
            )}
            keyExtractor={(item) => item._id}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    item: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 16,
      marginHorizontal: 10,
      backgroundColor: theme.colors.background,
      marginBottom: 10,
    },
    itemRight: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    itemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });

export default IndexLeaderBoard;
