import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
  } from 'react-native'
  import React, { useEffect, useState } from 'react'

export  const Button = ({ tittle, bgcolors, textcolors, onPress}) => (
    <TouchableOpacity 
    onPress={onPress}
    style={{
        backgroundColor:bgcolors,
        marginVertical: 10,
        paddingVertical:20,
        borderRadius:10,
        marginHorizontal:8,
        borderWidth:0.5,
        borderColor:'#D9D9D9',
        alignItems:'center',
        width:'80%',
        alignSelf:'center',
    }}>
        <Text style={{
            color: textcolors ? textcolors : null,
            fontSize:14
        }}>{tittle}</Text>
    </TouchableOpacity>

)