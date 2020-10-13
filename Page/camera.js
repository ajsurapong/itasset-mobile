import React, { Component } from 'react'
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, Image } from 'react-native'
import { RNCamera } from 'react-native-camera';
import {instance as axios} from './axios'
import AsyncStorage from '@react-native-community/async-storage';
import { CirclesLoader } from 'react-native-indicator';
import { Icon, Overlay } from 'react-native-elements'

export default class login extends Component {
    constructor(props) {
        super(props);
        this.camera = null;
        this.barcodeCodes = [];

        this.state = {
            camera: {
                type: RNCamera.Constants.Type.back,
                flashMode: RNCamera.Constants.FlashMode.auto,
            },
            photo: null,
            isLoad: false,
            counter: 0,
            showCamera: true,
            isReady: true,
            user_role: '',
            user_status: '',
            visible: false,
            visiblecamera: true,
            isLoad : false
        };
        this.subs = [
            this.props.navigation.addListener('focus', this.componentDidFocus),
            this.props.navigation.addListener('blur', this.componentWillBlur),
        ];
    }

    componentDidFocus = () => {
        this.setState({ visiblecamera: true })
    }
    componentWillBlur = () => {
        this.setState({ visiblecamera: false })
    }

    getData = async () => {
        let data = JSON.parse(await AsyncStorage.getItem('dataUser'));
        this.setState({ user_role: data.user_role, user_status: data.working_year})
    }

    UNSAFE_componentWillMount() {
        this.getData();
    }


    onBar = async (product_id) => {
        
        let code = product_id.data.length        
        if (code == 15) {
                  
            let year = new Date().getFullYear()+543;      
            let response = await axios.get('/check_date/' + product_id.data);
            if (response.data == 1 && this.state.user_role == 2 && this.state.user_status == year) {
                this.setState({ visiblecamera: false })
                this.props.navigation.navigate('Update', {
                    product_id: product_id.data
                });
                
            } else if (response.data == 2 || response.data != 3) {
                
                this.props.navigation.navigate('Information', {
                    product_id: product_id.data
                });
            } else if (response.data == 3) {
            
                this.setState({ visible: true })
            }
        } else {
            this.setState({ visible: true })
        }

    }

    render() {
        const width = Dimensions.get('window').width / 2;
        return (
            <View style={styles.container}>                
                <View style={{ width: '100%', height: '6%', backgroundColor: '#000000', justifyContent: 'center', alignItems: 'flex-start' }}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Home')} style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon name='chevron-left' type='FontAwesome5' color='white' size={50} containerStyle={{ marginLeft: '-2%' }} />
                        <Text style={{ color: 'white', marginLeft: '-2%', fontSize: 20 }}>กลับ</Text>
                    </TouchableOpacity>
                </View>
                {this.state.visiblecamera &&
                    <View style={{ width: '100%', height: '94%', justifyContent: 'center', alignItems: 'center' }}>
                        <RNCamera
                            ref={ref => {
                                this.camera = ref;
                            }}
                            style={{ ...StyleSheet.absoluteFill }}
                            type={this.state.camera.type}
                            onBarCodeRead={data => this.onBar(data)}
                            onFocusChanged={() => { }}
                            onZoomChanged={() => { }}
                            type={this.state.camera.type}
                        />
                        <View style={{ width: width, height: width }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View style={styles.leftTop} />
                                <View style={{ flex: 1 }} />
                                <View style={styles.rightTop} />
                            </View>
                            <View style={{ flex: 1 }} />
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View style={styles.leftBottom} />
                                <View style={{ flex: 1 }} />
                                <View style={styles.rightBottom} />
                            </View>
                        </View>
                        {this.state.isLoad &&
                            <View style={[styles.overlay, styles.centerOverlay]}>
                                <CirclesLoader color='green' size={40} />
                            </View>
                        }
                        {
                            this.state.visible && (
                                <Overlay
                                    isVisible
                                    overlayBackgroundColor="white"
                                    overlayStyle={{ width: '60%', height: '30%' }}
                                >
                                    <View style={{ flex: 1 }}>
                                        <View style={{ width: '100%', height: '40%', alignItems: 'center', justifyContent: 'center' }}>
                                            <Image source={require('../assets/img/alert.png')} style={{ width: '25%', height: '80%' }} resizeMode="stretch" />
                                        </View>
                                        <View style={{ width: '100%', height: '35%', justifyContent: 'center', alignItems: 'center' }}>
                                            <Text >ไม่พบข้อมูล</Text>
                                        </View>
                                        <View style={{ width: '100%', height: '25%', alignItems: 'center', justifyContent: 'center' }}>
                                            <TouchableOpacity onPress={() => this.setState({ visible: false })} style={{ width: '80%', height: '100%', backgroundColor: '#FD003A', borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{ color: 'white' }}>ตกลง</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </Overlay>
                            )
                        }
                    </View>
                }
            </View>


        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    loadStyle: {
        zIndex: 99,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        position: 'absolute',
        left: 0,
        top: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9EEE8',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    centerOverlay: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',

    },
    overlay: {
        position: 'absolute',
        padding: 16,
        right: 0,
        left: 0,
        alignItems: 'center'
    },
    topOverlay: {
        top: 0,
        height: Dimensions.get('window').height / 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'red'
    },
    bottomOverlay: {
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    enterBarcodeManualButton: {
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 40
    },
    scanScreenMessage: {
        fontSize: 14,
        color: 'white',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    leftTop: {
        flex: 1,
        borderLeftWidth: 3,
        borderTopWidth: 3,
        borderColor: 'white'
    },
    leftBottom: {
        flex: 1,
        borderLeftWidth: 3,
        borderBottomWidth: 3,
        borderColor: 'white'
    },
    rightTop: {
        flex: 1,
        borderRightWidth: 3,
        borderTopWidth: 3,
        borderColor: 'white'
    },
    rightBottom: {
        flex: 1,
        borderRightWidth: 3,
        borderBottomWidth: 3,
        borderColor: 'white'
    }
})
