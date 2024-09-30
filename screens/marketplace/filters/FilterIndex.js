import { BottomSheet, Button, useTheme } from '@rneui/themed';
import React, { useContext, useEffect } from 'react';
import Filters from '../Filters';
import { Dimensions, View } from 'react-native';
import { targget, level, days, duration, location } from '../data/data';
import { IconWeight, IconClock, IconLevel, IconTimer } from './icons';
import { useState } from 'react';
import Header from '../../../components/header';
import LanguageContext from '../../../api/langcontext';
import i18nt from '../../../locales';
import { I18n } from 'i18n-js';

function FilterIndex({ setSelectedFilter, showFilter, setShowFilter }) {
  const { theme } = useTheme();
  const [listOfFilters, setListOfFilters] = useState([]);
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;

  useEffect(() => {
    setSelectedFilter(listOfFilters);
  }, [listOfFilters]);
  return (
    <BottomSheet isVisible={showFilter}>
      <View
        style={{
          // flexDirection: 'row',
          height: Dimensions.get('window').height,
          marginBottom: 10,
          paddingTop: 40,

          padding: 10,
          backgroundColor: theme.colors.background,
        }}>
        <Header title="Filters" rightIconPress={() => setShowFilter(false)} />

        <Filters
          data={targget}
          name="Target"
          icon={<IconWeight />}
          numColumns={3}
          setListOffilters={(filter) =>
            setListOfFilters((prevState) => ({ ...prevState, filter }))
          }
        />

        <Filters
          data={level}
          name={i18n.t('level')}
          icon={<IconLevel />}
          numColumns={3}
          setListOffilters={(filter) =>
            setListOfFilters((prevState) => ({ ...prevState, filter }))
          }
        />
        <Filters
          data={duration}
          name={i18n.t('duration')}
          icon={<IconTimer />}
          numColumns={3}
          setListOffilters={(filter) =>
            setListOfFilters((prevState) => ({
              ...prevState,
              filter,
            }))
          }
        />
        <Filters
          data={location}
          name={i18n.t('location')}
          icon={<IconWeight />}
          numColumns={3}
          setListOffilters={(filter) =>
            setListOfFilters((prevState) => ({
              ...prevState,
              filter,
            }))
          }
        />

        <Filters
          data={days}
          name="Days"
          icon={<IconClock />}
          numColumns={3}
          setListOffilters={(filter) =>
            setListOfFilters((prevState) => ({ ...prevState, filter }))
          }
        />

        {/* <Filters
          data={status}
          name="Status"
          icon={<IconStatue />}
          numColumns={3}
          setListOffilters={(filter) =>
            setListOfFilters((prevState) => ({ ...prevState, Days: filter }))
          }
        /> */}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: theme.colors.background,
          }}>
          <Button
            type="outline"
            buttonStyle={{
              marginTop: 20,
              borderRadius: 8,
              backgroundColor: theme.colors.searchBackground,
              width: Dimensions.get('window').width / 2 - 20,
            }}
            titleStyle={{ color: theme.colors.secondary }}
            onPress={() => setShowFilter(false)}
            title={i18n.t('cancel')}
          />
          <Button
            type="outline"
            buttonStyle={{
              marginTop: 20,
              borderRadius: 8,
              backgroundColor: theme.colors.button,
              width: Dimensions.get('window').width / 2 - 20,
            }}
            onPress={() => setShowFilter(false)}
            title={i18n.t('done')}
          />
        </View>
      </View>
    </BottomSheet>
  );
}

export default FilterIndex;
