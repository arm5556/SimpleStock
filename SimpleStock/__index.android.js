/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  ToolbarAndroid,
  DrawerLayoutAndroid,
  View
} from 'react-native';

class SimpleStock extends Component {
	render() {
		return <View><Text>Hello World</Text></View>;
	}
}

AppRegistry.registerComponent( 'SimpleStock', () => SimpleStock );
