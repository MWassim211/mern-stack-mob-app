import React from 'react'
import { View, Text} from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Icon from 'react-native-vector-icons/FontAwesome'

// Stack
import HomeNavigator from './HomeNavigator'
import CartNavigator from './CartNavigator'

import CardIcon from "../Shared/CardIcon"

const Tab = createBottomTabNavigator() ;

export default function Main() {
    return (
        <Tab.Navigator 
            initialRouteName="Home"
            tabBarOptions={{
                keyboardHidesTabBar : true,
                showLabel : false,
                activeTintColor : '#e91e63'
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeNavigator}
                options={{
                    tabBarIcon : ({color}) =>(
                        <Icon 
                            name="home"
                            style={{position : "relative"}}
                            color={color}
                            size={30}
                            />
                    )
                }}
            />
             <Tab.Screen
                name="Cart"
                component={CartNavigator}
                options={{
                    tabBarIcon : ({color}) =>(
                        <View>
                            <Icon 
                                name="shopping-cart"
                                color={color}
                                size={30}
                                />
                            <CardIcon />
                        </View>
                    )
                }}
            />
            <Tab.Screen
                name="Admin"
                component={HomeNavigator}
                options={{
                    tabBarIcon : ({color}) =>(
                        <Icon 
                            name="cog"
                            color={color}
                            size={30}
                            />
                    )
                }}
            />
            <Tab.Screen
                name="User"
                component={HomeNavigator}
                options={{
                    tabBarIcon : ({color}) =>(
                        <Icon 
                            name="user"
                            color={color}
                            size={30}
                            />
                    )
                }}
            />
        </Tab.Navigator>
    )
}
