import React from "react";
import ReactMapGL, {Marker, NavigationControl, Popup} from 'react-map-gl';
import Locator from './imgs/icon.png';
import Button from '@material-ui/core/Button';
import useMap from '../custom_hooks/useMap';
import { useSelector } from 'react-redux'
import {  useDispatch } from "react-redux";
import {updateSelectedPlace} from '../actions/mapActions';
import {setOpen} from '../actions/selectionAction';

function Map() {
 
  const {
    latitude, longitude,view, 
    setview, callPlaceById, goToViewPort
  } = useMap();

  //state from redux array
const places = useSelector(state => state.coords);
const dispatch = useDispatch();
const reduxSelectedPlace = useSelector(state => state.selectedPlace);

 return(
    <div>
       <ReactMapGL
        //mapStyle='mapbox://styles/mapbox/satellite-v9'
         mapStyle="mapbox://styles/mapbox/dark-v9"
        // mapStyle='mapbox://styles/mapbox/streets-v9'
        {...view}
        mapboxApiAccessToken={process.env.REACT_APP_TOKEN}
        onViewportChange={view =>{
        setview(view);}}
        width="100%" // It always override the view(viewport) width state.
        height="100vh" // It always override the view(viewport) height state.
      >
     
      <div style={{position: 'absolute', right: 0, margin: 10}}>
          <NavigationControl />
        </div>

        {places && places.map(place =>{
         
          return(
            <Marker key={place.id} latitude={place.venue.location.lat} longitude={place.venue.location.lng}>
              <Button className={'btn-locator'} 
              onClick={e => {
                e.preventDefault();
                dispatch(updateSelectedPlace(place.venue));

                goToViewPort(place.venue.location.lat, place.venue.location.lng);
              }}>
            <img src={Locator} alt='locator' style={{width: '30px', height: '30px'}}
              onClick={id => callPlaceById(place.venue.id)}
            />
              </Button>

            </Marker>
          )
        })}

        {/* find me marker */}
        <Marker latitude={latitude} longitude={longitude}>
          <img src={Locator} alt='locator' style={{width: '30px', height: '30px'}}/>
        </Marker>

         {reduxSelectedPlace && (
           <Popup closeOnClick={false} latitude={reduxSelectedPlace.location.lat} longitude={reduxSelectedPlace.location.lng}
           onClose={() =>{
            dispatch(updateSelectedPlace(null));
          }}
           >
          <h2>{reduxSelectedPlace.name}</h2>
         <p>{reduxSelectedPlace.location.formattedAddress[0]}</p>
         <Button onClick={() => {
            callPlaceById(reduxSelectedPlace.id);
            dispatch(setOpen(true));
         }}>
           Place Details
         </Button>
           </Popup>
         )}
    </ReactMapGL>
 
    </div>
 ) 
 
}

export default Map;