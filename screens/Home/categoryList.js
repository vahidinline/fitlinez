import { useNavigation } from '@react-navigation/native';
import { Badge, Button, Icon } from '@rneui/themed';
import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  FlatList,
  StyleSheet,
  Dimensions,
  Pressable,
} from 'react-native';

const CategoryList = ({ data, view, sort, searchQuery }) => {
  // console.log('sort', sort);
  const [filterSet, setFilterSet] = React.useState([]);
  // console.log('filterSet', filterSet);

  React.useEffect(() => {
    switch (sort) {
      case 0:
        setFilterSet('Beginner');
        break;
      case 1:
        setFilterSet('Intermediate');
        break;
      case 2:
        setFilterSet('Advanced');
        break;
      default:
        setFilterSet(null);
        break;
    }
  }, [sort]);

  const sortedByDate = [...data].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const sortedData = filterSet
    ? sortedByDate.filter((item) => item.tags === filterSet)
    : sortedByDate;

  const filteredBySearch = sortedData.filter((item) => {
    if (!searchQuery) return true; // If searchQuery is not defined, don't filter out any items
    return (
      item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const finalData = sort
    ? filteredBySearch.filter((item) => item.tags === filterSet)
    : filteredBySearch;

  const navigator = useNavigation();
  if (finalData) {
    return (
      <FlatList
        data={finalData}
        horizontal={view}
        keyExtractor={(item) => item._id}
        // contentContainerStyle={{ paddingRight: 50 }} // Add some padding to the right
        renderItem={({ item }) => (
          <Pressable
            style={{
              width: Dimensions.get('window').width - 50,

              height: Dimensions.get('window').height / 6,
              overflow: 'hidden',
              justifyContent: 'center',
              alignSelf: 'center',
              borderRadius: 20,
              marginRight: 16, // Add some margin to the right of each item
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
              <Text style={styles.title}> {item.name}</Text>

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
                    premium: item?.premium,
                  });
                }}
                style={{ width: 100, height: 50 }}>
                Select
              </Button>
            </ImageBackground>
          </Pressable>
        )}
      />
    );
  } else {
    return <Text>Loading...</Text>;
  }
};

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    marginLeft: 20,
    marginTop: 30,
    color: '#fff',
  },
});

export default CategoryList;
