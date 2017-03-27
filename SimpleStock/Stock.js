import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  AsyncStorage,
  View
} from 'react-native';

const STORAGE_KEY = '@FavoriteList:key';
const GOOGLE_FIN_API_URL = 'http://www.google.com/finance/info?q=';
const SET_INDEX = 'set:';

class Stock extends Component {
	
	symbol = '+'
	
	constructor( props ) {
		super( props );
		this.state = {
			prefix : this.props.prefix,
			symbol : this.props.symbol,
			isEditable : this.props.isEditable,
			stockList : this.props.stockList,
		};
		this._fetchDataFromAPI( this.state.symbol );
	}
	
	_addOnItemRetrieved ( err, result ) {
		console.log('onItemRetrieved result=' + result );
		this.favoriteList = result;
		this._saveToFavoriteList( this.symbol );
		console.log('Symbol=' + this.symbol + ' saved to fav list');
	}
	
	_handleSymbolAdded( event ) {
		this._saveNewSymbolToDB();
		this.symbol = event.nativeEvent.text;
		this._fetchDataFromAPI( this.symbol );
	}
	
	_saveNewSymbolToDB() {
		AsyncStorage.getItem( STORAGE_KEY, this._addOnItemRetrieved.bind(this) );
	}
	
	_removeSymbolFromDB() {
		AsyncStorage.getItem( STORAGE_KEY, this._removeOnItemRetrieved.bind(this) );
	}
	
	_removeOnItemRetrieved( err, result ) {
		console.log('onItemRetrieved result=' + result );
		this.favoriteList = result;
		this._clearData();
	}
	
	_fetchDataFromAPI( symbol ) {
		if ( symbol !== '+' ) {
		console.log('[_fetchDataFromAPI] loding data for symbol=' + symbol + ' prefix=' + this.state.prefix );
		fetch( GOOGLE_FIN_API_URL + this.state.prefix + symbol )
		  .then(( response ) => response.text() )
		  .then(( resJson ) => {
			//google finance api always return result with prefix // so remove it first!
			var gg = resJson.replace('//',' ');
			var tt = JSON.parse( gg );
			this.setState({
			  symbol : tt[0].t,
			  price : tt[0].l_fix,
			  dir: tt[0].ccol,
			  changePips : tt[0].c,		       
			  changePercent : tt[0].cp
			});
		  })
		  .catch((error) => {
			console.log(error);
		  });
		}
		else {
			console.log('skip loading data for symbol='+symbol );
		}
		console.log('done fetching data symbol=' + this.state.symbol );
	}
	
	_find( val ) {
		console.log('val=' + val );
		return val.localeCompare( this.state.symbol.toLowerCase() ) === 0;
	}
	
	_clearData() {
		if (this.favoriteList === null ) {
			return;
		}
		console.log('current favoriteList[raw]=' + this.favoriteList );
		var arrayFavList = this.favoriteList.split(',');
		console.log('current favoriteList[array]=' + arrayFavList );
		var index = arrayFavList.findIndex( this._find.bind(this) );
		console.log('deleting symbol='+ this.state.symbol.toLowerCase() + ' at index=' + index );
		arrayFavList.splice( index, 1 );
		var favStr = arrayFavList.toString();
		console.log('current favoriteList=' + favStr );
		
		try {
			console.log('new favoriteListStr=' + favStr );
			AsyncStorage.setItem( STORAGE_KEY, favStr );		
			console.log('saved to favoriteList=' + favStr );
			this.setState({
				dir: '',
				symbol: '+',
				favoriteList : favStr,
			});
		} catch (error) {
			console.error('failed to save to favoriteList symbol=' + symbol + ' error=' + error );
		}
	}
	
	_onPress() {
		if ( this.state != null && this.state.isEditable ) {
			this._removeSymbolFromDB();
		}
	}
	
	_saveToFavoriteList( symbol ) {
		console.log('saving to favoriteList symbol=' + symbol );
		try {
			var arrayFavList;
			if ( this.favoriteList != null ) {
				console.log('current favoriteList[raw]=' + this.favoriteList );
				arrayFavList = this.favoriteList.split();
			}
			else {
				console.log('current favoriteList[raw] is null');
				arrayFavList = [];
			}
			console.log('current favoriteList[array]=' + arrayFavList );
			arrayFavList.push( symbol );
			console.log('new favoriteList[array]=' + arrayFavList );
			var saveStr = arrayFavList.toString();
			AsyncStorage.setItem( STORAGE_KEY, saveStr );		
			console.log('saved to favoriteList=' + saveStr );
			this.favoriteList = saveStr;
			console.log('this.favoriteList=' + this.favoriteList );
		} catch (error) {
			console.error('failed to save to favoriteList symbol=' + symbol + ' error=' + error );
		}
	}
	
