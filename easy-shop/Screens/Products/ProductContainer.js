import React, {useState, useEffect} from 'react'
import {View , StyleSheet, ActivityIndicator , FlatList, Dimensions, ScrollView} from 'react-native'
import { Container, Text , Header, Icon , Item, Input} from 'native-base';
import ProductList from './ProductList'
import SearchedProduct from './SearchedProduct'
import CategoryFilter from './CategoryFilter'
import Banner from "../../Shared/Banner";

const data = require('../../assets/data/products.json')
const productsCategories = require('../../assets/data/categories.json')
var { height } = Dimensions.get('window')

const ProductContainer = (props) => {

    const [products, setProducts] = useState([])
    const [productsFiltered,setproductsFiltered] = useState([])
    const [focus, setFocus] = useState()
    const [categories, setCategories] = useState([])
    const [active,  setActive] = useState()
    const [initialState, setinitialState] = useState([])
    const [productsCtg, setproductsCtg] = useState([])

    useEffect(()=>{
        setProducts(data)
        setproductsFiltered(data)
        setFocus(false)
        setCategories(productsCategories)
        setActive(-1)
        setinitialState(data)
        setproductsCtg(data)

        return ()=>{
            setProducts([])
            setproductsFiltered([])
            setFocus(false)
            setCategories([])
            setActive()
            setinitialState([])
        }
    },[])

    const searchProduct = (text) => {
        setproductsFiltered(
            products.filter((item)=> item.name.toLowerCase().includes(text.toLowerCase()))
        )
    }

    const openList = () => {
        setFocus(true)
    }

    const onBlur = () => {
        setFocus(false)
    }

    // Categories
    const changeCtg = (ctg) => {
      {
        ctg === "all"
          ? [setproductsCtg(initialState), setActive(true)]
          : [
                setActive(true),
                setproductsCtg(
                    products.filter((i) =>  i.category._id === ctg)
                ),
            ];
      }
    };

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
                console.log(productsFiltered.length),
                <SearchedProduct 
                    productsFiltered={productsFiltered}
                    navigation={props.navigation}
                />
            ):(
                <ScrollView> 
                    <View style={styles.container}>
                        <View>
                            <Banner />
                            <Text>{categories.length} yes</Text>
                        </View>
                        <View>
                            <CategoryFilter 
                                categories={categories}
                                categoryFilter={changeCtg}
                                productsCtg={productsCtg}
                                active={active}
                                setActive={setActive}
                            />
                        </View>
                    </View>
                    <View style={styles.listContainer}>
                        {productsCtg.length > 0 ? (
                           <View style={styles.listContainer}>
                               {productsCtg.map((item)=>{
                                   return (
                                       <ProductList 
                                            navigation={props.navigation}
                                            key={item.name}
                                            item={item}
                                       />
                                   )
                               })}
                           </View>
                        ): (
                            <View style={[styles.center, {height: "40%"}]}>
                                <Text>No products found</Text>
                            </View>
                        )}
                    </View>
                </ScrollView>
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
      width: "100%",
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