import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions, Alert, Image, TextInput, KeyboardAvoidingView } from 'react-native';
import { CheckBox, Icon, Button } from 'react-native-elements';
import { instance as axios, url } from './axios'
import AsyncStorage from '@react-native-community/async-storage';
import { StackActions } from '@react-navigation/native';
import Modal from 'react-native-modal';
import { ScrollView } from 'react-native-gesture-handler';

const resetAction = StackActions.replace('Scan');
const today = new Date();
const date = `${today.getFullYear() + 543}-${today.getMonth() + 1}-${today.getDate()} `;

export default class update extends Component {
  constructor(props) {
    super(props);
    this.state = {
      desc_I: '',
      id_I: '',
      Location: '',
      Room_i: '',
      ck_normal: true,
      ck_repair: false,
      visible: false,
      Update: false,
      image: '',
      reqImage: 0,
      status_id: 1,
      noImage: false,
      loading: false
    };
  }

  getData = async () => {
    let { product_id } = this.props.route.params;
    this.setState({ isLoad: true })
    let response = await axios.get('/get_product/' + product_id);
    this.setState({
      id_I: response.data[0].Inventory_Number,
      desc_I: response.data[0].Asset_Description,
      Location: response.data[0].Location,
      Room_i: response.data[0].Room,
      reqImage: response.data[0].Takepicture == 1 ? 'ต้องการถ่ายรูป' : 'ไม่ต้องการถ่ายรูป',
      isLoad: false
    })
  }

  componentDidMount() {
    this.getData();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    let { image } = nextProps.route.params;
    if (image !== undefined) {
      this.setState({ image: image })
    }
  }

  checkReqimage = () => {
    if (this.state.reqImage == 'ต้องการถ่ายรูป') {
      this.state.reqImage = 1
    }
    // console.log(this.state.reqImage)
    if (this.state.reqImage == 1 && (this.state.image == '' || this.state.image === undefined)) {
      // console.log('tttttttt')
      this.state.reqImage = 'ต้องการถ่ายรูป'
      Alert.alert(
        //title
        'กรุณาเพิ่มภาพถ่ายครุภัณฑ์',
        //body
        '',
        [
          { text: 'ตกลง' },
        ],
        { cancelable: false }
        //clicking out side of alert will not cancel
      );
    } else if (this.state.reqImage == 1 && this.state.image != '') {
      this.state.reqImage = 'ต้องการถ่ายรูป'
      this.setState({ visible: true })
      // console.log('1')
    }
    else if (this.state.reqImage != 1 && this.state.image != '') {
      this.state.reqImage = 'ไม่ต้องการถ่ายรูป'
      this.setState({ visible: true })
      // console.log('2')
    } else {
      this.state.reqImage = 'ไม่ต้องการถ่ายรูป'
      this.setState({ noImage: true })
      // console.log('3')
    }
  }

  UpdateNoImage = async () => {
    this.setState({ noImage: false, loading: true })
    let username = JSON.parse(await AsyncStorage.getItem('dataUser'));
    let product_data = {
      product_editorDate: date,
      user_editor: username.email,
      product_statusID: this.state.status_id,
      product_code: this.state.id_I,
      // add location and room
      product_location: this.state.Location,
      product_room: this.state.Room_i,
    }
    axios.post('/uploadNoImage', { product_data }).then(response => {
      this.setState({ loading: false })
      Alert.alert(
        //title
        'บันทึกข้อมูลสำเร็จ',
        //body
        '',
        [
          { text: 'ตกลง', onPress: () => this.props.navigation.dispatch(resetAction) },
        ],
        { cancelable: false }
        //clicking out side of alert will not cancel
      );
    }).catch(error => {
      if (error.code === 'ECONNABORTED') {
        this.setState({ loading: false })
        Alert.alert('การเชื่อมต่อมีปัญหา', 'กรุณาลองใหม่อีกครั้ง')
      }
    })
  }

  UpdateWithImage = async () => {
    this.setState({ loading: true })
    let uploadData = new FormData();
    let data = JSON.parse(await AsyncStorage.getItem('dataUser'));
    let product_data = {
      product_editorDate: date,
      user_editor: data.email,
      product_statusID: this.state.status_id,
      product_code: this.state.id_I,
      // add location and room
      product_location: this.state.Location,
      product_room: this.state.Room_i,
    }
    let fileName = this.state.image.replace("file:///data/user/0/com.asset/cache/Camera/", "");
    uploadData.append('photo', { uri: this.state.image, name: fileName, type: 'image/jpeg' })
    uploadData.append('data', JSON.stringify(product_data));

    axios.post('/uploadWithImage', uploadData).then(response => {
      if (response.status == 200) {
        this.setState({ loading: false })
        Alert.alert(
          //title
          'บันทึกข้อมูลสำเร็จ',
          //body
          '',
          [
            { text: 'ตกลง', onPress: () => this.props.navigation.dispatch(resetAction) },
          ],
          { cancelable: false }
          //clicking out side of alert will not cancel
        );
      }
    }).catch(error => {
      if (error.code === 'ECONNABORTED') {
        this.setState({ loading: false })
        Alert.alert('การเชื่อมต่อมีปัญหา', 'กรุณาลองใหม่อีกครั้ง')
      }
    })

  }

