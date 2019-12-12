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
} from 'react-native';
import getUser from './Api.js';

export default class Login extends React.Component {
  state = {
    username: '',
    password: '',
  };

  //sends user/password to api function and then goes to homepage

  render() {
    const {username, password} = this.state;
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.wrapper}>
        <View style={styles.container}>
          {/* <Text style={styles.header} /> */}

          <TextInput
            style={styles.TextInput}
            placeholder="username"
            onChangeText={username => this.setState({username})}
          />

          <TextInput
            style={styles.TextInput}
            placeholder="password"
            onChangeText={password => this.setState({password})}
          />

          <Button
            style={styles.button}
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
            }}></Button>

          <Button
            style={styles.button}
            title="Sign Up"
            onPress={() => this.props.navigation.navigate('Home')}></Button>
        </View>
      </KeyboardAvoidingView>
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
    color: 'black',
    backgroundColor: '#A4A4A4',
  },

  Button: {
    alignSelf: 'stretch',
  },
});
