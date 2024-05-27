import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { sendInitialReq } from '../../../api/sendFoodQuery';
import { Button } from '@rneui/base';
import { Iconclose } from '../../marketplace/filters/icons';
import { useTheme } from '@rneui/themed';

function FoodTextInput({
  setFoodItems,
  setStatus,
  userInput,
  setUserInput,
  setInputStatus,
}) {
  const { theme } = useTheme();
  const handleInput = async (e) => {
    setStatus('loading');
    const res = await sendInitialReq(e);
    if (res) {
      setFoodItems(res.foodItems);
      setStatus('initialReqSent');
    }
  };

  return (
    <View style={styles.footerContainer}>
      <Pressable
        onPress={() => setInputStatus('idle')}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          margin: 0,
          zIndex: 1000,
          padding: 4,
        }}>
        <Iconclose size={30} color={theme.colors.grey2} />
      </Pressable>
      <TextInput
        multiline={true}
        numberOfLines={4}
        onChangeText={setUserInput}
        style={styles.verticallySpaced}
        placeholder="Enter your food"
      />
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          top: 10,
        }}>
        <Button
          buttonStyle={{
            padding: 10,
            width: '95%',
            height: 40,
            backgroundColor: '#5B5891',
            borderRadius: 5,
            marginHorizontal: 10,
            marginBottom: 10,
          }}
          onPress={() => handleInput(userInput)}
          title="Ask for Nutrition"
        />
      </View>
    </View>
  );
}

export default FoodTextInput;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  footerContainer: {
    padding: 20,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 10,
    borderWidth: 0.3,
    borderColor: 'grey',
  },
  verticallySpaced: {
    marginVertical: 10,
    borderWidth: 0.3,
    marginHorizontal: 10,
    top: 10,
    height: 40,
    borderRadius: 5,
    padding: 10,
    width: '95%',
    height: 100,
    textAlignVertical: 'top',
  },
  mt20: {
    marginTop: 20,
  },
});
