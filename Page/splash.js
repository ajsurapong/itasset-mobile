import React, { Component } from 'react'
import { Text, StyleSheet, View, ImageBackground, Image, Dimensions } from 'react-native'
// import { CirclesLoader } from 'react-native-indicator'
import AsyncStorage from '@react-native-community/async-storage';
import { StackActions } from '@react-navigation/native';

const loginAction = StackActions.replace('Login');
const homeAction = StackActions.replace('Home');

export default class splash extends Component {
    // constructor() {
    //     super();
    //     this.state = {
    //         isLoad: false
    //     }
    // }

    check_data = async () => {
        let data = await AsyncStorage.getItem('dataUser');
        // this.setState({ isLoad: true })
        if (data == null) {
            // this.setState({ isLoad: false })
            // this.props.navigation.navigate('Login');
            this.props.navigation.dispatch(loginAction);
        } else {
            // this.setState({ isLoad: false });
            // this.props.navigation.navigate('Home');
            this.props.navigation.dispatch(homeAction);
        }
    }

    componentDidMount() {
        this.check_data();
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: '20%' }}>
                    <View style={{ justifyContent: 'center' }}>
                        <Image source={require('../assets/img/main.jpg')} />
                    </View>

                    <View style={{ width: '50%', alignItems: 'center', justifyContent: 'center', }}>
                        <Image source={require('../assets/img/ITASSET.png')}
                            style={{
                                height: Dimensions.get('window').height / 4,
                                marginTop: '-20%',
                                marginRight: '6%',
                                width: '90%',
                            }} />
                        <Text style={{ color: 'black' }}>กรุณารอสักครู่ ...</Text>
                    </View>
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
})
