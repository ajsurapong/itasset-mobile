import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { instance as axios, url } from './axios'
import { Icon, Image } from 'react-native-elements'

export default class information extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pathImage: '',
      name: '',
      id: '',
      status: '',
      discription: '',
      getDate: '',
      nameEditor: '',
      dateEditor: '',
      location: '',
      room: '',
      isLoad: false,
      loading: true,
    }

  }

  getData = async () => {
    let { product_id } = this.props.route.params;
    this.setState({ isLoad: true });
    axios.get('/get_productfromotheryear/' + product_id).then(response => {
      if (response.data[0].Image != null) {
        this.setState({
          pathImage: response.data[0].Image
        })
      }
  
      this.setState({
        name: response.data[0].Inventory_Number,
        id: response.data[0].Asset_Number,
        status: (response.data[0].Status == 1 && 'ปกติ')
          || (response.data[0].Status == 0 && 'สูญหาย') || (response.data[0].Status == 2 && 'เสื่อมสภาพ'),
        discription: response.data[0].Asset_Description,
        getDate: response.data[0].product_receivedate,
        nameEditor: response.data[0].name_editor,
        dateEditor: response.data[0].product_editdate,
        location: response.data[0].Location,
        room: response.data[0].Room,
        isLoad: false,
      })
    }).catch(error => {
      if (error.code === 'ECONNABORTED') {
        Alert.alert('การเชื่อมต่อมีปัญหา', 'กรุณาลองใหม่อีกครั้ง')
      }
    })

  }



  componentDidMount() {
    this.getData();
  }
  render() {
    var bgc
    if (this.state.status == 'เสื่อมสภาพ') {
      bgc = '#f5ce07'
    } else if (this.state.status == 'ปกติ') {
      bgc = '#33dea2'
    } else {
      bgc = '#de6e54'
    }
    return (
      <View style={styles.contrainer}>

        <View style={styles.header}>
          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Scan', 'back')} style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Icon name='chevron-left' type='FontAwesome5' size={50} color='white' />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.body}>

          <View style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height/2.5, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9EEE8' }}>
            {this.state.pathImage == '' ?
              <Text style={{ color: 'black', fontSize: 20 }}>ไม่มีรูปถ่าย</Text> :
              <Image containerStyle={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height/2.5 }}
                resizeMode='contain'
                PlaceholderContent={<ActivityIndicator color='#99B2DD' size='large' />}
                source={{ uri: `${url}/upload/Image/${this.state.pathImage}` }} />
            }
          </View>
          <View style={styles.bodyComponet}>
            <View style={{ width: Dimensions.get('window').width/1.06, height: Dimensions.get('window').height/2, backgroundColor: '#ffffff', paddingRight: Dimensions.get('window').width/20, paddingTop: Dimensions.get('window').height/33.3, borderRadius: 20 }}>
              <ScrollView>
                <Text style={styles.Title}>ข้อมูลครุภัณฑ์ </Text>
                <Text style={styles.Title}>สถานะ : {this.state.status}</Text>
                <Text style={styles.textbody,{marginTop:Dimensions.get('window').height/30,paddingLeft: Dimensions.get('window').width/20}}>เลขครุภัณฑ์ : {this.state.name}</Text>
                <Text style={styles.textbody}>คำอธิบาย : {this.state.discription}</Text>
                <Text style={styles.textbody}>วันที่ได้รับ : {this.state.getDate}</Text>
                <Text style={styles.textbody}>ชื่อผู้แก้ไข : {this.state.nameEditor}</Text>
                <Text style={styles.textbody}>สถานที่ : {this.state.location}</Text>
                <Text style={styles.textbody}>ห้อง : {this.state.room}</Text>
              </ScrollView>
              
            </View>
          </View>
        </View>
      </View>

    )
  }
}

const styles = StyleSheet.create({
  contrainer: {
    flex: 1,
    backgroundColor: '#ecefef',
  },
  overlay: {
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
  header: {
    backgroundColor: '#3fc0df',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: Dimensions.get('window').height/20,
    width: Dimensions.get('window').width,
  },
  fontColor: {
    color: 'green'
  },
  statusColor: {
    height: Dimensions.get('window').height/10, 
    width: Dimensions.get('window').width/1.66, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 20, 
    bottom: Dimensions.get('window').height/20, 
    marginLeft: Dimensions.get('window').width/5, 
    marginTop: Dimensions.get('window').height/10
  },
  textbody: {
    paddingLeft: Dimensions.get('window').width/20,
    fontSize: 13,
    marginVertical: '2%',
    color: 'black'
  },
  Title: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingLeft: Dimensions.get('window').width/20,
    color: 'black'

  },
  font: {
    fontSize: 17,
    color: 'white',
    fontWeight: 'bold',
  },
  body: {
    height: Dimensions.get('window').height/1.2,
    width: Dimensions.get('window').width,
    alignItems: 'center',

  },
  bodyComponet: {
    width: Dimensions.get('window').width/0.92,
    height: Dimensions.get('window').height/1.25,
    marginLeft: Dimensions.get('window').width/6.67,
    marginTop: Dimensions.get('window').height/25,
    borderRadius: 20

  },
  skeleton: {
    flex: 1,
    width: Dimensions.get('window').width,
    alignItems: 'center',
  },
  textStatus: {
    fontSize: 30,
    fontWeight: 'bold'
  }
});