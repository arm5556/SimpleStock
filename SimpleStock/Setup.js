import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  ListView,
  TouchableHighlight,
  TextInput,
  ScrollView,
  View
} from 'react-native';

class Setup extends Component {
	
	constructor(props) {
		super(props);
		
		var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		this.state = {
			dataSource: ds.cloneWithRows(['PTT', 'CPF', 'KBANK']),
		};
	}
	
	render() {
		return (					
			<View>
				<Text>Setup View</Text>
				<ListView
					dataSource={this.state.dataSource}
					renderRow={this._renderListRow}
				/>	
				<TextInput placeholder='Input Symbol...'/>
				<TouchableHighlight>
					<Text>Add</Text>
				</TouchableHighlight>
			</View> 
		)	
	}
	
	_onPressRemove( rowData ) {
		console.log( 'remove row=' + rowData );
		var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		this.dataSource = ds.cloneWithRows(['PTT']);
	}
	
	_renderListRow( rowData ) {
		return ( 
			<View>
				<Text>{rowData}</Text>
				<TouchableHighlight onPress={ ()=> {
					console.log( 'removing row=' + rowData );
					console.log( 'removed row=' + rowData );
					} }>
				<Text>Remove</Text></TouchableHighlight>
			</View>
		);
	}
}

export default Setup;