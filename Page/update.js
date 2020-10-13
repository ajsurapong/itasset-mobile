import React, { Component } from 'react';
import { Text,View,StyleSheet,TouchableOpacity,Dimensions,Alert,Image,} from 'react-native';
import { CheckBox, Overlay, Icon, Button } from 'react-native-elements';
import { instance as axios, url } from './axios'
import AsyncStorage from '@react-native-community/async-storage';
import { StackActions } from '@react-navigation/native';

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
    if(image !== undefined){
      this.setState({ image: image })
    }
    
  }

  checkReqimage = () => {
    if (this.state.reqImage == 'ต้องการถ่ายรูป') {
      this.state.reqImage = 1
    }
    // console.log(this.state.reqImage)
    if (this.state.reqImage == 1 && (this.state.image == '' || this.state.image === undefined)) {
      console.log('tttttttt')
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
      console.log('1')
    }
    else if (this.state.reqImage != 1 && this.state.image != '') {
      this.state.reqImage = 'ไม่ต้องการถ่ายรูป'
      this.setState({ visible: true })
      console.log('2')
    } else {
      this.state.reqImage = 'ไม่ต้องการถ่ายรูป'
      this.setState({ noImage: true })
      console.log('3')
    }

  }

  UpdateNoImage = async () => {
    this.setState({ noImage: false, loading: true })
    let username = JSON.parse(await AsyncStorage.getItem('dataUser'));
    let product_data = {
      product_editorDate: date,
      user_editor: username.email,
      product_statusID: this.state.status_id,
      product_code: this.state.id_I
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
      product_code: this.state.id_I
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
      <View style={styles.Body}>
        <View style={styles.header}>
          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Scan')} style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Icon name='chevron-left' type='FontAwesome5' size={50} color='white' />
            </TouchableOpacity>
          </View>
        </View>

        <View style={this.state.image == '' ? styles.Pic1 : styles.Pic2}>
          <View style={styles.img}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Capture')} style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Image
                source = {this.state.image != '' ? {uri: this.state.image} : require('../assets/img/addimgNew1.png')}
                // source={{ uri: this.state.image ? this.state.image : `${url}/img1/addimgNew1.png` }}
                resizeMode='contain'
                style={{ width: Dimensions.get('window').width / 1.5, height: Dimensions.get('window').height / 3, alignItems: 'center', justifyContent: 'center' }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.del}>

          <View style={{ flexDirection: 'row', height: Dimensions.get('window').height / 5 }}>

            <View style={{ width: Dimensions.get('window').width, justifyContent: 'space-around', height: Dimensions.get('window').height / 6, marginTop: Dimensions.get('window').height / 12, }}>
              <Text style={styles.HeadContent}>ข้อมูลครุภัณฑ์</Text>
              <Text style={styles.TEXT}>เลขครุภัณฑ์ : {this.state.id_I}</Text>
              <Text style={styles.TEXT}>คำอธิบาย : {this.state.desc_I}</Text>
              <Text style={styles.TEXT}>สถานที่ : {this.state.Location} </Text>
              <Text style={styles.TEXT}>ห้อง : {this.state.Room_i}</Text>
              <Text style={styles.HeadStatus}> สถานะ : <Text style={this.state.reqImage == 'ไม่ต้องการถ่ายรูป' ? styles.reqImage1 : styles.reqImage2}>{this.state.reqImage}</Text></Text>
            </View>
          </View>

          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              marginTop: Dimensions.get('window').height / 10,
            }}>
            <CheckBox size={30} center title="ปกติ    " checked={this.state.ck_normal} onPress={() => this.checkBox('normal')} />
            <CheckBox size={30} center title="เสื่อมสภาพ" checked={this.state.ck_repair} onPress={() => this.checkBox('repair')} />
          </View>
        </View>

        <View style={styles.Bot}>

          <TouchableOpacity
            style={styles.UpD}
            onPress={this.checkReqimage}>
            <Text style={{ color: 'white', fontSize: 22 }}>อัพเดตข้อมูล</Text>
          </TouchableOpacity>

        </View>


        {this.state.visible && (
          <Overlay
            isVisible
            overlayBackgroundColor="white"
            overlayStyle={{ width: Dimensions.get('window').width / 1.33, height: Dimensions.get('window').height / 3.33, borderRadius: 15 }}
          >
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Image source={require('../assets/img/warning.png')} />
              </View>
              <View style={{ width: Dimensions.get('window').width, height: '30%', alignItems: 'center', justifyContent: 'center', marginVertical: '3%' }}>
                <Text style={{ fontSize: 15, textAlign: 'center' }}>คุณแน่ใจว่าต้องการอัพเดตข้อมูล?</Text>
              </View>
              <View style={{ width: '100%', height: '30%', justifyContent: 'space-around', flexDirection: 'row' }}>
                <Button title='ตกลง' buttonStyle={{ backgroundColor: '#17A589' }} containerStyle={{ width: '40%' }} onPress={this.UpdateWithImage} loading={this.state.loading} />
                <Button title='ยกเลิก' buttonStyle={{ backgroundColor: '#9F9C9E' }} containerStyle={{ width: '40%' }} onPress={() => this.setState({ visible: false, loading: false })} />
              </View>
            </View>
          </Overlay>
        )}
        {this.state.noImage && (
          <Overlay
            isVisible
            overlayBackgroundColor="white"
            overlayStyle={{ width: '75%', height: '30%', borderRadius: 15 }}
          >
            <View style={{ flex: 1, justifyContent: 'space-around' }}>
              <View style={{ width: '100%', height: '40%', alignItems: 'center', justifyContent: 'center' }}>
                <Image source={require('../assets/img/warning.png')} />
              </View>
              <View style={{ width: '100%', height: '40%', justifyContent: 'center', alignItems: 'center', marginVertical: '5%' }}>
                <Text style={{ fontSize: 15, textAlign: 'center' }}>คุณแน่ใจว่าต้องการอัพเดตข้อมูลโดยไม่มีรูปภาพ?</Text>
              </View>
              <View style={{ width: '100%', height: '30%', alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row' }}>
                <Button title='ตกลง' buttonStyle={{ backgroundColor: '#17A589' }} containerStyle={{ width: '40%' }} onPress={this.UpdateNoImage} loading={this.state.loading} />
                <Button title='ยกเลิก' buttonStyle={{ backgroundColor: '#9F9C9E' }} containerStyle={{ width: '40%' }} onPress={() => this.setState({ noImage: false, loading: false })} />
              </View>
            </View>
          </Overlay>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  Body: {
    height: Dimensions.get('window').height / 1,
    width: Dimensions.get('window').width,
    // backgroundColor: '#ecefef',
    alignItems: 'center'
  },
  header: {
    backgroundColor: '#3fc0df',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: Dimensions.get('window').height / 20,
    width: Dimensions.get('window').width,
    marginBottom: Dimensions.get('window').height / 32,
  },
  Pic1: {
    height: Dimensions.get('window').height / 2.8,
    width: Dimensions.get('window').width / 1.33,
    alignItems: 'center',
    marginTop: Dimensions.get('window').height / 40 * (-1),
    marginLeft: Dimensions.get('window').width / 20
  },
  Pic2: {
    height: Dimensions.get('window').height / 2.86,
    width: Dimensions.get('window').width,
    alignItems: 'center',
  },
  del: {
    height: Dimensions.get('window').height / 2.3,
    width: Dimensions.get('window').width / 1.11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
  },
  TEXT: {
    color: 'black',
    fontSize: 15,
    marginLeft: Dimensions.get('window').width / 10,
    marginTop: Dimensions.get('window').height / 10,
    // fontWeight: 'bold'
  },
  HeadContent: {
    color: 'black',
    fontSize: 20,
    marginLeft: Dimensions.get('window').width / 10,
    marginTop: Dimensions.get('window').height / -20,
    marginBottom: Dimensions.get('window').height / -100,
    fontWeight: 'bold',
  },
  HeadStatus: {
    color: 'black',
    fontSize: 20,
    marginLeft: Dimensions.get('window').width / 12,
    marginTop: Dimensions.get('window').height / 10,
    // marginBottom: Dimensions.get('window').height / 50,
    fontWeight: 'bold',
  },
  reqImage1: {
    color: 'black',
    fontSize: 20,
    marginLeft: Dimensions.get('window').width / 17,
    marginTop: Dimensions.get('window').height / 80,
    // marginBottom: Dimensions.get('window').height / 50,
    fontWeight: 'bold',
  },
  reqImage2: {
    color: 'red',
    fontSize: 20,
    marginLeft: Dimensions.get('window').width / 17,
    marginTop: Dimensions.get('window').height / 80,
    // marginBottom: Dimensions.get('window').height / 50,
    fontWeight: 'bold',
  },
  Bot: {
    height: Dimensions.get('window').height / 2,
    width: Dimensions.get('window').width,
    justifyContent: 'center',
    flexDirection: 'row',
    marginLeft: Dimensions.get('window').width / 13
  },
  UpD: {
    backgroundColor: '#33dea2',
    borderRadius: 15,
    width: Dimensions.get('window').width / 2,
    height: Dimensions.get('window').height / 13.7,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Dimensions.get('window').width / 10,
    marginTop: Dimensions.get('window').height / 40,
  },
  Cancel: {
    backgroundColor: 'white',
    borderRadius: 15,
    borderWidth: 1.5,
    borderTopColor: '#33dea2',
    borderBottomColor: '#33dea2',
    borderRightColor: '#33dea2',
    borderLeftColor: '#33dea2',
    width: Dimensions.get('window').width / 5.56,
    height: Dimensions.get('window').height / 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Dimensions.get('window').width / 10,
    marginTop: Dimensions.get('window').height / 40,
  },
  indecator: {
    position: 'absolute',
    left: 0,
    padding: 10
  },
  overlay: {
    zIndex: 90,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    position: 'absolute',
    left: 0,
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9EEE8',
  },
  font: {
    fontSize: 25,
  },
  img: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    borderRadius: 20,
    alignItems: 'center',
  }
});
