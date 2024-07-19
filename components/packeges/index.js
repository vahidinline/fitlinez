import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import {
  Dimensions,
  ImageBackground,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { Button, Icon, Text } from '@rneui/themed';
import * as SQLite from 'expo-sqlite';
import { ActivityIndicator, Colors } from '@rneui/themed';
// import Header from '../header';
import { I18n } from 'i18n-js';
import LanguageContext from '../../api/langcontext';
import i18nt from '../../locales';
import { useTheme } from '@rneui/themed';
import CategoryList from '../../screens/Home/categoryList';
import { SearchBar } from '@rneui/base';
import Header from '../header';
import api from '../../api/api';
const db = SQLite.openDatabase('packeges.db'); // Open or create the database

const Packages = () => {
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const { theme } = useTheme();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // Add this state
  const navigator = useNavigation();
  const onChangeSearch = (query) => setSearchQuery(query);

  const getPackages = async () => {
    setLoading(true);
    try {
      const result = await api
        .get('/newplan/prebuild')

        .then((res) => {
          setPackages(res.data);

          setLoading(false);
        });

      console.log('User data read successfully');
    } catch (error) {
      setError(true);
      console.log(error);
    }
  };
  const tableName = 'packeges';

  const removeTable = (tableName) => {
    try {
      db.transaction((tx) => {
        tx.executeSql(`DROP TABLE IF EXISTS ${tableName};`);
      });
      console.log(`Table "${tableName}" removed successfully`);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPackages();
    //removeTable(tableName);
    // readUserData();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.primary,
        marginBottom: Dimensions.get('window').height / 4,
      }}>
      <Header title="Packages" />
      {/* {loading && (
        <ActivityIndicator animating={true} color="#000" size="large" />
      )} */}
      {!loading && !error && (
        <View>
          <SearchBar
            containerStyle={{
              backgroundColor: theme.colors.primary,
              borderTopColor: theme.colors.primary,
              borderBottomColor: theme.colors.primary,
            }}
            inputStyle={{
              // backgroundColor: theme.colors.black,
              color: theme.colors.primary,
              borderRadius: 30,
              height: 50,
            }}
            inputContainerStyle={{
              // backgroundColor: theme.colors.black,
              color: theme.colors.secondary,
              borderRadius: 30,
              height: 50,
            }}
            round={true}
            showLoading={searchQuery.length > 0}
            placeholder="Search"
            onChangeText={onChangeSearch} // Update the searchQuery state when the user types
            value={searchQuery} // Display the current searchQuery
          />
          <ScrollView>
            {packages.map((item, index) => {
              return (
                <Pressable
                  key={index}
                  style={{
                    width: Dimensions.get('window').width - 20,

                    height: Dimensions.get('window').height / 5,
                    overflow: 'hidden',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    borderRadius: 20,
                    marginHorizontal: 16, // Add some margin to the right of each item
                    marginBottom: 10,
                    alignItems: 'center',
                  }}>
                  <ImageBackground
                    source={{ uri: item.image }} // Corrected this line
                    resizeMode="cover"
                    style={{
                      width: '100%',
                      height: 150,
                      justifyContent: 'center',
                      alignSelf: 'center',
                    }}>
                    {item?.premium && (
                      <Icon
                        name="shield-crown"
                        type="material-community"
                        color="#f1c40f"
                        size={30}
                        containerStyle={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                        }}
                      />
                    )}
                    <Text
                      style={{
                        fontSize: 25,
                        marginLeft: 20,
                        marginTop: 30,
                        color: '#fff',
                      }}>
                      {' '}
                      {item.name}
                    </Text>

                    <Button
                      buttonStyle={{ backgroundColor: '#ff8c00' }}
                      onPress={() => {
                        navigator.navigate('PackagePage', {
                          id: item.id,
                          item: item,
                          name: item.name,
                          description: item.description,
                          image: item.image,
                          exercises: item.exercises,
                        });
                      }}
                      style={{ width: 100, height: 50 }}>
                      Select
                    </Button>
                  </ImageBackground>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}
      {error && (
        <Text>
          An error occurred. Please restart the app and try again. If the
          problem persists, please contact support.
        </Text>
      )}
    </View>
  );
};

export default Packages;
