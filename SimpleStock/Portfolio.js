import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  ListView,
  TouchableHighlight,
  ScrollView,
  View
} from 'react-native';

import Stock from './Stock';

class Portfolio extends Component {
	
	constructor(props) {
		super(props);
		console.log('init favorites view isEditable=' + this.props.isEditable );
		console.log('init favorites view prefix=' + this.props.prefix );
		console.log('init favorites view props.list=' + this.props.list );
		var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		this.state = {
			prefix: this.props.prefix,
			isEditable: this.props.isEditable,
			dataSource: ds.cloneWithRows( this.props.list ),
		};
		console.log('init favorites view dataSource=' + this.state.dataSource );
	}
	
	_renderListRow( rowData ) {
		console.log('creating stock view for symbol='+ rowData );
		return ( 
			<Stock
				isEditable={ this.state.isEditable }
				prefix={ this.state.prefix }
				symbol={ rowData }
				stockList={this.props.list}
			/>
		);
	}
	
	render() {
		console.log('render favorites view datasource=' + this.state.dataSource);
		return (	
			<ListView
				style={styles.mainView}
				contentContainerStyle={styles.list}
				dataSource={this.state.dataSource}
				renderRow={this._renderListRow.bind(this)}
			/>		
		)	
	}
}

var styles = StyleSheet.create({
	mainView: {
		backgroundColor: '#FFFFFF',
	},
	list: {
		justifyContent: 'flex-start',
		flexDirection: 'row',
		margin: 10,
		flexWrap: 'wrap'
	}
});

export default Portfolio;