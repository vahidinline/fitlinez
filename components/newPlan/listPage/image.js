import React, { useState } from 'react';
import { View, Button, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'react-native-expo-image-cache';

const ImageLoader = ({ uri, width, height, i18n }) => {
  const [imageLoaded, setImageLoaded] = useState(true);
  const [key, setKey] = useState(0); // Used to force re-render
  const [dimensions, setDimensions] = useState({ width: 200, height: 200 }); // Default dimensions

  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = () => setImageLoaded(false);
  const windowWidth = Dimensions.get('window').width / 1.4;
  const windowHeight = Dimensions.get('window').height / 1.3;
  const retryLoadingImage = () => {
    setImageLoaded(true);
    setKey((prevKey) => prevKey + 1); // Increment key to force re-render
  };

  const zoomIn = () => {
    setDimensions({
      width: Math.min(dimensions.width * 1.2, windowWidth * 2), // Limit the maximum width
      height: Math.min(dimensions.height * 1.2, windowHeight * 2), // Limit the maximum height
    });
  };

  const zoomOut = () => {
    setDimensions({
      width: Math.max(dimensions.width / 1.2, windowWidth / 2), // Limit the minimum width
      height: Math.max(dimensions.height / 1.2, windowHeight / 2), // Limit the minimum height
    });
  };

  return (
    <View style={styles.container}>
      {imageLoaded ? (
        // <Image
        //   key={key}
        //   source={{ uri: uri }}
        //   style={{ width: width, height: height }}
        //   onLoad={handleImageLoad}
        //   onError={handleImageError}
        // />
        <Image style={{ height: height, width: width }} {...{ uri }} />
      ) : (
        <Button title={i18n.t('Retry')} onPress={retryLoadingImage} />
      )}
      {/* <View style={styles.buttonsContainer}>
        <Button title="Zoom In" onPress={zoomIn} />
        <Button title="Zoom Out" onPress={zoomOut} />
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // other styles for container
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',

    // other styles for button container
  },
  image: {
    // styles moved to inline
  },
});

export default ImageLoader;
