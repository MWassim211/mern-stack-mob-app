import React from 'react'
import {View, Text, TouchableOpacity, Dimensions} from 'react-native'
import ProductCard from './ProductCard'

var {width} = Dimensions.get("window")

export default function ProductList(props) {
    const {item} = props;
    return (
        <TouchableOpacity 
            style={{width: '50%'}}
            onPress={()=>{
                props.navigation.navigate("Product Detail",{item : item })
            }}
        >
            <View style={{width: width / 2 , backgroundColor : 'gainsboro'}}>
                <ProductCard {...item} ></ProductCard>
            </View>
        </TouchableOpacity>
    )
}
