import { ListItem } from '@rneui/themed';
import React from 'react';

function ProfileButton() {
  return (
    <ListItem
      title="Profile"
      titleStyle={{ color: '#5B5891' }}
      onPress={() => navigation.navigate('Profile')}
      left={(props) => <List.Icon {...props} icon="account" />}
    />
  );
}

export default ProfileButton;
