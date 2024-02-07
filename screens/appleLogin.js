import * as AppleAuthentication from 'expo-apple-authentication';
import { View } from 'react-native';

const AppleLogin = () => {
  return (
    <View>
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={5}
        style={{
          width: 200, // You must specify a width
          height: 44, // You must specify a height
        }}
        onPress={async () => {
          try {
            const credential = await AppleAuthentication.signInAsync({
              requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL,
              ],
            });
            const cachedName: string = await Cache.getAppleLoginName(
              credential.user
            );
            const detailsArePopulated: boolean =
              !!credential.fullName.givenName && !!credential.email;
            if (!detailsArePopulated && !cachedName) {
              await login(credential.identityToken);
            } else if (!detailsArePopulated && cachedName) {
              await createAccount(
                cachedName,
                credential.user,
                credential.identityToken
              );
            } else {
              await createAccount(
                credential.fullName.givenName,
                credential.user,
                credential.identityToken
              );
            }
          } catch (e) {
            if (e.code === 'ERR_CANCELED') {
              // handle that the user canceled the sign-in flow
            } else {
              // handle other errors
            }
          }
        }}
      />
    </View>
  );
};

export default AppleLogin;
