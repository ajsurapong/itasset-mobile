import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, PermissionsAndroid, Image, useWindowDimensions,Dimensions } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Icon } from 'react-native-elements'

export default class capture extends Component {
    constructor() {
        super();
        this.state = {
            image: '',
            type: RNCamera.Constants.Type.back
        }
    }
    checkAndroidPermission = async () => {
        try {
            const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
            await PermissionsAndroid.request(permission);
            Promise.resolve();
        } catch (error) {
            Promise.reject(error);
        }
    };

    takePicture = async () => {

        if (this.camera) {
            const options = {
                quality: 0.25,
                width: 1200,
                height: 1200,
            };
            const data = await this.camera.takePictureAsync(options);
            this.setState({ image: data.uri })
            this.props.navigation.navigate('Update', {
                image: data.uri
            });
        }
    };

    reverse = () => {
        if (this.state.type == RNCamera.Constants.Type.back) {
            this.setState({ type: RNCamera.Constants.Type.front })
        } else {
            this.setState({ type: RNCamera.Constants.Type.back })
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={{ width: '100%', height: '6%', backgroundColor: 'black', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Update')} style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon name='chevron-left' type='FontAwesome5' color='white' size={50} containerStyle={{ marginLeft: '-2%' }} />
                        <Text style={{ color: 'white', marginLeft: '-2%', fontSize: 20 }}>กลับ</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ width: '100%', height: '100%', backgroundColor: 'red' }}>
                    <RNCamera
                        ref={ref => {
                            this.camera = ref;
                        }}
                        style={styles.preview}
                        type={this.state.type}
                    />
                </View>
                <View style={{ flexDirection: 'row', paddingHorizontal: 5, justifyContent: 'center', alignItems: 'center', width: '100%', height: '10%', position: 'absolute', bottom: 0, backgroundColor: '#000000' }}>
                    
                    <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture}>
                        <View style={{ borderWidth: 2, width: '90%', height: '90%', borderRadius: 100 }}>
                        </View>
                    </TouchableOpacity>
                    
                </View>
            </View >
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'space-between'
    },
    preview: {
        width: '100%',
        height: '100%'

    },
    capture: {
        width: Dimensions.get('window').width/8,
        height: Dimensions.get('window').height/16,
        backgroundColor: 'white',
        borderRadius: 50 / 2,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center'

    },
});