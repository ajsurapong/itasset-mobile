import React, { Component } from 'react';
import { SearchBar } from 'react-native-elements';
import { Text, View, StyleSheet, TouchableOpacity, Image, Dimensions, Button, Alert } from 'react-native';
// import { Button } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import { StackActions } from '@react-navigation/native';
import { instance as axios } from './axios';
import Modal from 'react-native-modal';
import { GoogleSignin } from '@react-native-community/google-signin';

const resetAction = StackActions.replace('Logout');
const resetAction2 = StackActions.replace('Login');
export default class home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      user_role: '',
      user_status: '',
      item: '0',
      lost_item: '0',
      Normal_item: '0',
      Repair_item: '0',
      search: '',
      searching: false,
      loading: false,
      visible: false,
      isLoad: false,
      Years: '0',
      date_start: '-',
      date_end: '-',
      pathImage: 'mm',
    };
    this.subs = [
      this.props.navigation.addListener('focus', this.willFocus)
    ];
  }

  updateSearch = search => {
    this.setState({
      search: search,
      searching: true,
    });
  };

  clearAndLogout = async () => {
    try {
      // signout of Google
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      // delete user data
      await AsyncStorage.removeItem('dataUser');
      //jump to 'Login' page
      this.props.navigation.dispatch(resetAction2);
    } catch (error) {
      console.log(error);
    }
  }

  signOut = () => {
    Alert.alert(
      //title
      'ออกจากระบบ',
      //body
      'ยืนยันการออกจากระบบ',
      //choices
      [
        { text: 'ยกเลิก', onPress: () => {}},
        {
          text: 'ตกลง', onPress: () => {
            this.clearAndLogout();
          },
        },
      ],
      {
        cancelable: true
      }
      //clicking out side of alert will cancel
    );
  };

  willFocus = () => {
    axios.get('/home_chart').then(response => {
      AsyncStorage.getItem('dataUser', (err, result) => {
        if (err) {
          console.log(err);
        }

        let data = JSON.parse(result);
        // console.log(response.data[0])
        if (response.data[0] === undefined || response.data[0].length === 0) {
          Alert.alert('ยังไม่มีข้อมูลครุภัณฑ์ในระบบ', 'กรุณาติดต่อผู้ดูแลระบบ')
          this.signOut();
        } else {
          this.setState({
            user_role: data.user_role,
            user_status: data.working_year,
            item: response.data[0].defaultStatus + response.data[0].product_normal + response.data[0].product_repair,
            lost_item: response.data[0].defaultStatus,
            Normal_item: response.data[0].product_normal,
            Repair_item: response.data[0].product_repair,
            date_start: response.data[0].Date_start,
            date_end: response.data[0].Date_end,
            pathImage: data.Photo
          })
        }

      })
    }).catch(error => {
      if (error.code === 'ECONNABORTED') {
        Alert.alert('การเชื่อมต่อมีปัญหา', 'กรุณาลองใหม่อีกครั้ง')
      }
    })
  }

  componentDidMount() {
    // this is required for Signout
    GoogleSignin.configure({
    });
  }
  
  componentDidUpdate() {
    this.searching();
  }

  searching = async () => {
    let searchLength = this.state.search.length
    let year = new Date().getFullYear() + 543;
    this.state.Years = year;
    if (searchLength == 15) {
      let response = await axios.get('/check_date/' + this.state.search);
      if (response.data == 1 && this.state.user_role == 2 && this.state.user_status == year) {
        this.props.navigation.navigate('Update', {
          product_id: this.state.search
        });
        this.setState({
          visible: false,
          search: '',
          searching: false
        })
      }
      else if (response.data == 2 || response.data != 3) {
        this.props.navigation.navigate('Information', {
          product_id: this.state.search
        });
        this.setState({
          visible: false,
          search: '',
          searching: false
        })
      }
      else if (response.data == 3) {
        this.setState({
          visible: true,
          search: ''
        })
      }
    } else if (searchLength > 15) {
      this.setState({
        visible: true,
        search: ''
      })
    }
  }

  render() {
    let year = new Date().getFullYear() + 543;
    this.state.Years = year;
    const { search } = this.state;

    return (
      <View style={{ flex: 1 }}>
        {/* Header and Signout Icon */}
        <View
          style={{ marginVertical: 8, marginHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ color: '#3fc0df', textAlign: 'left', fontSize: 28, fontWeight: 'bold' }}>IT
            <Text style={{ color: 'black' }}> ASSET</Text>
            </Text>
          </View>

          <TouchableOpacity onPress={this.signOut}>
            <Image source={require('../assets/img/logout.png')} style={{width: 50, height: 50, resizeMode:"contain"}}/>
          </TouchableOpacity>
        </View>

        {/* Logo and Checking dates */}
        <View style={{
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: 16,
          paddingVertical: 8
        }}>
          <Text style={{ fontWeight: "bold", fontSize: 19 }}>การตรวจนับครุภัณฑ์ประจำปี {this.state.Years}</Text>
          <View style={{ flexDirection: 'row' }}>
            <Image
              style={{ flex: 1, height: 150 }}
              source={require('../assets/img/main.jpg')}
              resizeMode='cover'
            />
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text style={{ fontSize: 14 }}>
                วันที่เริ่มต้น : {this.state.date_start}
              </Text>
              <Text style={{ fontSize: 14 }}>
                วันสิ้นสุด    : {this.state.date_end}
              </Text>
            </View>
          </View>
        </View>

        {/* Search bar */}
        <SearchBar
          placeholder="ค้นหารหัสครุภัณฑ์"
          onChangeText={this.updateSearch}
          value={search}
          // style={{ marginHorizontal: 16 }}
          fontSize={16}
          keyboardType='number-pad'
          placeholderTextColor='gray'
          containerStyle={{
            backgroundColor: 'white',
            borderColor: 'white',
            // borderRadius: 16,
            borderWidth: 1,
            borderTopColor: 'white',
            borderBottomColor: 'white',
            // borderRightColor: '#3fc0df',
            // borderLeftColor: '#3fc0df', 
            marginHorizontal: 16           
          }}
          inputContainerStyle={{
            borderRadius: 20,
            backgroundColor: 'white',
            borderColor: '#3fc0df',
            borderWidth: 1.5
          }}
          showLoading={this.state.searching}
          maxLength={15}
          onClear={() => this.setState({ searching: false })}
        />

        {/* Dashboard */}
        <View>
          <View style={styles.dash_row}>
            <View style={styles.dash_box}>
              <Text style={styles.dash_title}>ครุภัณฑ์ทั้งหมด</Text>
              <View style={styles.dash_subrow}>
                <Image
                  source={require('../assets/img/All.png')}
                  style={styles.dash_image}
                />
                <Text style={styles.dash_number}>{this.state.item}</Text>
              </View>
            </View>

            <View style={styles.dash_box}>
              <Text style={styles.dash_title}>ครุภัณฑ์ปกติ</Text>
              <View style={styles.dash_subrow}>
                <Image
                  source={require('../assets/img/Normal.png')}
                  style={styles.dash_image}
                />
                <Text style={styles.dash_number}>{this.state.Normal_item}</Text>
              </View>
            </View>
          </View>

          <View style={styles.dash_row}>
            <View style={styles.dash_box}>
              <Text style={styles.dash_title}>ครุภัณฑ์เสื่อมสภาพ
              </Text>
              <View style={styles.dash_subrow}>
                <Image
                  source={require('../assets/img/Fix.png')}
                  style={styles.dash_image}
                />
                <Text style={styles.dash_number}>{this.state.Repair_item}</Text>
              </View>
            </View>

            <View style={styles.dash_box}>
              <Text style={styles.dash_title}>ครุภัณฑ์สูญหาย
              </Text>
              <View style={styles.dash_subrow}>
                <Image
                  source={require('../assets/img/Dis.png')}
                  style={styles.dash_image}
                />
                <Text style={styles.dash_number}>{this.state.lost_item}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Scan button */}
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#3fc0df',
              borderRadius: 50,
              width: 80,
              height: 80,
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onPress={() => this.props.navigation.navigate('Scan')}>
            <Image
              source={require('../assets/img/qr-code.png')}
              resizeMode='contain'
              style={{ height: 50, width: undefined, aspectRatio: 1 }}
            />
          </TouchableOpacity>
        </View>

        {/* Modal: Searching not found */}
        <Modal
          isVisible={this.state.visible}
          onBackdropPress={() => { this.setState({ visible: false }) }}
        >
          <View style={{ alignItems: 'center', backgroundColor: 'white', padding: 8 }}>
            <Image source={require('../assets/img/warning.png')} style={{ width: 50 }} />
            <Text style={{ fontSize: 22, fontWeight: 'bold', marginVertical: 16 }}>ไม่พบข้อมูล</Text>
            <Button title="ปิด" onPress={() => { this.setState({ visible: false }) }} />
          </View>
        </Modal>
      </View >
    );
  }
}
const styles = StyleSheet.create({
  dash_row: {
    flexDirection: 'row', justifyContent: 'center', marginTop: 8, paddingHorizontal: 8,
  },
  dash_box: {
    flex: 1, backgroundColor: 'white', borderRadius: 24, padding: 8, marginHorizontal: 8,
  },
  dash_title: {
    fontSize: 16, fontWeight: 'bold',
  },
  dash_subrow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  dash_image: {
    height: 50, resizeMode: 'contain',
  },
  dash_number: {
    fontSize: 32
  },  
});