  render() {
	if ( this.state.dir=='chg' ) {
		return (      
		<TouchableHighlight onPress={this._onPress.bind(this)}>
		<View style={styles.row}>
			<Text style={styles.bigText}>
			  {this.state.symbol}
			</Text>
			<Text style={styles.upText}>
				{this.state.price}
			</Text>
			<View style={styles.list}>
				<Text style={styles.upSmallText}>
					{this.state.changePips}
				</Text>
				<Text style={styles.upSmallText}>
					{this.state.changePercent}%
				</Text>
			</View>
		</View></TouchableHighlight>);
	}
	else if ( this.state.dir=='chb') {
		return (      
		<TouchableHighlight onPress={this._onPress.bind(this) }>
		<View style={styles.row}>
			<Text style={styles.bigText}>
			  {this.state.symbol}
			</Text>
			<Text style={styles.noMoveText}>
				{this.state.price}
			</Text>
			<View style={styles.list}>
				<Text style={styles.noMoveSmallText}>
					{this.state.changePips}
				</Text>
				<Text style={styles.noMoveSmallText}>
					{this.state.changePercent}%
				</Text>
			</View>
		</View></TouchableHighlight>);
	}
	else if ( this.state.dir=='chr') {
	return (      
		<TouchableHighlight onPress={this._onPress.bind(this)}>
		<View style={styles.row}>
			<Text style={styles.bigText}>
			  {this.state.symbol}
			</Text>
			<Text style={styles.downText}>
				{this.state.price}
			</Text>
			<View style={styles.list}>
				<Text style={styles.downSmallText}>
					{this.state.changePips}
				</Text>
				<Text style={styles.downSmallText}>
					{this.state.changePercent}%
				</Text>
			</View>
		</View></TouchableHighlight>);
	}
	else {
		if ( this.state.symbol == '+' ) {
			return ( 
				<TouchableHighlight onPress={this._onPress.bind(this)}>
				<View style={styles.row}>
					<TextInput 
						placeholder='Add Symbol'						
						returnKeyType='go'
						onSubmitEditing={this._handleSymbolAdded.bind(this)}
						style={styles.textInput}/>
				</View>
				</TouchableHighlight> );
		}
		else {
			return ( 
				<TouchableHighlight onPress={this._onPress.bind(this)}>
					<View style={styles.row}>
					<Text style={styles.bigText}>
						Loading...
					</Text>
					</View>
				</TouchableHighlight>
			);
		}
	}
  }
}

var styles = StyleSheet.create({
	list: {
		justifyContent: 'flex-start',
		flexDirection: 'row',
		margin: 0,
		borderWidth: 0,
		flexWrap: 'wrap'
	},
	row: {
		justifyContent: 'center',
		padding: 0,
		width: 160,
		height: 100,
		margin: 2,
		backgroundColor: '#F6F6F6',
		alignItems: 'center',
		borderWidth: 1,
		borderRadius: 0,
		elevation: 0,
		borderColor: '#CCC'
	},
	textInput: {
		fontSize: 20,
		width : 120
	},	

  bigText: {
    flex: 1,
    fontSize: 25,
    textAlign: 'center',
    margin: 0,
    color: 'black'
  },
  downText: {
    flex: 1,
    fontSize: 25,
    textAlign: 'center',
    color: 'red'
  },
  noMoveText: {
    flex: 1,
    fontSize: 25,
    textAlign: 'center',
    color: 'black'
  },
  upText: {
    flex: 1,
    fontSize: 25,
    textAlign: 'center',
    color: 'green'
  },
   downSmallText: {
    flex: 1,
	paddingRight: 15,
    fontSize: 20,
    textAlign: 'center',
    color: 'red'
  },
   noMoveSmallText: {
    flex: 1,
	paddingRight: 15,
    fontSize: 20,
    textAlign: 'center',
    color: 'black'
  },
  upSmallText: {
    flex: 1,
	paddingRight: 15,
    fontSize: 20,
    textAlign: 'center',
    color: 'green'
  }
})

module.exports = Stock;