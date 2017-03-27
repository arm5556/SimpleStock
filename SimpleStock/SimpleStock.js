import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  ToolbarAndroid,
  DrawerLayoutAndroid,
  ListView,
  TouchableHighlight,
  Navigator,
  AsyncStorage,
  MapView,
  View
} from 'react-native';

import About from './About';
import Portfolio from './Portfolio';
import Setup from './Setup';
import GeolocationExample from './GeolocationExample';
import SimpleMap from './SimpleMap';
import SimpleMapGeolocation from './SimpleMapGeolocation';

const STORAGE_KEY = '@FavoriteList:key';
const MAX_FAVORITE = 10;

var SimpleStock = React.createClass({
  
  statics: {
    title: '<ToolbarAndroid>',
    description: 'Examples of using the Android toolbar.'
  },
  
  getInitialState() {
	this._loadInitialState();
	var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
	
    return {
      actionText: 'Favorites',
      toolbarSwitch: false,
	  dataSource: ds.cloneWithRows(['Favorites','World Markets','SET50','Bank','MapViewAPI','GeolocationAPI','About']),
      favoriteList : ['+','+','+','+','+','+','+','+','+','+'],
	  colorProps: {
        titleColor: '#3b5998',
        subtitleColor: '#6a7180',
      },
    };
  },
  
  _closeDrawer() {
	console.log('close Drawer');
	this.drawer.closeDrawer();
  },
  
  _nevigateToRow( rowStr ) {
	console.log('navigate to ' + rowStr );
	this.drawer.closeDrawer();
	this.setState({
      actionText: rowStr
    });
	this.nav.push( { id: rowStr, name: rowStr } );
  },
  
  _openDrawer() {
	console.log('open Drawer');
	this.drawer.openDrawer();
  },
  
	_renderNavMenu( rowData ) {
		return (
		<TouchableHighlight 
			style={styles.menu}
			onPress={ ()=> { this._nevigateToRow( rowData ) } } >
			<Text style={styles.menuFont} >{rowData}</Text>
		</TouchableHighlight> );
	},
	
	_renderSeperator: function(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={{
          height: ( rowID == 0 || rowID == 3 ||  rowID == 5 ) ? 4 : 1,
          backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC',
        }}
      >
	  </View>
    );
  },
  
	_renderNavView() {
		return (       
			<View>
			<ListView
				style={styles.drawerMenu}
				dataSource={this.state.dataSource}
				renderSeparator={this._renderSeperator}
				renderRow={this._renderNavMenu} />
			</View> ) 
	},
  
  
	_createEmptyRoom( vals ) {
		for( i=vals.length; i<MAX_FAVORITE; i++ ) {
			vals.push('+');
		}
	},
  
	async _loadInitialState() {
		try {
			var value = await AsyncStorage.getItem( STORAGE_KEY );			
			if (value !== null){
				var arrayVals = value.split(',');
				this._createEmptyRoom( arrayVals );
				console.log( 'arrayVals=' + arrayVals );
				this.setState( { favoriteList: arrayVals } );
				console.log('loaded favouriteList=' + arrayVals );
				this._nevigateToRow( 'Favorites' );
			} else {
				console.log('value not found, key=' + STORAGE_KEY );
				var arrayVals = '+'.split(',');
				this._createEmptyRoom( arrayVals );
				console.log( 'arrayVals=' + arrayVals );
				this.setState( { favoriteList: arrayVals } );
				console.log('loaded favouriteList=' + arrayVals );
				this._nevigateToRow( 'Favorites' );
			}
		} catch (error) {
			console.error('failed to retrieve value for key=' + STORAGE_KEY + ' error='+error );
		}
	},
	
	_renderScene( route ) {
		switch (route.id) {
			case 'World Markets': 
				return <Portfolio
							isEditable={false}
							prefix={''}
							list={['INDEXHANGSENG:HSI','INDEXNIKKEI:NI225','SHA:000001','INDEXDB:DAX','INDEXSTOXX:SX5E','INDEXDJX:DJI']}
						/>;
			case 'Favorites': 
				return <Portfolio
							isEditable={true}
							prefix={'set:'}
							list={this.state.favoriteList}
						/>;
			case 'SET50':
				return <Portfolio
							isEditable={false}
							prefix={'set:'}
							list={['ADVANC','AOT','BA','BANPU','BBL','BCP','BDMS','BEC','BH','BLA','BTS','CBG','CENTEL','CK','CPALL','CPF','CPN','DELTA','DTAC','EGCO','GLOW','HMPRO','INTUCH','IRPC','ITD','IVL','JAS','KBANK','KTB','LH','M','MINT','PS','PTT','PTTEP','PTTGC','ROBINS','SAWAD','SCB','SCC','SCCC','TASCO','TCAP','TMB','TOP','TPIPL','TRUE','TTW','TU','WHA']}
						/>;	
			case 'Bank': 
				return <Portfolio
							isEditable={false}
							prefix={'set:'}
							list={['BAY','BBL','CIMBT','KBANK','KKP','KTB','LHBANK','SCB','TCAP','TISCO']}
						/>;
			case 'Edit':
				return <Setup/>;
			case 'About':
				return <About/>;
			case 'GeolocationAPI' :
				return <SimpleMapGeolocation/>;
			case 'MapViewAPI':
				return <SimpleMap/>;
			default: 
				return ( 
					<View>
						<Text style={styles.menuFont}>Loading... {route.id}</Text>
					</View> );
	  };
	},
  
  render() {	
    return (
      <DrawerLayoutAndroid
        drawerWidth={250}
		ref ={ ( drawer )=>{ this.drawer = drawer } }
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={this._renderNavView}>  
		<View 
			title='ToolbarAndroid'>
        <ToolbarAndroid
          actions={toolbarActions}
		  navIcon={ require('./nav.png')}
          onActionSelected={this._onActionSelected}
		  onIconClicked={this._openDrawer}
          style={styles.toolbar}
          subtitle={this.state.actionText}
          title='Stock Watchlist' />
		</View>
		<Navigator
			ref = { (nav) => {this.nav = nav} } 
			initialRoute={{ id: 'Setup', name: 'Setup' }}
			renderScene={this._renderScene}/>
      </DrawerLayoutAndroid>      
    );
  },
  
  _onActionSelected(position) {
    this.setState({
      actionText: 'Selected ' + toolbarActions[position].title,
    });
  },
  
});

var toolbarActions = [
  {title: 'Refresh', icon: require('./refresh.png'), show: 'always'},
  {title: 'Settings', icon: require('./trash.png'), show: 'never'},
  {title: 'About'},
];

var styles = StyleSheet.create({
	drawerMenu: {
		backgroundColor: 'white',
	},
	 map: {
		height: 150,
		margin: 10,
		borderWidth: 1,
		borderColor: '#000000',
	},
	menuFont: {
		fontSize: 25,
	},
	menu: {
		margin: 3,
		borderWidth: 0
	},
	toolbar: {
		backgroundColor: '#F6F6F6',
		height: 60,
	},
});

export default SimpleStock;