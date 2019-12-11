/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Map from './src/Map';
import Homepage from './src/Homepage';

class App extends Component {
  render() {
    return (
      <>
        {/* <Map /> */}
        <Homepage />
        {/* <Text>Hello</Text> */}
      </>
    );
  }
}

export default App;
