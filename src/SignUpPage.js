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
import axios from 'axios';

export default class SignUpPage extends React.Component {
  postUser = async (username, email, password, currentLocation) => {
    const url = 'https://project-bhilt.appspot.com/api';

    const end_location = {
      lat: 0,
      long: 0,
    };

    const {data} = await axios.post(`${url}/users`, {
      username: username,
      email: email,
      password: password,
      current_location: currentLocation,
      end_location: end_location,
    });
    return data;
  };

  state = {
    username: '',
    email: '',
    password: '',
    currentlocation: '53.4860211, -2.2397307',
  };

  signUp = () => {
    const {username, email, password, currentLocation} = this.state;

    this.postUser(username, email, password, currentLocation)
      .then(res => {
        Alert.alert('Account created');
        this.props.navigation.navigate('Homepage');
      })
      .catch(error => {
        Alert.alert('User already exist');
      });
  };

  render() {
    const {username, email, password, currentLocation} = this.state;

    return (
      <KeyboardAvoidingView behavior="padding" style={styles.wrapper}>
        <View style={styles.container}>
          <Text styles={styles.header} />

          <TextInput
            style={styles.TextInput}
            placeholder="username"
            onChangeText={username => this.setState({username})}
          />

          <TextInput
            style={styles.TextInput}
            placeholder="email"
            onChangeText={email => this.setState({email})}
          />

          <TextInput
            style={styles.TextInput}
            placeholder="password"
            onChangeText={password => this.setState({password})}
          />

          <Button
            style={styles.button}
            title="Create Account"
            onPress={() =>
              this.signUp(username, email, password, currentLocation)
            }></Button>

          {/* <Button
            style={styles.btn}
            title="Log in"
            onPress={() => this.props.navigation.navigate('Home')}></Button> */}
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
    backgroundColor: '#A4A4A4',
  },

  button: {
    alignSelf: 'stretch',
    // border: '1px',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: '#A4A4A4',
  },
});
