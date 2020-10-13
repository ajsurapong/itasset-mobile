import React, { Component } from 'react'
import { StyleSheet, Image, View, TouchableOpacity, Dimensions, Alert } from "react-native";
import { instance as axios } from './axios';
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import AsyncStorage from '@react-native-community/async-storage';
import { StackActions } from '@react-navigation/native';

const resetAction = StackActions.replace('Home');

export default class login extends Component {
    constructor() {
        super();
        this.state = {
            userInfo: '',
            // isSigninInProgress: false,
            loading: false
        }
    }
    componentDidMount() {
        GoogleSignin.configure({
            // for debug
            webClientId: '554076515162-scbjs4uqiunmf67ei13v77nuite6h0p8.apps.googleusercontent.com',
            // for release
            // webClientId: '775721000882-faarmt5b1efan6eb6cuok6blb9ejrl88.apps.googleusercontent.com',
            offlineAccess: true,
            hostedDomain: '',
            forceConsentPrompt: true,
        });
    }

    _forceLogout = async () => {
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            Alert.alert('ไม่พบผู้ใช้งาน', 'กรุณาติดต่อผู้ดูแลระบบเพื่อเพิ่มคุณ');
        }
        catch (error) {
            console.error(error);
        }
    }

    _signIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const info = await GoogleSignin.signIn();

            //check whether the Google user belongs to our system
            axios.post('/login', { email: info.user.email }).then(response => {
                if (response.data.length != 1) {
                    // force logout of Google to allow a new user at the next login
                    this._forceLogout();
                }
                else {
                    const yyyy = new Date().getFullYear() + 543;
                    const dataUser = {
                        working_year: response.data[0].Year,
                        email: response.data[0].Email_user,
                        user_role: response.data[0].Role,
                        Name: info.user.name,
                        Photo: info.user.photo
                    }

                    //if admin or super admin or committee of current year
                    if (dataUser.user_role == 1 || dataUser.user_role == 3 || dataUser.working_year === yyyy) {
                        // console.log("welcome");
                        //if this the first login, update username in DB server
                        if (response.data[0].Name == null) {
                            // console.log("try to update user's name");
                            axios.put('/keepusername', { email: info.user.email, name: info.user.name }).then(response2 => {
                                // save user data for other pages
                                AsyncStorage.setItem('dataUser', JSON.stringify(dataUser), (err) => {
                                    if (err) {
                                        console.log("Cannot save data to device " + err);
                                    }
                                    else {
                                        // jump to 'home'
                                        this.props.navigation.dispatch(resetAction);
                                    }
                                });
                            }).catch((error) => {
                                console.log(error);
                            });
                        }
                        else {
                            //user has ever logged in before
                            // save user data for other pages
                            AsyncStorage.setItem('dataUser', JSON.stringify(dataUser), (err) => {
                                if (err) {
                                    console.log("Cannot save data to device " + err);
                                }
                                else {
                                    // jump to 'home'
                                    this.props.navigation.dispatch(resetAction);
                                }
                            });
                        }
                    }
                    else {
                        Alert.alert('คุณไม่มีสิทธิ์ใช้งานระบบ กรุณาติดต่อผู้ดูแลระบบ');
                    }
                }
            }).catch(error => {
                if (error.code === 'ECONNABORTED') {
                    console.log(error.code)
                    Alert.alert('การเชื่อมต่อมีปัญหา', 'กรุณาลองใหม่อีกครั้ง');
                }
                else {
                    Alert.alert('ไม่พบผู้ใช้งาน');
                }
            });

        } catch (error) {
            console.log(error);
            if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                Alert.alert('play services not available or outdated')
            }
        }
        // await GoogleSignin.revokeAccess();
        // await GoogleSignin.signOut();
    };

    render() {
        return (
            <View style={styles.container}>

                <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: Dimensions.get('window').height / 9 }}>
                    <View style={{ justifyContent: 'center' }}>
                        <Image source={require('../assets/img/main.jpg')} />
                    </View>

                    <View style={{ width: Dimensions.get('window').width / 2, alignItems: 'center', justifyContent: 'center', marginTop: Dimensions.get('window').height / 18 * (-1) }}>
                        <Image source={require('../assets/img/ITASSET.png')}
                            style={{
                                height: Dimensions.get('window').height / 4,
                                marginRight: Dimensions.get('window').width / 15,
                                width: Dimensions.get('window').width / 2,
                            }} />
                    </View>

                </View>

                <View
                    style={{
                        width: Dimensions.get('window').width,
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        paddingHorizontal: '2%',
                        alignItems: 'flex-end',
                        height: Dimensions.get('window').height / 3,
                        marginTop: Dimensions.get('window').height / 10 * (-1)
                    }}>
                    <TouchableOpacity
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: 100,
                            height: 100,

                        }}
                        onPress={this._signIn}>
                        <Image
                            style={{ width: 250, height: 500 }}
                            source={require('../assets/img/LOGINBTN.png')}
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
        backgroundColor: 'white',

    },
    overlay: {
        width: Dimensions.get('window').width,
        zIndex: 99,
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        top: 0,
        paddingTop: '5%'
    },
    Textinput: {
        borderBottomColor: 'black',
        marginVertical: '2%',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 20,
        paddingLeft: '5%',

    },
    bodyTextInput: {
        width: '80%',
        height: '50%',
    },
    bottom: {
        paddingTop: '10%',
        height: '100%',
        alignItems: 'center',
    },
    btn: {
        backgroundColor: '#23395B',
        width: '35%',
        alignItems: 'center',
        height: '30%',
        justifyContent: 'space-around',
        borderRadius: 10,
        flexDirection: 'row'
    },
    indecator: {
        position: 'absolute',
        left: 0,
        marginLeft: 10
    }

})
