import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
const LogoTitle = props => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saviar</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    color: '#fff',
    fontSize: 30,
    fontFamily: 'Lobster-Regular',
    paddingLeft: 18,
    paddingTop: 10,
  },
  container: {
    color: '#fff',
  },
});

export default LogoTitle;
