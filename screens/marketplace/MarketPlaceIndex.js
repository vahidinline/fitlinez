import { useTheme } from '@rneui/themed';
import { SearchBar } from '@rneui/themed';
import React from 'react';
import { Dimensions, FlatList, TouchableOpacity, View } from 'react-native';
import { I18n } from 'i18n-js';
import { useEffect } from 'react';
import { useState } from 'react';
import LanguageContext from '../../api/langcontext';
import { useContext } from 'react';
import i18nt from '../../locales';
import ListItems from './ListIItems';
import TrainersList from './TrainersList';
import { useRef } from 'react';
import { Chip } from 'react-native-paper';
import FilterIndex from './filters/FilterIndex';
import { useNavigation } from '@react-navigation/native';
import { trainersList } from './data/data';
import { getPackages } from '../../api/GetData';
import { IconFilter, IconSearch } from './filters/icons';

function MarketPlaceIndex() {
  const [packages, setPackages] = useState([]);
  const { userLanguage } = useContext(LanguageContext);
  const packagesRef = useRef(null);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // Add this state
  const navigation = useNavigation();
  const onChangeSearch = (query) => setSearchQuery(query);
  const [filteredPackages, setFilteredPackages] = useState([]); // Add this state
  const removeFilteredItem = (itemKeyToRemove) => {
    setSelectedFilter(
      ({ [itemKeyToRemove]: _, ...remainingFilters }) => remainingFilters
    );
  };

  console.log('selectedFilter', selectedFilter);

  const applyFilters = (packages) => {
    return packages.filter((pack) => {
      return (
        pack.DaysPerWeek.toString() === selectedFilter.Days &&
        pack.duration.toString() === selectedFilter.Duration &&
        pack.level.toLowerCase() === selectedFilter.Level.toLowerCase() &&
        pack.target.toLowerCase() === selectedFilter.Target.toLowerCase()
      );
    });
  };

  useEffect(() => {
    setFilteredPackages(applyFilters(packages));
  }, [packages]);

  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;

  useEffect(() => {
    if (!packagesRef.current) {
      getPackages();
    }
  }, []);

  const { theme } = useTheme();

  const getPackagesData = async () => {
    const result = await getPackages();
    setPackages(result);
  };

  useEffect(() => {
    getPackagesData();
  }, []);

  const filterPackages = (packages, filter) => {
    return packages.filter((packages) => packages.location === 'both');
  };

  const filterPackagesByLevel = (packages, filter) => {
    return packages.filter((packages) => packages.level === filter);
  };
  const sections = [
    {
      title: 'Workouts',
      data: packages,
      renderItem: ({ item }) => (
        <ListItems packages={item} name={'Workouts'} navigation={navigation} />
      ),
    },
    {
      title: 'Gym & Home Workouts',
      data: packages,
      renderItem: ({ item }) => (
        <ListItems
          packages={item}
          name={'Gym & Home Workouts'}
          navigation={navigation}
        />
      ),
    },

    {
      title: 'Starter',
      data: packages,
      renderItem: ({ item }) => <ListItems packages={item} name={'Starter'} />,
    },
  ];

  useEffect(() => {
    if (searchQuery) {
      const filteredData = packages.filter((packages) =>
        packages.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPackages(filteredData);
    } else {
      setFilteredPackages(packages);
    }
  }, [searchQuery, packages]);

  return (
    <View
      style={{
        marginBottom: 100,
        backgroundColor: theme.colors.background,
        paddingTop: 100,
      }}>
      <View
        style={{
          flexDirection: 'row',
        }}>
        <SearchBar
          searchIcon={IconSearch}
          leftIconContainerStyle={{ color: theme.colors.secondary }}
          rightIconContainerStyle={{ color: theme.colors.secondary }}
          placeholderTextColor={theme.colors.secondary}
          containerStyle={{
            backgroundColor: theme.colors.searchBackground,
            borderTopColor: theme.colors.primary,
            borderBottomColor: theme.colors.primary,
            color: theme.colors.secondary,
            alignSelf: 'center',
            borderRadius: 20,
            width: Dimensions.get('window').width - 100,
            marginHorizontal: 10,
            justifyContent: 'flex-start',
          }}
          inputStyle={{
            color: theme.colors.primary,
            borderRadius: 30,
            height: 50,
          }}
          inputContainerStyle={{
            color: theme.colors.secondary,
            borderRadius: 30,
            height: 50,
          }}
          round={true}
          showLoading={searchQuery.length > 0}
          placeholder="Search"
          onChangeText={onChangeSearch}
          value={searchQuery}
        />
        <TouchableOpacity
          style={{
            marginHorizontal: 10,
            right: 10,
            borderRadius: 16,
            backgroundColor: theme.colors.searchBackground,
            height: 65,
            width: 65,
            padding: 10,
            alignContent: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => setShowFilter(!showFilter)}>
          <IconFilter />
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginHorizontal: 10,
          marginVertical: 10,
        }}>
        {Object.entries(selectedFilter).map(([key, value], index) => (
          <Chip
            key={index}
            style={{ margin: 5 }}
            icon="close"
            onPress={() => removeFilteredItem(key)}>
            {value}
          </Chip>
        ))}
      </View>
      {searchQuery ? (
        <FlatList
          data={filteredPackages}
          renderItem={({ item }) => (
            <ListItems
              packages={item}
              name={'Workouts'}
              navigation={navigation}
            />
          )}
        />
      ) : (
        <View>
          <FlatList
            sections={sections}
            ListHeaderComponent={() => (
              <View>
                <ListItems
                  packages={packages}
                  name={'Workouts'}
                  navigation={navigation}
                />
                <ListItems
                  packages={filterPackages(packages, true)}
                  name={'Gym & Home Workouts'}
                  navigation={navigation}
                />
                {/* <TrainersList name={'Trainers'} /> */}
                <ListItems
                  packages={filterPackagesByLevel(packages, 'Beginner')}
                  name={'Beginner'}
                  navigation={navigation}
                />
                <ListItems
                  packages={filterPackagesByLevel(packages, 'Intermediate')}
                  name={'Intermediate'}
                  navigation={navigation}
                />
              </View>
            )}
          />
        </View>
      )}
      <FilterIndex
        setSelectedFilter={setSelectedFilter}
        showFilter={showFilter}
        setShowFilter={setShowFilter}
      />
    </View>
  );
}

export default MarketPlaceIndex;
