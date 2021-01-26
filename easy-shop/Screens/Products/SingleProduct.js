import React , {useEffect ,  useState} from 'react'
import { View, Text, Image, StyleSheet, ScrollView, Button } from 'react-native'
import {Left , Right, Container, H1} from 'native-base'

export default function SingleProduct(props) {

    const [item, setItem] = useState(props.route.params.item)
    const [availibility,setAvailibility] = useState('')

    return (
        <Container>
            <ScrollView style={{marginBottom: 80, padding : 5}}>
                <View>
                    <Image 
                        source={{uri : item.image ? item.image : 'https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png'}}
                        resizeMode='contain'
                        style={styles.image}
                    />
                </View>
                <View style={styles.cotentContainer}>
                    <H1 style={styles.contentHeader}>{item.name}</H1>
                        <Text style={styles.contentText}>{item.brand}</Text>
                </View>
            </ScrollView>
            <View style={styles.bottomContainer}>
                <Left>
                    <Text style={styles.price}>
                        $ {item.price}
                    </Text>
                </Left>
                <Right>
                    <Button title="Add"></Button>
                </Right>
            </View>
        </Container>
    )
}

const styles = StyleSheet.create({
    container : {
        position: 'relative',
        height : '100%',
    },
    imageContainer : {
        backgroundColor : 'white',
        padding : 0, 
        margin : 0,
    },
    image : {
        width : '100%',
        height: 250
    },
    contentContainer : {
        marginTop : 20,
        justifyContent : 'center',
        alignItems : 'center'
    },
    contentText : {
        fontSize : 18,
        fontWeight : 'bold',
        marginBottom : 20
    },
    bottomContainer : {
        flexDirection : 'row',
        position : 'absolute',
        bottom : 0,
        backgroundColor : 'white',
        left: 0
    },
    price : {
        fontSize : 24,
        margin : 20,
        color : 'red'
    }
})