  goback = () => {
    this.props.navigation.navigate('ScanCamera')
  }

  checkBox = (type) => {
    if (type == 'normal') {
      this.setState({ ck_repair: false, ck_normal: true, status_id: 1 })
    } else {
      this.setState({ ck_normal: false, ck_repair: true, status_id: 2 })
    }
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        {/* Back button */}
        <View style={{ backgroundColor: "#1E90FF", alignItems: "flex-start" }}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Scan')}>
            <Icon name='chevron-left' type='FontAwesome5' size={50} color='white' />
          </TouchableOpacity>
        </View>

        {/* Image and Asset Info*/}
        <ScrollView>
          {/* Use ScrollView + KeyboardAvoidingView to prevent keyboard overlap content */}
          <KeyboardAvoidingView behavior='padding'>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Capture')}>
              <Image
                source={this.state.image != '' ? { uri: this.state.image } : require('../assets/img/addimgNew1.png')}
                resizeMode="contain"
                style={{ width: null, height: 180, marginVertical: 16 }} />
            </TouchableOpacity>

            {/* Asset details */}
            <View style={{ backgroundColor: "#ffebcd", padding: 16, marginHorizontal: 8, borderRadius: 16 }}>
              {/* <Text style={{ fontWeight: 'bold', fontSize: 20 }}>ข้อมูลครุภัณฑ์</Text> */}
              <Text style={{ fontSize: 16 }}>เลขครุภัณฑ์ : {this.state.id_I}</Text>
              <Text style={{ fontSize: 16 }}>คำอธิบาย : {this.state.desc_I}</Text>

              <Text style={{ fontSize: 16, marginTop: 8 }}>อาคารและห้อง :</Text>
              <TextInput style={{ width: '80%', backgroundColor: "#FFFAF0", padding: 5, marginTop: 5 }} placeholder="อาคาร" onChangeText={(text) => this.setState({ Location: text })} value={this.state.Location} />
              <TextInput style={{ width: '80%', backgroundColor: "#FFFAF0", padding: 5, marginTop: 5 }} placeholder="ห้อง" onChangeText={(text) => this.setState({ Room_i: text })} value={this.state.Room_i} />

              <Text style={{ fontSize: 16, marginVertical: 8 }}>สถานะ: {this.state.reqImage}</Text>
            </View>

            {/* Status checking */}
            <View
              style={{
                justifyContent: 'space-evenly',
                flexDirection: 'row',
              }}>
              <CheckBox size={30} center title="ปกติ" checked={this.state.ck_normal} onPress={() => this.checkBox('normal')} />
              <CheckBox size={30} center title="เสื่อมสภาพ" checked={this.state.ck_repair} onPress={() => this.checkBox('repair')} />
            </View>
          </KeyboardAvoidingView>
        </ScrollView>

        {/* Update Button */}
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity onPress={this.checkReqimage}>
            <Text style={{ color: 'white', fontSize: 22, backgroundColor: '#FF4500', paddingVertical: 8, paddingHorizontal: 16, marginBottom: 8, borderRadius: 16 }}>อัพเดตข้อมูล</Text>
          </TouchableOpacity>
        </View>

        {/* Overlay for image taking */}
        <Modal isVisible={this.state.visible}>
          <View style={{ alignItems: 'center', backgroundColor: 'white', padding: 8 }}>
            <Image source={require('../assets/img/warning.png')} />
            <Text style={{ fontSize: 18, textAlign: 'center', marginVertical: 16 }}>คุณแน่ใจว่าต้องการอัพเดตข้อมูล?</Text>
            <View style={{ flexDirection: 'row' }}>
              <Button title='ตกลง' buttonStyle={{ backgroundColor: '#17A589', paddingHorizontal: 16, marginRight: 16 }} onPress={this.UpdateWithImage} loading={this.state.loading} />
              <Button title='ยกเลิก' buttonStyle={{ backgroundColor: '#9F9C9E', paddingHorizontal: 16 }} onPress={() => this.setState({ visible: false, loading: false })} />
            </View>
          </View>
        </Modal>

        <Modal isVisible={this.state.noImage}>
          <View style={{ alignItems: 'center', backgroundColor: 'white', padding: 8 }}>
            <Image source={require('../assets/img/warning.png')} />
            <Text style={{ fontSize: 18, textAlign: 'center', marginVertical: 16 }}>คุณแน่ใจว่า ต้องการอัพเดตข้อมูลโดยไม่มีรูปภาพ?</Text>
            <View style={{ flexDirection: 'row' }}>
              <Button title='ตกลง' buttonStyle={{ backgroundColor: '#17A589', paddingHorizontal: 16, marginRight: 16 }} onPress={this.UpdateNoImage} loading={this.state.loading} />
              <Button title='ยกเลิก' buttonStyle={{ backgroundColor: '#9F9C9E', paddingHorizontal: 16 }} onPress={() => this.setState({ noImage: false, loading: false })} />
            </View>
          </View>
        </Modal>
      </View >
    );
  }
}

// const styles = StyleSheet.create({
// });