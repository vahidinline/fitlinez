import { useTheme } from '@rneui/themed';
import React, { useState } from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Text,
  Image,
} from 'react-native';
import { Divider } from '@rneui/base';
import convertToPersianNumbers from '../../../api/PersianNumber';

const screenWidth = Dimensions.get('window').width;

function DrawerList({
  sortedData,
  index,
  RTL,
  goToIndex,
  showList,
  setShowList,
}) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [status, setStatus] = useState('idle');

  const handlePress = (index) => {
    try {
      setShowList(!showList);
      goToIndex(index);
      setStatus('modal');
    } catch (error) {
      console.error('Error handling press:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <FlatList
          horizontal={false}
          scrollEnabled={true}
          style={{ marginTop: 10 }}
          data={sortedData}
          keyExtractor={(item) => {
            if (
              typeof item.exerciseId === 'object' &&
              item.exerciseId !== null
            ) {
              return item.exerciseId.toString();
            }
            return item.exerciseId;
          }}
          renderItem={({ item, index }) => (
            <MemoizedItem
              item={item}
              index={index}
              handlePress={handlePress}
              RTL={RTL}
              styles={styles}
            />
          )}
          initialNumToRender={5} // Only render 5 items initially
          maxToRenderPerBatch={5} // Reduce number of items rendered per batch
          windowSize={5} // Reduce number of items retained in memory
        />
      </View>
    </View>
  );
}

const MemoizedItem = React.memo(({ item, index, handlePress, RTL, styles }) => (
  <TouchableOpacity
    onLongPress={() => console.log(item.exerciseName)}
    onPress={() => handlePress(index)}>
    <View style={styles.listItem}>
      <View style={styles.textContainer}>
        <Text style={styles.index}>
          {convertToPersianNumbers(index + 1, RTL)}
        </Text>
        <Image
          source={{ uri: item.gifUrl }}
          style={styles.exerciseImage}
          resizeMode="contain"
        />
      </View>
    </View>
    <Divider />
  </TouchableOpacity>
));

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.white,
      position: 'absolute',
      borderRadius: 12,
      top: 19,
      width: Dimensions.get('window').width / 8,
      height: Dimensions.get('window').height / 3,
      zIndex: 1000,
      borderWidth: 1,
      borderColor: theme.colors.border,
      overflow: 'hidden',
    },
    index: {
      position: 'absolute',
      top: 0,
      right: 0,
      left: 35,
      opacity: 0.9,
      color: theme.colors.secondary,
      zIndex: 1000,
      fontSize: 14,
      fontFamily: 'Vazirmatn',
    },
    listItem: {
      flexDirection: 'row',
      marginBottom: 10,
      height: 45,
      borderRadius: 16,
      borderColor: theme.colors.border,
      overflow: 'hidden',
    },
    textContainer: {
      borderRadius: 4,
      width: '100%',
    },
    exerciseImage: {
      width: 45,
      height: 45,
      overflow: 'hidden',
    },
  });

export default React.memo(DrawerList);
