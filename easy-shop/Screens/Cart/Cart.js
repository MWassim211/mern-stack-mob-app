import React from 'react'
import { View,   Dimensions, StyleSheet } from 'react-native'
import {Container, Text, Left,Right,ListItem,Thumbnail,Body, H1, Button} from 'native-base'
import Icon from 'react-native-vector-icons/FontAwesome'

import {connect} from 'react-redux'

var {height, width} = Dimensions.get('window')
var total = 0


function Cart(props) {

    props.cartItems.forEach((cart)=>{
        return total += cart.product.price
    })
    
    return (
        <>
        {props.cartItems.length ? (
            <Container>
                <H1 style={{alignSelf : 'center'}}>Cart</H1>
                {props.cartItems.map(data => {
                    return (
                        <ListItem
                            style={styles.listItem}
                            key={Math.random()}
                            avatar
                        >
                            <Left>
                                <Thumbnail 
                                    source={{uri : data.product.image ?
                                             data.product.image : 
                                             'https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png'}}/>
                            </Left>
                            <Body style={styles.body}>
                                <Left>
                                    <Text>{data.product.name}</Text>
                                </Left>
                                <Right>
                                    <Text>$ {data.product.price}</Text>
                                </Right>
                            </Body>
                            
                        </ListItem>
                    )
                })}
                <View style={styles.bottomContainer}>
                    <Left style={styles.price}>
                        <Text>$ {total}</Text>
                    </Left>
                    <Right >
                        <Button title="Clear" />
                    </Right>
                    {/* <Right >
                        <Button title="Checkout" onPress={() => props.navigation.navigate('Checkout')}></Button>
                    </Right> */}
                </View>
            </Container>
        ) : (
            <Container style={styles.emptyContainer}>
                <Text>Looks like tour cart is empty</Text>
                <Text>Add products to your cart to get started</Text>
            </Container>
        )}
        </>
    )
}

const mapStateToProps = (state) => {
    const {cartItems} = state;
    return {
        cartItems: cartItems
    }
}

const styles = StyleSheet.create({
    emptyContainer: {
        height: height,
        alignItems: 'center',
        justifyContent: 'center'
    },
    listItem : {
        alignItems: 'center',
        backgroundColor :'white',
        justifyContent: 'center',
    },
    body:{
        margin : 10,
        alignItems: 'center',
        flexDirection : 'row'
    },
    bottomContainer : {
        flexDirection : 'row',
        position : 'absolute',
        bottom : 0,
        left : 0,
        backgroundColor : 'white',
        elevation :20
    },
    price : {
        fontSize : 18,
        margin : 20,
        color : 'green'
    }
})

export default connect(mapStateToProps,null)(Cart)