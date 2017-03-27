import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

class About extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (					
			<View>
				<Text style={styles.bigText}>Simple Stock Watchlist 0.9 beta</Text>
				<Text style={styles.smallText}>Aram Pokmanee</Text>
			</View> 
		)	
	}
}

var styles = StyleSheet.create({
  bigText: {
    flex: 2,
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: 'black'
  },
  smallText: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
    color: 'black'
  },
});

export default About;