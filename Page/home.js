import React, { Component } from 'react';
import { SearchBar, Overlay } from 'react-native-elements';
import { Text, View, StyleSheet, TouchableOpacity, Image, Dimensions, ImageBackground, Alert } from 'react-native';
// import { Button } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import { StackActions } from '@react-navigation/native';
import { instance as axios } from './axios';


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


  signOut = async () => {
    try {
      await AsyncStorage.removeItem('dataUser');
      this.props.navigation.dispatch(resetAction2);
    } catch (error) {
      console.error(error);
    }
  };

  willFocus = () => {
    axios.get('/home_chart').then(response => {
      AsyncStorage.getItem('dataUser', (err, result) => {
        if (err) {
          console.log(err)
        }

        let data = JSON.parse(result);
        // console.log(response.data[0])
        if(response.data[0] === undefined ||response.data[0].length === 0){
          Alert.alert('ยังไม่มีข้อมูลครุภัณฑ์ในระบบ', 'กรุณาติดต่อผู้ดูแลระบบ')
          this.signOut();
        }else{
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
      <View style={styles.BG}>

        <View
          style={{
            marginTop: Dimensions.get('window').height / 60,
            flexDirection: 'row',
            justifyContent: 'space-around'
          }}>
          <View style={{ marginRight: Dimensions.get('window').height / 10 }}>
            <Text style={{ color: '#3fc0df', textAlign: 'left', fontSize: 28, fontWeight: 'bold' }}>IT
            <Text style={{ color: 'black' }}> ASSET</Text>
            </Text>
          </View>

          <TouchableOpacity  onPress={() => this.props.navigation.dispatch(resetAction)}>
            <Image style={{ width: Dimensions.get('window').width / 8, height: Dimensions.get('window').height / 15, borderRadius: 100, overflow: 'hidden', }}
              source={{ uri: this.state.pathImage }} />
          </TouchableOpacity>

        </View>

        <View style={{
          width: Dimensions.get('window').width / 1.1,
          height: Dimensions.get('window').height / 3.5,
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: Dimensions.get('window').height / 40,
          marginTop: Dimensions.get('window').height / 60
        }}>
          <Text style={{
            fontWeight: "bold",
            fontSize: 19
          }}
          >การตรวจนับครุภัณฑ์ประจำปี {this.state.Years}</Text>
          <Image
            source={require('../assets/img/main.jpg')}
            // resizeMode='contain'
            style={styles.photo}
          />
          <Text style={{
            fontSize: 13,
            bottom: Dimensions.get('window').height / 6,
            left: Dimensions.get('window').width / 4.5
          }}>
            วันที่เริ่มต้น : {this.state.date_start}
          </Text>
          <Text style={{
            fontSize: 13,
            bottom: Dimensions.get('window').height / 6.5,
            left: Dimensions.get('window').width / 4.5
          }}>
            วันสิ้นสุด    : {this.state.date_end}
          </Text>

        </View>


        <View style={{ width: Dimensions.get('window').width / 1.1, marginTop: Dimensions.get('window').height / 30, marginBottom: Dimensions.get('window').height / 60, marginLeft: Dimensions.get('window').height / 60, height: Dimensions.get('window').height / 18, textAlign: 'center' }}>
          <SearchBar
            placeholder="ค้นหารหัสครุภัณฑ์"
            onChangeText={this.updateSearch}
            value={search}
            style={{ justifyContent: 'flex-start' }}
            fontSize={16}
            keyboardType='number-pad'
            placeholderTextColor='#3fc0df'
            containerStyle={{
              backgroundColor: 'white',
              borderRadius: 30,
              borderWidth: 1.5,
              borderTopColor: '#3fc0df',
              borderBottomColor: '#3fc0df',
              borderRightColor: '#3fc0df',
              borderLeftColor: '#3fc0df',
              height: Dimensions.get('window').height / 17
            }}
            inputContainerStyle={{
              height: Dimensions.get('window').height / 28,
              borderRadius: 30,
              backgroundColor: 'white',
            }}
            showLoading={this.state.searching}
            maxLength={15}
            onClear={() => this.setState({ searching: false })}
          />
        </View>

        <View
          style={{
            alignItems: 'center',
            width: Dimensions.get('window').width,
            marginTop: Dimensions.get('window').height / 60,
            height: Dimensions.get('window').height / 3,
          }}>

          <View
            style={{
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height / 7,
              flexDirection: 'row',
              marginTop: Dimensions.get('window').height / 60,
              justifyContent: 'space-around'
            }}>

            <View style={styles.AllItem}>
              <Text style={styles.Font}>ครุภัณฑ์ทั้งหมด</Text>
              <View style={{
                flexDirection: 'row',
                marginTop: Dimensions.get('window').height / 400,
                justifyContent: 'space-around',
                marginRight: Dimensions.get('window').height / 20
              }}>
                <Image
                  source={require('../assets/img/All.png')}
                  style={styles.LogoStatus}
                />
                <Text style={styles.Font2}>{this.state.item}</Text>

              </View>

            </View>

            <View style={styles.Normal}>
              <Text style={styles.Font}>ครุภัณฑ์ปกติ</Text>
              <View style={{
                flexDirection: 'row',
                marginTop: Dimensions.get('window').height / 300,
                justifyContent: 'space-around',
                marginRight: Dimensions.get('window').height / 20
              }}>
                <Image
                  source={require('../assets/img/Normal.png')}
                  style={styles.LogoStatus}
                />
                <Text style={styles.Font2}>{this.state.Normal_item}</Text>
              </View>

            </View>

          </View>

          <View
            style={{
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height / 7,
              flexDirection: 'row',
              marginTop: Dimensions.get('window').height / 60,
              justifyContent: 'space-around'
            }}>

            <View style={styles.Normal}>
              <Text style={styles.Font}>ครุภัณฑ์เสื่อมสภาพ
              </Text>
              <View style={{
                flexDirection: 'row',
                marginTop: Dimensions.get('window').height / 300,
                justifyContent: 'space-around',
                marginRight: Dimensions.get('window').height / 20
              }}>
                <Image
                  source={require('../assets/img/Fix.png')}
                  style={styles.LogoStatus}
                />
                <Text style={styles.Font2}>{this.state.Repair_item}</Text>
              </View>

            </View>

            <View style={styles.Normal}>
              <Text style={styles.Font}>ครุภัณฑ์สูญหาย
              </Text>
              <View style={{
                flexDirection: 'row',
                marginTop: Dimensions.get('window').height / 300,
                justifyContent: 'space-around',
                marginRight: Dimensions.get('window').height / 20
              }}>
                <Image
                  source={require('../assets/img/Dis.png')}
                  style={styles.LogoStatus}
                />
                <Text style={styles.Font2}>{this.state.lost_item}</Text>
              </View>

            </View>

          </View>

        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'center',

          }}>
          <View
            style={{
              flex: 1,
              width: Dimensions.get('window').width,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              zIndex: 90
            }}>

            <View
              style={{
                width: Dimensions.get('window').width,
                flexDirection: 'row',
                justifyContent: 'space-around',
                paddingHorizontal: Dimensions.get('window').height / 90,
                alignItems: 'flex-end',
                height: Dimensions.get('window').height / 11,
                marginTop: Dimensions.get('window').height / 60
              }}>
              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#3fc0df',
                  width: Dimensions.get('window').width / 5,
                  height: Dimensions.get('window').height / 10,
                  borderRadius: 50,
                }}
                onPress={() => this.props.navigation.navigate('Scan')}>
                <Image
                  style={{ width: Dimensions.get('window').width / 8.9, height: Dimensions.get('window').height / 18 }}
                  source={require('../assets/img/qr-code.png')}
                  resizeMode='cover'
                />
              </TouchableOpacity>
            </View>


          </View>
        </View>
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
                  <TouchableOpacity onPress={() => this.setState({ visible: false, loading: false })} style={{ width: '80%', height: '100%', backgroundColor: '#FD003A', borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: 'white' }}>ตกลง</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Overlay>
          )
        }
      </View >
    );
  }
}
const styles = StyleSheet.create({
  BG: {
    flex: 1,
    backgroundColor: '#f4f4f5',
  },
  btn: {
    backgroundColor: '#3A405A',
    borderRadius: 5,
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    width: '35%',
    flexDirection: 'row',
  },
  Font: {
    color: 'black',
    textAlign: 'center',
    fontSize: 15,
    marginTop: '10%',
    fontWeight: "bold"

  },
  Font2: {
    color: 'black',
    fontSize: 36,
    marginTop: '5%',
    marginLeft: '30%',
  },
  LogoStatus: {
    aspectRatio: 1,
    height: Dimensions.get('window').height / 7,
    width: Dimensions.get('window').width / 7,
    marginLeft: Dimensions.get('window').width / 15,
  },
  LOGO: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  Lost: {
    backgroundColor: 'white',
    borderRadius: 30,
    width: '45%',
    height: '100%',
  },
  AllItem: {
    backgroundColor: 'white',
    borderRadius: 30,
    width: '45%',
    height: '100%',
  },
  Normal: {
    backgroundColor: 'white',
    borderRadius: 30,
    width: '45%',
    height: '100%',

  },
  Repair: {
    backgroundColor: 'white',
    borderRadius: 30,
    width: '45%',
    height: '100%',
  },
  indecator: {
    position: 'absolute',
    left: 0,
    marginHorizontal: 10,
    zIndex: -99
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
  photo: {
    width: Dimensions.get('window').width / 2.42,
    height: Dimensions.get('window').height / 5,
    right: Dimensions.get('window').width / 5,
    marginTop: Dimensions.get('window').height / 60,
  }
});
