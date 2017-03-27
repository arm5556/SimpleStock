var React = require('react');
var ReactNative = require('react-native');
var {
  StyleSheet,
  PropTypes,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} = ReactNative;

var MapView = require('react-native-maps');
import PriceMarker from './PriceMarker';

class SimpleMapGeoplocation extends React.Component {

	constructor(props) {
		super(props);
		
		this.state = {
			coordinate: {
				latitude: 37.78825,
				longitude: 97.4324,
			},
			region: {
				latitude: 37.78825,
				longitude: 97.4324,
				latitudeDelta: 0.0122,
				longitudeDelta: 0.0421,
			}
		};
	}
	
	componentDidMount() {
		navigator.geolocation.getCurrentPosition(
		  (position) => {
			console.log( 'current pos=' + position );
			var initialPosition = JSON.stringify(position);
			this.setState({initialPosition});
			this.state.coordinate = { 
				latitude: position.coords.latitude,
				longitude: position.coords.longitude,
			};
			this.state.region = {
				latitude: position.coords.latitude,
				longitude: position.coords.longitude,
				latitudeDelta: 0.0122,
				longitudeDelta: 0.0421,
			};
		  },
		  (error) => alert(error.message),
		  {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
		);
		this.watchID = navigator.geolocation.watchPosition((position) => {
		  var lastPosition = JSON.stringify(position);
		  this.setState({lastPosition});
		  this.state.coordinate = { 
				latitude: position.coords.latitude,
				longitude: position.coords.longitude,
			};
			this.state.region = {
				latitude: position.coords.latitude,
				longitude: position.coords.longitude,
				latitudeDelta: 0.0122,
				longitudeDelta: 0.0421,
			};
		});
	}

	onRegionChange(region) {
	  console.log( 'onRegionChange region=' + region );
	}

	render() {
	  return (
		<View>
		<Text>
          <Text style={styles.title}>Initial position: </Text>
          {this.state.initialPosition}
        </Text>
        <Text>
          <Text style={styles.title}>Current position: </Text>
          {this.state.lastPosition}
        </Text>
		<MapView
		  style={styles.map}
		  region={this.state.region}
		  onRegionChange={this.onRegionChange}>
		    <MapView.Marker coordinate={this.state.coordinate}>
				<PriceMarker 
					markerTxt='Here'
					amount={this.state.amount} />
			</MapView.Marker>
		</MapView>
		</View>
	  );
	}
}

var styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
	height: 400,
	width: 400,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
});

module.exports = SimpleMapGeoplocation;