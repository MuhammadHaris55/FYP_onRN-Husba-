import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

const DetailsScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text color="Yellow">MESSAGE BOX for All Update </Text>
      <Button title="Go to home" onPress={() => navigation.navigate('Home')} />
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default DetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
