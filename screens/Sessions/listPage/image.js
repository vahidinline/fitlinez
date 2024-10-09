import { Image, useTheme } from '@rneui/themed';
import React, { useState } from 'react';
import { View, Button, StyleSheet, Dimensions, Text } from 'react-native';

const ImageLoader = ({ uri, width, height, i18n }) => {
  const [imageLoaded, setImageLoaded] = useState(true);
  const [key, setKey] = useState(0); // Used to force re-render
  const [dimensions, setDimensions] = useState({ width: 200, height: 200 }); // Default dimensions
  const { theme } = useTheme();

  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = () => setImageLoaded(false); // Ensure error callback sets imageLoaded to false

  const windowWidth = Dimensions.get('window').width / 1.4;
  const windowHeight = Dimensions.get('window').height / 1.3;

  const retryLoadingImage = () => {
    setKey((prevKey) => prevKey + 1); // Increment key to force re-render
    setImageLoaded(true); // Reset imageLoaded to true
  };

  return (
    <View style={styles.container}>
      {imageLoaded ? (
        <Image
          key={key} // Force re-render by using key
          style={{ height, width }}
          source={{ uri }}
          onLoad={handleImageLoad}
          onError={handleImageError} // Ensure error handler is triggered
        />
      ) : (
        <View>
          <Text style={{ color: theme.colors.text }}>
            {i18n.t('failedLoadImage')}
          </Text>
          <Button
            titleStyle={{
              color: theme.colors.text,
              fontSize: 14,
              fontFamily: 'Vazirmatn',
            }}
            title={i18n.t('Retry')}
            onPress={retryLoadingImage}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
});

export default ImageLoader;
