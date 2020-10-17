import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Image, Dimensions, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { StackActions } from '@react-navigation/native';
import { Icon, Overlay } from 'react-native-elements'
import { GoogleSignin } from '@react-native-community/google-signin';
// import { instance as axios, url } from './axios'

const resetAction = StackActions.replace('Login');

export default class loading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      pathImage: 'mm',
      Name: '555'
    };
  }

  getData = async () => {
    let data = JSON.parse(await AsyncStorage.getItem('dataUser'));
    this.setState({ Name: data.Name, pathImage: data.Photo })
  }

  UNSAFE_componentWillMount() {
    this.getData();
  }

  componentDidMount() {
    // this is required for Signout
    GoogleSignin.configure({
    });
  }

  clearAndLogout = async () => {
    try {
      // signout of Google
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      // delete user data
      await AsyncStorage.removeItem('dataUser');
      //jump to 'Login' page
      this.props.navigation.dispatch(resetAction);
    } catch (error) {
      console.log(error);
    }
  }

  signOut = async () => {
    Alert.alert(
      //title
      'ท่านต้องการออกจากระบบใช่หรือไม่',
      //body
      '',
      //choices
      [
        { text: 'ยกเลิก', onPress: () => console.log('No button clicked'), style: 'AllItem' },
        {
          text: 'ตกลง', onPress: () => {
            // this.setState({ loading: true }); 
            this.clearAndLogout();
          },
        },
      ],
      {
        cancelable: true
      }
      //clicking out side of alert will not cancel
    );
  };

  render() {
    return (

      <View style={styles.container}>

        <View style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height / 8, backgroundColor: '#ffffff', alignItems: 'flex-start', justifyContent: 'center', }}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Home')} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name='chevron-left' type='FontAwesome5' color='black' size={50} />
          </TouchableOpacity>
        </View>
        <View style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height / 11 }}>

        </View>

        <View style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height, alignItems: 'center', backgroundColor: '#ffffff', }}>
          <Image style={{ width: Dimensions.get('window').width / 2.1, height: Dimensions.get('window').height / 4.2, borderRadius: 100, overflow: 'hidden', }}
            source={{ uri: this.state.pathImage }} />
          <Text style={{ fontSize: 30, height: Dimensions.get('window').height / 17, justifyContent: 'center', marginTop: '8%' }}>{this.state.Name}</Text>
          <TouchableOpacity

            onPress={this.signOut}>
            <Image
              style={{ width: 400, height: 200 }}
              source={require('../assets/img/log.png')}

            />
          </TouchableOpacity>
        </View>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ffffff',

  },
  font: {
    fontSize: 25,
  }
})