import { Avatar, Text } from '@rneui/themed';
import { Dimensions, View } from 'react-native';
import { IconMedal } from '../../marketplace/filters/icons';

const TopUsers = ({ users, theme }) => {
  const [firstUser, secondUser, thirdUser, ...restUsers] = users;

  console.log(users);

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        marginBottom: 20,
        marginHorizontal: 10,
        height: Dimensions.get('window').height / 3.5,
      }}>
      <View
        style={{
          position: 'absolute',
          zIndex: 99, // Adjust zIndex for proper stacking
          right: '75%',
          marginRight: -10,
        }}>
        <View
          style={{
            position: 'absolute',
            zIndex: 100,
            top: 40,
            bottom: 10,
            left: '50%',
            marginLeft: -20,
          }}>
          <Avatar
            avatarStyle={{
              borderWidth: 2,
              borderColor: theme.colors.background,
            }}
            size={50}
            rounded
            source={{ uri: secondUser?.image }}
          />
        </View>
        <View
          style={{
            width: Dimensions.get('window').width / 5,
            height: Dimensions.get('window').height / 6.5,
            top: 100,
            backgroundColor: theme.colors.background,
            borderRadius: 16,
            borderColor: theme.colors.border,
            alignItems: 'center',
          }}>
          <View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: '500',
                color: theme.colors.text,
                marginTop: 20,
              }}>
              2nd
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              position: 'absolute',
              alignContent: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              top: 50,
              backgroundColor: theme.colors.secondBackground,
              borderColor: theme.colors.border,
              borderRadius: 10,
              width: Dimensions.get('window').width / 4,
              height: Dimensions.get('window').height / 20,
            }}>
            <IconMedal size={20} color={theme.colors.gold} />
            <Text
              style={{
                fontSize: 20,
                fontWeight: '500',
                color: theme.colors.gold,
              }}>
              {secondUser?.point}
            </Text>
          </View>
        </View>
      </View>
      {/* Third user on the left */}

      <View
        style={{
          position: 'absolute',
          zIndex: 98, // Adjust zIndex for proper stacking
          left: '75%',
          marginRight: -70,
        }}>
        <View
          style={{
            position: 'absolute',
            zIndex: 100,
            top: 50,
            bottom: 10,
            right: '15%',
            marginLeft: -70,
          }}>
          <Avatar
            avatarStyle={{
              borderWidth: 2,
              borderColor: theme.colors.background,
            }}
            size={50}
            rounded
            source={{ uri: secondUser?.image }}
          />
        </View>
        <View
          style={{
            width: Dimensions.get('window').width / 5,
            height: Dimensions.get('window').height / 7.1,
            top: 110,
            backgroundColor: theme.colors.background,
            borderRadius: 16,
            borderColor: theme.colors.border,
            alignItems: 'center',
          }}>
          <View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: '500',
                color: theme.colors.text,
                marginTop: 20,
              }}>
              3rd
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              position: 'absolute',
              alignContent: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              top: 50,
              backgroundColor: theme.colors.secondBackground,
              borderColor: theme.colors.border,
              borderRadius: 10,
              width: Dimensions.get('window').width / 4,
              height: Dimensions.get('window').height / 20,
            }}>
            <IconMedal size={20} color={theme.colors.gold} />
            <Text
              style={{
                fontSize: 20,
                fontWeight: '500',
                color: theme.colors.gold,
              }}>
              {thirdUser?.point}
            </Text>
          </View>
        </View>
      </View>
      {/* First user in the center */}
      <View
        style={{
          position: 'absolute',
          zIndex: 100, // Adjust zIndex for proper stacking
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          // left: '50%',
          //marginHorizontal: -40,
        }}>
        <View
          style={{
            position: 'absolute',
            zIndex: 100,
            top: 0,
            bottom: 10,
            left: '50%',
            marginLeft: -23,
          }}>
          <Avatar
            avatarStyle={{
              borderWidth: 3,
              borderColor: theme.colors.gold,
            }}
            size={50}
            rounded
            source={{ uri: secondUser?.image }}
          />
        </View>
        <View
          style={{
            position: 'absolute',
            left: '40%',
            top: 60,
            width: Dimensions.get('window').width / 5,
            height: Dimensions.get('window').height / 5,
            backgroundColor: theme.colors.background,
            borderRadius: 16,
            borderColor: theme.colors.border,
            alignItems: 'center',
          }}>
          <View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: '500',
                color: theme.colors.text,
                marginTop: 20,
              }}>
              1st
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              position: 'absolute',
              alignContent: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              top: 70,
              backgroundColor: theme.colors.secondBackground,
              borderColor: theme.colors.border,
              borderRadius: 10,
              width: Dimensions.get('window').width / 4,
              height: Dimensions.get('window').height / 20,
            }}>
            <IconMedal size={20} color={theme.colors.gold} />
            <Text
              style={{
                fontSize: 20,
                fontWeight: '700',
                color: theme.colors.gold,
              }}>
              {firstUser?.point}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default TopUsers;
