import React, { useEffect } from 'react';
import { FlatList, SafeAreaView, View, StyleSheet } from 'react-native';
import Header from '../../components/header';
import { Text, useTheme } from '@rneui/themed';
import { useContext } from 'react';
import AuthContext from '../../api/context';
import { getPlanUsage } from '../../api/GetData';
import { useState } from 'react';
import moment from 'moment';

function PlanDetailsIndex() {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { userAuth } = useContext(AuthContext);
  const [planUsage, setPlanUsage] = useState([]);
  const userId = userAuth.id;
  const getData = async () => {
    getPlanUsage(userId).then((res) => {
      //console.log('getPlanUsage', res);//
      //sort the data by date
      let sorted = res.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
      setPlanUsage(sorted);
    });
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}>
      <Header title="Plan Details" />

      <FlatList
        ListEmptyComponent={
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>No Plan Assigned</Text>
          </View>
        }
        ListHeaderComponent={
          <View>
            <Text style={styles.headerText}>History of Workout Plans</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,

                //borderRadius: 10,
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.border,
                borderWidth: 1,
                padding: 10,
              }}>
              <Text style={styles.subText}>Plan Name</Text>
              <Text style={styles.subText}>Start Date</Text>
            </View>
          </View>
        }
        data={planUsage}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => {
          const itemStyle = [
            styles.itemContainer,
            index === 0 && styles.firstItem,
          ];
          const itemTextStyle = [
            styles.itemText,
            index === 0 && styles.firstItemText,
          ];
          const itemText =
            index === 0 ? `${item.name} (Current Plan)` : item.name;
          return (
            // highlight the last item

            <View style={itemStyle}>
              <Text style={itemTextStyle}>{itemText}</Text>
              <Text style={itemTextStyle}>
                {moment(item.date).format('DD-MM-YYYY')}
              </Text>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    itemContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 10,
      borderBottomWidth: 1,
    },
    headerText: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.secondary,
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
      marginTop: 20,
      marginHorizontal: 20,
      marginBottom: 20,
      textAlign: 'center',
    },
    firstItem: {
      backgroundColor: theme.colors.secondary,
    },
    text: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text,
    },
    firstItemText: {
      color: theme.colors.background,
      fontWeight: '700',
      fontSize: 14,
    },
    itemText: {
      fontSize: 14,
      color: theme.colors.text,
    },
    subText: {
      fontSize: 14,
      color: theme.colors.text,
    },
  });

export default PlanDetailsIndex;
