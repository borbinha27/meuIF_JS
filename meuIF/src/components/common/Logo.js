import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const Logo = () => {
  return (
    <View style={styles.container}>
      <Image 
        source={{
          uri: "https://storage.googleapis.com/flutterflow-io-6f20.appspot.com/projects/meu-i-f-a-p-k-ow9qhr/assets/mxgyrdn74iz2/INSTITUTO_FEDERAL.png"
        }}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  image: {
    width: 150,
    height: 100,
  },
});

export default Logo;