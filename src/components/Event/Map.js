import React from 'react'
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";

class EventMap extends React.Component {

  render() {


  		let center = {lat : this.props.lat * 1, lng : this.props.long * 1};
      let height = this.props.height ? this.props.height : "350px";  

      const MapWithAMarker = withScriptjs(withGoogleMap(props =>
        <GoogleMap
          defaultZoom={15}
          defaultCenter={center}
        >
          <Marker
            position={center}
          />
        </GoogleMap>
      ));

      return <MapWithAMarker
                    googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyDW9PMbvG5P5IaS1-ePyW_Q7VkHN2u36x8"
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: height }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                  />
	}
}
export default EventMap