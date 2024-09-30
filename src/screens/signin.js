import { StyleSheet,
    Text,
    View,
    NativeModules,
    NativeEventEmitter,
    Platform,
    PermissionsAndroid,
    Button, 
    FlatList,
    Alert,
    TouchableOpacity,
    ScrollView,
    SafeAreaView 
} from 'react-native'
import React, { useEffect, useState } from 'react'
import PagerView from 'react-native-pager-view';


const Signin = (props) => {
return(
 <PagerView style={styles.pagerView} initialPage={0}>
      <View key="1">
        <Text>First page</Text>
      </View>
      <View key="2">
        <Text>Second page</Text>
      </View>
    </PagerView>    
)
}
export default Signin
const styles = StyleSheet.create({
    pagerView: {
      flex: 1,
    },
  });
