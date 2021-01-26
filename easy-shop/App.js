import React from 'react';
import { NavigationContainer } from '@react-navigation/native'

//Redux
import {Provider} from 'react-redux'
import store from './Redux/store'

// Navigators
import Main from './Navigator/Main'

// Screens
import Header from './Shared/Header'

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
          <Header />
          <Main />
      </NavigationContainer>
    </Provider>
  );
}
