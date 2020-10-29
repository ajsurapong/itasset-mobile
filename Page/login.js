import React, { Component } from 'react'
import { StyleSheet, Image, View, TouchableOpacity, Dimensions, Alert, TextInput, Button } from "react-native";
import { instance as axios } from './axios';
// import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import AsyncStorage from '@react-native-community/async-storage';
import { StackActions } from '@react-navigation/native';

const resetAction = StackActions.replace('Home');

export default class login extends Component {
    constructor() {
        super();
        this.state = {
            // userInfo: '',
            // isSigninInProgress: false,
            // loading: false
            username: ''
        }
    }

    saveUserAndGo = async (dataUser) => {
        try {
            //save and wait for finish
            await AsyncStorage.setItem("dataUser", JSON.stringify(dataUser));
            // jump to home page
            this.props.navigation.dispatch(resetAction);
        }
        catch(error) {
            console.log(error.message);
            Alert.alert("ไม่สามารถบันทึกผู้ใช้งานได้");
        }
    }

    _signIn = () => {
        //check whether the Google user belongs to our system
        const username = this.state.username.toLowerCase();
        if(username.length == 0) {
            Alert.alert("กรุณากรอกอีเมลเพื่อเข้าสู่ระบบ");
            return;
        }
        // console.log(username);

        axios.post('/login', { email: username }).then(response => {
            if (response.data.length != 1) {
                Alert.alert("คุณไม่มีสิทธิ์ใช้งานระบบ กรุณาติดต่อผู้ดูแลระบบ");
            }
            else {
                const yyyy = new Date().getFullYear() + 543;
                const dataUser = {
                    working_year: response.data[0].Year,
                    email: response.data[0].Email_user,
                    user_role: response.data[0].Role,
                    // Name: info.user.name,
                    // Photo: info.user.photo
                }

                //if admin or super admin or committee of current year
                if (dataUser.user_role == 1 || dataUser.user_role == 3 || dataUser.working_year === yyyy) {
                    this.saveUserAndGo(dataUser);
                    // console.log("welcome");
                    //if this the first login, update username in DB server
                    // if (response.data[0].Name == null) {
                    //     // console.log("try to update user's name");
                    //     axios.put('/keepusername', { email: info.user.email, name: info.user.name }).then(response2 => {
                    //         // save user data for other pages
                    //         AsyncStorage.setItem('dataUser', JSON.stringify(dataUser), (err) => {
                    //             if (err) {
                    //                 Alert.alert('ไม่สามารบันทึกข้อมูลลงในเครื่องของคุณได้');
                    //                 console.log("Cannot save data to device " + err);
                    //             }
                    //             else {
                    //                 // jump to 'home'
                    //                 this.props.navigation.dispatch(resetAction);
                    //             }
                    //         });
                    //     }).catch((error) => {
                    //         console.log(error);
                    //     });
                    // }
                    // else {
                    //     //user has ever logged in before
                    //     // save user data for other pages
                    //     AsyncStorage.setItem('dataUser', JSON.stringify(dataUser), (err) => {
                    //         if (err) {
                    //             Alert.alert('ไม่สามารบันทึกข้อมูลลงในเครื่องของคุณได้');
                    //             console.log("Cannot save data to device " + err);
                    //         }
                    //         else {
                    //             // jump to 'home'
                    //             this.props.navigation.dispatch(resetAction);
                    //         }
                    //     });
                    // }
                }
                else {
                    Alert.alert('คุณไม่มีสิทธิ์ใช้งานระบบ กรุณาติดต่อผู้ดูแลระบบ');
                }
            }
        }).catch(error => {
            if (error.code === 'ECONNABORTED') {
                console.log(error);
                Alert.alert('การเชื่อมต่อมีปัญหา', 'กรุณาลองใหม่อีกครั้ง');
            }
            else {
                console.log(error);
                Alert.alert('ไม่สามารถเชื่อมต่อกับเครือข่ายได้');
            }
        });
    };

    render() {
        return (
            // <View style={styles.container}>
            //     <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: Dimensions.get('window').height / 9 }}>
            //         <View style={{ justifyContent: 'center' }}>
            //             <Image source={require('../assets/img/main.jpg')} />
            //         </View>

            //         <View style={{ width: Dimensions.get('window').width / 2, alignItems: 'center', justifyContent: 'center', marginTop: Dimensions.get('window').height / 18 * (-1) }}>
            //             <Image source={require('../assets/img/ITASSET.png')}
            //                 style={{
            //                     height: Dimensions.get('window').height / 4,
            //                     marginRight: Dimensions.get('window').width / 15,
            //                     width: Dimensions.get('window').width / 2,
            //                 }} />
            //         </View>
            //     </View>

            //     <View
            //         style={{
            //             width: Dimensions.get('window').width,
            //             flexDirection: 'row',
            //             justifyContent: 'space-around',
            //             paddingHorizontal: '2%',
            //             alignItems: 'flex-end',
            //             height: Dimensions.get('window').height / 3,
            //             marginTop: Dimensions.get('window').height / 10 * (-1)
            //         }}>
            //         <TextInput style={{ width: '80%', backgroundColor: "#FFFAF0", padding: 5, marginTop: 5 }} placeholder="อีเมลผู้ใช้งาน" onChangeText={(text) => this.setState({ username: text })}/>
            //         <TouchableOpacity
            //             style={{
            //                 justifyContent: 'center',
            //                 alignItems: 'center',
            //                 width: 100,
            //                 height: 100,

            //             }}
            //             onPress={this._signIn}>
            //             <Image
            //                 style={{ width: 150, height: 300 }}
            //                 source={require('../assets/img/LOGINBTN.png')}
            //             />
            //         </TouchableOpacity>
            //     </View>
            // </View>

            <View style={{ flex: 1 }}>
                <View style={{ flex: 4 }}>
                    <Image source={require('../assets/img/main.jpg')} style={{ width: '100%' }} resizeMode="contain"/>
                </View>
                <Image source={require('../assets/img/itlogo.png')} style={{ width: 100, alignSelf: 'center' }} resizeMode="contain" />
                <View style={{ flex: 3, marginHorizontal: 16 }}>
                    <TextInput keyboardType="email-address" style={{ backgroundColor: "#FFFAF0", padding: 10, margin: 25, fontSize: 22, borderColor: 'lightblue', borderRadius: 16, borderWidth: 1 }} placeholder="อีเมลผู้ใช้งาน" onChangeText={(text) => this.setState({ username: text })} />
                    <Button title="เข้าสู่ระบบ" onPress={this._signIn} />
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
});