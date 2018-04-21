import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import React, { Component } from 'react';
import CircularProgress from 'material-ui/CircularProgress';

export class MapContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeMarker: null,
      showingInfoWindow: false,
      selectedOrg: {}
    };

    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.getMarkers = this.getMarkers.bind(this);
    this.getCenter = this.getCenter.bind(this);
  }

  onMarkerClick(props, marker, e) {
    this.setState({
      activeMarker: marker,
      showingInfoWindow: true,
      selectedOrg: props.org
    });
  }

  getMarkers(orgs) {
    return orgs.map((org, index) => {
      return <Marker key={index} org={org} position={{ lat: org.locationLat, lng: org.locationLong }} onClick={this.onMarkerClick} />
    });
  }
  
  getCenter(){
    if(this.props.searchQuery.initLat != null && this.props.searchQuery.initLng != null){
    return { lat: parseFloat(this.props.searchQuery.initLat), lng: parseFloat(this.props.searchQuery.initLng) }
      
  }else{
      const org = this.props.orgResults.find((org) => {
        return org.locationLat !== null && org.locatioNLat !== "null"
      });
      if(org){
            return { lat: org.locationLat, lng: org.locationLong }
      }
    }
  }

  render() {

    return (
      <div className="__map-results-container">
        <Map
          google={this.props.google}
          zoom={10}
          initialCenter={this.getCenter()}
        >
          {this.getMarkers(this.props.orgResults)}
          <InfoWindow marker={this.state.activeMarker} visible={this.state.showingInfoWindow} >
            <div className="test">
              <p><b>{this.state.selectedOrg.name}</b></p>
              <a target="__blank" href={
                `http://maps.google.com/?ll=${this.state.selectedOrg.locationLat},${this.state.selectedOrg.locationLong}`
              }>Get directions to here.</a>
            </div>
          </InfoWindow>
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: ('AIzaSyBq0ndtKNoxQzLclexVhU2U9YA7jscQnbs'),
  LoadingContainer: CircularProgress
})(MapContainer)

