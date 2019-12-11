import React, {Component} from 'react';
import {StyleSheet, Text, View, Button, TextInput} from 'react-native';
import NavBar, {
  NavGroup,
  NavButton,
  NavButtonText,
  NavTitle,
} from 'react-native-nav';
import styles from 'react-native-nav/styles';
import Homepage from './homepage';
import EndPointMap from './endpointmap';

export default class Navbar extends Component {
  render() {
    return (
      <NavBar>
        <NavTitle style={styles.title}>{'Saviar'}</NavTitle>
        <NavGroup>
          <NavButton onPress={() => <Homepage />}>
            <NavButtonText>{'MyAccount'}</NavButtonText>
          </NavButton>
          <NavButton onPress={() => <Homepage />}>
            <NavButtonText>{'Home'}</NavButtonText>
          </NavButton>
          <NavButton onPress={() => <EndPointMap />}>
            <NavButtonText>{'Route'}</NavButtonText>
          </NavButton>
        </NavGroup>
      </NavBar>
    );
  }
}

const style = StyleSheet.create({
  title: {
    fontSize: 2,
  },
});
