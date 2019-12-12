/* eslint-disable react/self-closing-comp */
import React from 'react';

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  AsyncStorage,
  Button,
  Alert,
  ImageBackground,
} from 'react-native';
import getUser from './Api.js';
import {declaredPredicate} from '@babel/types';

export default class Login extends React.Component {
  state = {
    username: '',
    password: '',
  };

  //sends user/password to api function and then goes to homepage

  render() {
    const {username, password} = this.state;
    return (
      <ImageBackground
        source={require('../assets/pics/running.jpeg')}
        style={styles.imgBackground}
        resizeMode="cover"
        imageStyle={{opacity: 0.2}}>
        <View style={styles.container}>
          {/* <Text style={styles.header} /> */}

          <TextInput
            style={styles.TextInput}
            placeholder="username"
            placeholderTextColor="white"
            onChangeText={username => this.setState({username})}
          />

          <TextInput
            style={styles.TextInput}
            placeholder="password"
            placeholderTextColor="white"
            onChangeText={password => this.setState({password})}
          />
          <View style={styles.loginButton}>
            <TouchableOpacity
              style={styles.button}
              color="#11A0E2"
              title="Log in"
              onPress={() => {
                const {username, password} = this.state;

                getUser(username, password)
                  .then(res => {
                    console.log(res);

                    if (res) {
                      return this.props.navigation.navigate('HomePage', {
                        username: username,
                        password: password,
                      });
                    } else {
                      Alert.alert('Username not found.Please sign up');
                    }
                  })
                  .catch(err => {
                    Alert.alert(err);
                  });
              }}>
              <Text style={styles.textbutton}>Sign in</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.loginButton}>
            <TouchableOpacity
              style={styles.button}
              title="Sign Up"
              color="#11A0E2"
              onPress={() => this.props.navigation.navigate('Home')}>
              <Text style={styles.textbutton}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  }
}
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 40,
    paddingRight: 40,
    // backgroundColor: '#DFE8FF',
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 60,
  },
  TextInput: {
    marginBottom: 20,
    padding: 20,
    alignSelf: 'stretch',
    color: 'white',
    backgroundColor: '#A4A4A4',
    opacity: 0.8,
    borderColor: 'blue',
    borderWidth: 1,
    height: 55,
    width: 300,
    borderRadius: 7,
  },

  loginButton: {
    // alignSelf: 'stretch',
    padding: 10,
    color: 'white',
  },
  singinButton: {padding: 10},
  imgBackground: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  button: {
    width: 100,
    height: 60,
    backgroundColor: '#11A0E2',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    shadowColor: 'white',
    shadowOffset: {
      width: 20,
      height: 20,
    },
    shadowOpacity: 1,
    shadowRadius: 50,
    elevation: 20,
  },
  textbutton: {
    color: 'white',
    fontWeight: 'bold',
  },
});
