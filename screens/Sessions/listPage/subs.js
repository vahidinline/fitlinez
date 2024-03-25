import { BottomSheet, Button, Text, useTheme } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  TouchableOpacity,
  View,
} from 'react-native';
import { getSubWorkOutData } from '../../../api/GetData';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import i18nt from '../../../locales';
import LanguageContext from '../../../api/langcontext';
import { Image } from 'react-native-expo-image-cache';
import { useContext } from 'react';
import { I18n } from 'i18n-js';
import { ActivityIndicator } from 'react-native-paper';

function Subs({
  userId,
  exerciseId,
  bodyPart,
  loc,
  category,
  setVisible,
  visible,
  allExcerciesIds,
  type,
  title,
  mainTarget,
  otherTarget,
  target,
  userLocation,
  handleSubsitute,
}) {
  const [subList, setSubList] = useState([]);
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  const [status, setStatus] = useState('initial');
  i18n.locale = userLanguage;
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const styles = getStyles(theme); // Call the function inside the component
  const subListGetter = async () => {
    const subList = await getSubWorkOutData(
      userId,
      exerciseId,
      bodyPart,
      loc,
      category,
      allExcerciesIds,
      type,
      title,
      mainTarget,
      otherTarget,
      target,
      userLocation
    )
      .then((res) => {
        if (res.length === 0) {
          setStatus('empty');
        }
        setStatus('success');
        setSubList(res);
      })
      .catch((err) => {
        console.log('err', err);
      });
  };

  useEffect(() => {
    subListGetter();
  }, []);

  const handleSingleSelect = (exerciseId, item) => {
    //console.log('id', exerciseId, item._id);
    setSelectedItem(item);
    setSelected(true);
  };

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
      }}>
      <BottomSheet
        onBackdropPress={() => setVisible(false)}
        modalProps={{}}
        isVisible={visible}
        containerStyle={
          {
            //marginTop: 20,
            //height: Dimensions.get('window').height / 1.5,
          }
        }>
        <View
          style={{
            backgroundColor: theme.colors.background,
            paddingHorizontal: 10,
            borderRadius: 16,
            //marginVertical: 10,
            paddingVertical: 10,
          }}>
          <FlatList
            scrollEnabled={false}
            ListHeaderComponent={
              <View
                style={{
                  backgroundColor: theme.colors.background,
                  marginVertical: 10,
                  padding: 10,
                  borderRadius: 16,
                  borderColor: theme.colors.border,
                  //borderWidth: 1,
                }}>
                <Text style={styles.titleStyle}>{i18n.t('selectSubs')}</Text>
              </View>
            }
            ListEmptyComponent={
              <>
                {status === 'empty' && (
                  <View
                    style={{
                      backgroundColor: theme.colors.background,
                      marginVertical: 10,
                      padding: 10,
                      borderRadius: 8,
                      borderColor: theme.colors.border,
                      borderWidth: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      // height: Dimensions.get('window').height / 10,
                    }}>
                    <Text
                      style={{
                        color: theme.colors.warning,
                        textAlign: 'center',
                        alignItems: 'center',
                        // top: 10,
                      }}>
                      {i18n.t('noSubs')}
                    </Text>
                  </View>
                )}
                {status === 'initial' && (
                  <ActivityIndicator
                    size="large"
                    color={theme.colors.primary}
                  />
                )}
              </>
            }
            data={subList}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: theme.colors.background,
                  marginLeft: 10,
                  alignItems: 'center',
                  borderColor: theme.colors.border,
                  borderWidth: 1,
                  borderRadius: 8,
                  marginVertical: 5,
                  width: Dimensions.get('window').width / 1.1,
                }}>
                <TouchableOpacity
                  onPress={() => handleSingleSelect(exerciseId, l)}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor:
                      selected && selectedItem._id === item._id
                        ? theme.colors.primary
                        : theme.colors.border,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginHorizontal: 10,
                  }}>
                  {selected &&
                    selectedItem &&
                    selectedItem._id === item._id && (
                      <Icon
                        name="check"
                        size={20}
                        color={theme.colors.secondary}
                      />
                    )}
                </TouchableOpacity>
                <Text
                  numberOfLines={2}
                  flexShrink={1}
                  width={Dimensions.get('window').width / 1.5}
                  style={{
                    fontSize: 15,
                    fontWeight: '500',
                    color: theme.colors.secondary,
                    alignContent: 'center',
                  }}>
                  {item.name}
                </Text>

                <Image
                  {...{ uri: item.gifUrl }}
                  style={{
                    width: 60,
                    height: 60,
                    overflow: 'hidden',
                    borderRadius: 8,
                    borderWidth: 0,
                    borderStartWidth: 1,
                    borderColor: theme.colors.border,
                  }}
                />
              </View>
            )}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 5,
            }}>
            <Button
              onPress={() => setVisible(false)}
              title={i18n.t('cancel')}
              titleStyle={{
                color: theme.colors.secondary,
              }}
              buttonStyle={{
                marginHorizontal: 10,
                borderRadius: 12,
                width: Dimensions.get('window').width / 2.5,
                height: Dimensions.get('window').height / 20,
                backgroundColor: theme.colors.white,
                borderColor: theme.colors.border,
                borderWidth: 1,
                borderRadius: 12,
                marginBottom: 20,
              }}
            />
            <Button
              disabled={!selected}
              onPress={() => {
                handleSubsitute(exerciseId, selectedItem);
                setVisible(false);
              }}
              title={'Done'}
              titleStyle={{
                color: theme.colors.primary,
              }}
              buttonStyle={{
                marginHorizontal: 10,
                borderRadius: 12,
                borderColor: theme.colors.border,
                borderWidth: 1,

                width: Dimensions.get('window').width / 2.5,
                height: Dimensions.get('window').height / 20,
                backgroundColor: theme.colors.button,
                borderRadius: 12,
                marginBottom: 20,
                // color: theme.colors.primary,
              }}
            />
          </View>
        </View>
      </BottomSheet>
    </View>
  );
}
const getStyles = (theme) =>
  StyleSheet.create({
    titleStyle: {
      color: theme.colors.secondary,
      textAlign: 'center',
      alignItems: 'center',
      top: 10,
    },
  });

export default Subs;
