import React, {Component} from 'react';
import {StyleSheet, Text, View, Button, TextInput, Image} from 'react-native';
// import ProfilePics from './profilepics';

import 'react-native-gesture-handler';

export default class MyAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      user: {},
      username: '',
      email: '',
      newuser: '',
      updateUser: false,
      newpassword: '',
      updatePassword: false,
      profilePic: require('../pics/blonde.jpeg'),
    };
  }

  componentDidMount() {
    return fetch('https://project-bhilt.appspot.com/api/users')
      .then(response => response.json())
      .then(responseJson => {
        const singleUser = responseJson.users.filter(user => {
          return user.username == 'ben'; //need to come from Login props
        });
        this.setState({
          isLoading: false,
          user: singleUser,
          username: singleUser[0].username,
          email: singleUser[0].email,
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  updateUsername = () => {
    const {newuser} = this.state;
    fetch('https://project-bhilt.appspot.com/api/users', {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: newuser,
      }),
    }).catch(error => {
      console.log(error);
    });
  };

  updatePassword = () => {
    const {newpassword} = this.state;
    fetch('https://project-bhilt.appspot.com/api/users', {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: newpassword,
      }),
    }).catch(error => {
      console.log(error);
    });
  };

  updatePic = pic => {
    const {profilePic} = this.state;
    this.setState({profilepic: pic});
  };

  render() {
    const {updateUser, username, updatePassword} = this.state;
    const pic = require('../assets/picsblonde.jpeg');
    return (
      <View>
        <View
          style={{
            flex: 0,
            flexDirection: 'column',
            alignContent: 'center',
            alignItems: 'stretch',
          }}>
          <View style={styles.header}>
            <Text style={styles.boldText}> Saviar</Text>
          </View>
        </View>
        <View
          style={{
            flex: 2,
            flexDirection: 'column',
            alignContent: 'center',
          }}>
          <View style={styles.user}>
            <Image source={pic} style={{width: 150, height: 150}} />
            <Text style={styles.welcomeuser}>
              Hi {username.toUpperCase()}.{'\n'} What would you plike to do
              today?
            </Text>
          </View>
          <View style={styles.usernameButton}>
            <Button
              title="Change username"
              onPress={() => {
                updateUser
                  ? this.setState({updateUser: false})
                  : this.setState({updateUser: true});
              }}
            />
            {updateUser ? (
              <View>
                <Text>New username</Text>
                <TextInput
                  style={styles.input}
                  placeholder="new username"
                  onChangeText={newuser => this.setState({newuser: newuser})}
                />
                <Button title="Update" onPress={this.updateUsername} />
              </View>
            ) : null}
          </View>
          <View style={styles.passwordButton}>
            <Button
              title="Update password"
              onPress={() => {
                updatePassword
                  ? this.setState({updatePassword: false})
                  : this.setState({updatePassword: true});
              }}
            />
            {updatePassword ? (
              <View>
                <Text>New password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="new password"
                  onChangeText={newuser => this.setState({newuser: newuser})}
                />
                <Button title="Update" onPress={this.updateUsername} />
              </View>
            ) : null}
          </View>
          {/* <View style={styles.profilepic}>
            <Button
              title="Update profile picture"
              onPress={() => this.props.navigation.navigate("ProfilePics")}
              //<ProfilePics updatePic={this.updatePic}
            />
          </View>
          
          can add pics component but need to add navigation
          
          */}
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  header: {
    alignSelf: 'center',
    width: 200,
    height: 50,
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 30,
    color: '#24416b',
    paddingTop: 20,
    paddingBottom: 20,
  },
  user: {
    alignSelf: 'center',
    padding: 10,
  },
  welcomeuser: {
    padding: 20,
    fontSize: 15,
    color: '#24416b',
  },
  loading: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 100,
    fontSize: 40,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#777',
    padding: 8,
    margin: 10,
    width: 200,
  },
  usernameButton: {
    paddingLeft: 110,
    paddingRight: 110,
    paddingBottom: 10,
  },
  passwordButton: {
    paddingTop: 20,
    paddingLeft: 110,
    paddingRight: 110,
    paddingBottom: 40,
  },
  profilepic: {
    paddingTop: 20,
    paddingLeft: 110,
    paddingRight: 110,
    paddingBottom: 40,
  },
});
