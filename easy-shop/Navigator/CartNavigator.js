import React from 'react'
import { View, Text } from 'react-native'
import { createStackNavigator } from "@react-navigation/stack"

const Stack = createStackNavigator()
import Cart from '../Screens/Cart/Cart';


function MyStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="Cart"
                component={Cart}
                options={{
                    headerShown : false,
                }}
            />
            {/* <Stack.Screen
                name="Checkout"
                component={Checkout}
                options={{
                    title : 'Checkout'
                }}
            /> */}
        </Stack.Navigator>
    )
}


export default function CartNavigator() {
    return <MyStack />;
}