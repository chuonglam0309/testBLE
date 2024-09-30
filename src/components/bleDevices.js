import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList,
  LogBox,
} from 'react-native'



export const BLEDevice = ({ device, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      marginVertical: 5,
      paddingVertical: 8,
      // borderWidth:0.5,
      backgroundColor: 'white',
      borderRadius: 8,
      marginHorizontal: 8,
      // alignItems:'center',
      flexDirection: 'row'
    }}
  >
    <Image
      style={{
        width: '15%',
        height: null,
        aspectRatio: 1,
        alignSelf: 'center',
        // borderWidth:1
      }}
      source={require('../../assets/images/ble.png')} />
    <View style={{
      // backgroundColor:'red',
      width: '75%',
      justifyContent: 'space-around'
    }}>
      <Text style={{
        fontSize: 20,
        color: '#00B8F9'
      }}>{device.name.length === 0 ? 'N/A' : device.name}</Text>
      <Text style={{
        fontSize: 20,
        color: '#676767'
      }}>{device.mac}</Text>
    </View>
  </TouchableOpacity>
);