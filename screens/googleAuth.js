import React from 'react';
import { View, Button } from 'react-native';
import * as Google from 'expo-auth-session';

export default function HandleGoogleLogin() {
  const clientId =
    '966970614767-m0h6ukurv67vu2vr3j4mdtvoaelihb07.apps.googleusercontent.com'; // Replace with your Google Client ID

  const handleGoogleLogin = async () => {
    try {
      const { type, accessToken, user } = await Google.logInAsync({
        clientId,
      });

      if (type === 'success') {
        // Handle successful login here
        console.log('Access Token:', accessToken);
        console.log('User Info:', user);
      } else {
        // Handle canceled login or error
        console.log('Login canceled or failed.');
      }
    } catch (error) {
      console.log('Error:', error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Login with Google" onPress={handleGoogleLogin} />
    </View>
  );
}
