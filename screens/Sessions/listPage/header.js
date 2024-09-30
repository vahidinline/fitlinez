import { Icon, useTheme } from '@rneui/themed';
import React, { useState } from 'react';
import { Button, Text } from '@rneui/themed';
import SessionTimer from '../../timer/sessionTimer';
import { Dimensions, View } from 'react-native';
import useHealthData from '../../../api/userHealthData';

function HeaderListPage({
  stoptimer,
  setFinish,
  category,
  catTname,
  userLanguage,
  loc,
  i18n,
}) {
  console.log('header item title of plan', category);
  const { theme } = useTheme();

  return (
    <View
      style={{
        backgroundColor: theme.colors.primary,
        textAlign: 'auto',
        alignItems: 'center',
        flexDirection: 'row',
        height: 50,
        width: Dimensions.get('window').width,
        justifyContent: 'space-between',
        marginHorizontal: 10,
      }}>
      <View>
        <Text
          style={{
            fontSize: 15,

            fontWeight: 'bold',
            color: theme.colors.secondary,
          }}>
          {`${userLanguage === 'fa' ? catTname : category} at ${loc}`}
          {category}
        </Text>
      </View>

      {/* <Button onPress={() => navigation.goBack()} color={theme.colors.primary}>
        <Icon name="chevron-left" />
      </Button> */}
      <SessionTimer stoptimer={stoptimer} />

      <Button
        title={i18n.t('finishWorkout')}
        buttonStyle={{
          backgroundColor: theme.colors.secondary,
          color: theme.colors.primary,
          marginRight: 20,
          borderRadius: 10,
        }}
        titleStyle={{
          color: theme.colors.primary,
          fontSize: 15,
          fontWeight: 'bold',
        }}
        onPress={() => setFinish(true)}
      />
    </View>
  );
}

export default HeaderListPage;
