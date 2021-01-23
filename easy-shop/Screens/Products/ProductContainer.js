import React, {useState, useEffect} from 'react'
import {View , StyleSheet, ActivityIndicator , FlatList, Dimensions} from 'react-native'
import { Container, Text , Header, Icon , Item, Input} from 'native-base';
import ProductList from './ProductList'
import SearchedProduct from './SearchedProduct'

const data = require('../../assets/data/products.json')
var { height } = Dimensions.get('window')

const ProductContainer = () => {

    const [products, setProducts] = useState([])
    const [productsFiltered,setproductsFiltered] = useState([])
    const [focus, setFocus] = useState(false)

    useEffect(()=>{
        setProducts(data)
        setproductsFiltered(data)

        return ()=>{
            setProducts([])
            setproductsFiltered([])
            setFocus(false)
        }
    },[])

    const searchProduct = (text) => {
        setproductsFiltered(
            products.filter((item)=> item.name.toLowerCase().includes(text.toLowerCase()))
        )
    }

    const openList = () => {
        setFocus(true)
        console.log('ok')
    }

    const onBlur = () => {
        setFocus(false)
    }

    return (
        <Container>
            <Header searchBar rounded>
                <Item>
                    <Icon name="ios-search" />
                    <Input 
                        placeholder="Search"
                        onFocus={openList}
                        onChangeText={(text)=> searchProduct(text)}
                    />
                    {focus == true ? (
                        <Icon onPress={onBlur} name="ios-close"/>
                     ) : null}
                </Item>
            </Header>
            {focus == true ? (
                <SearchedProduct productsFiltered={productsFiltered} />
            ):(
                <View style={styles.container}>
                    <FlatList 
                        horizontal
                        data={products}
                        renderItem={({item})=> <ProductList 
                                                key={item.id}
                                                item={item}
                                                keyExtractor={item.name}/>}
                        keyExtractor={item => item.name}
                    />
                </View>
            )}
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
      flexWrap: "wrap",
      backgroundColor: "gainsboro",
    },
    listContainer: {
      height: height,
      flex: 1,
      flexDirection: "row",
      alignItems: "flex-start",
      flexWrap: "wrap",
      backgroundColor: "gainsboro",
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    }
  });

export default ProductContainer;