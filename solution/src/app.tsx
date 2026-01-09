/**
 * Copyright 2024 Google LLC
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *    https://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

import React, {useEffect, useState, useRef, useCallback} from 'react';
import {createRoot} from 'react-dom/client';

import {
  APIProvider,
  Map,
  useMap,
  AdvancedMarker,
  InfoWindow,
  MapCameraChangedEvent,
  Pin,
  useAdvancedMarkerRef
} from '@vis.gl/react-google-maps';

import {MarkerClusterer} from '@googlemaps/markerclusterer';
import type {Marker} from '@googlemaps/markerclusterer';

import {Circle} from './components/circle'

type Poi ={ key: string, name: string, address: string, description: string, currencies: string, showInfo: boolean, location: google.maps.LatLngLiteral }
const locations: Poi[] = [
  { key: 'alpineGold', name: 'Alpine Gold Exchange', address1: '1800 Elm St', address2: 'Manchester, NH 03104', description: 'Buy, sell, pawn, and exchange precious metals', currencies: 'gold, silver, Goldbacks', phone: '(603) 836-8814', showInfo: false, location: { lat: 43.0047529, lng: -71.4689036 }},
];

const hideAllInfo = () => {
  for (let i = 0; i < locations.length; i++) {
    locations[i].showInfo = false;
  }
};

const App = () => (
  <APIProvider apiKey={'AIzaSyCZiZTseixjlpxMb3BJgcKzDwywqe3cXxQ'} onLoad={() => console.log('Maps API has loaded.')}>
    <Map
      defaultZoom={8.5}
      defaultCenter={{ lat: 44.0, lng: -71.9 }}
      onCameraChanged={ (ev: MapCameraChangedEvent) =>
        console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
      }
      mapId='da37f3254c6a6d1c'
      >
    <PoiMarkers pois={locations} />
    </Map>
  </APIProvider>
);

const PoiMarkers = (props: { pois: Poi[] }) => {
  const map = useMap();
  const [markers, setMarkers] = useState<{[key: string]: Marker}>({});
  const clusterer = useRef<MarkerClusterer | null>(null);
  const [circleCenter, setCircleCenter] = useState(null)
  const handleClick = poi => (useCallback((ev: google.maps.MapMouseEvent) => {
    if(!map) return;
    if(!ev.latLng) return;
    console.log('marker clicked: ', ev.latLng.toString());
    map.panTo(ev.latLng);
    setCircleCenter(ev.latLng);
    poi.showInfo = true;
  }));
  const handleClose = poi => {
    poi.showInfo = false;
  };
  // Initialize MarkerClusterer, if the map has changed
  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({map});
    }
  }, [map]);

  // Update markers, if the markers array has changed
  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  const setMarkerRef = (marker: Marker | null, key: string) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;

    setMarkers(prev => {
      if (marker) {
        return {...prev, [key]: marker};
      } else {
        const newMarkers = {...prev};
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };

  return (
    <>
      <Circle
          radius={800}
          center={circleCenter}
          strokeColor={'#0c4cb3'}
          strokeOpacity={1}
          strokeWeight={3}
          fillColor={'#3b82f6'}
          fillOpacity={0.3}
        />
      {props.pois.map( (poi: Poi) => {
        const [markerRef, marker] = useAdvancedMarkerRef();
        console.log(poi);
        return (
          <div key={poi.key}>
            <AdvancedMarker
              ref={markerRef}
              position={poi.location}
              clickable={true}
              onClick={handleClick(poi)}
              >
                <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
            </AdvancedMarker>
            {poi.showInfo && <InfoWindow anchor={marker} onClose={() => handleClose(poi)}>
                <p><strong>{poi.name}</strong></p>
                <p>{poi.description}</p>
                <p>Accepts: {poi.currencies}</p>
                <p>{poi.address1}</p>
                <p>{poi.address2}</p>
                <p>{poi.phone}</p>
            </InfoWindow>}
          </div>
        );
      })}
    </>
  );
};

export default App;

const root = createRoot(document.getElementById('app'));
root.render(
      <App />
  );

