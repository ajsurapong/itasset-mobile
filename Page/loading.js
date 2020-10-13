import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native'
import { TextLoader, LinesLoader } from 'react-native-indicator';


export default class loading extends Component {
    constructor() {
        super();
    }   

    render() {
        return (
            <View style={styles.container}>
                <View>
                    <LinesLoader betweenSpace={5} barHeight={100} barNumber={6} color={'black'} />
                </View>
                <View style={{ marginTop: 20 }}>
                    <TextLoader text="Loading" textStyle={styles.font} />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9EEE8',

    },
    font: {
        fontSize: 25,
    }
})
