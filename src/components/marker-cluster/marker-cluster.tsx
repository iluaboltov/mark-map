'use client'

import type {Marker} from '@googlemaps/markerclusterer';

import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import { useContext, useEffect, useRef, useState } from "react";

import { MarkerContextType, Markers } from "../../types/type";
import { MarkersContext } from "../mark-map/mark-map";

const MarkerCluster = ({setPoints}: {setPoints: (lat: number, lng: number, id: number, index: number)=> void}) => {
  const { markers, zoom } = useContext(MarkersContext) as MarkerContextType;
  const map = useMap();
  const [clusterMarker, setMarkers] = useState<{[key: string]: Marker}>({});
  const clusterer = useRef<MarkerClusterer | null>(null);

  // Initialize MarkerClusterer
  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({map});
    }
  }, [map]);

  // Update markers
  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(clusterMarker));
  }, [zoom]);

  const setMarkerRef = (marker: Marker | null, key: string) => {
    if (marker && clusterMarker[key]) return;
    if (!marker && !clusterMarker[key]) return;

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
  const onMarkerDragEnd = (e:google.maps.MapMouseEvent, id: number, index: number) => {
    const { latLng } = e;
    if (latLng) {
      const lat = latLng.lat();
      const lng = latLng.lng();

      setPoints(lat, lng, id, index)
    }
  };
  const onPrevious = (index: number) => {
    const lat = index-1 !== -1 ? markers[index-1].lat : markers[markers.length-1].lat
    const lng = index-1 !== -1 ? markers[index-1].lng : markers[markers.length-1].lng
    const position = {lat, lng}
    map?.panTo(position)
  }

  const onNext = (index: number) => {
    const lat = index+1 > markers.length-1 ? markers[0].lat: markers[index+1].lat;
    const lng = index+1 > markers.length-1 ? markers[0].lng: markers[index+1].lng;
    const position = {lat, lng}
    map?.panTo(position)
  }
  return (
    <>
      {markers.map((point: Markers, index: number) => {
        const position = {lat: point.lat, lng: point.lng}

        return (
          <AdvancedMarker
            draggable={true}
            key={index}
            onDragEnd={(e) => onMarkerDragEnd(e, point.id, index)}
            position={position}
            ref={marker => setMarkerRef(marker, `${point.id}`)}
          >
            <div className={'flex flex-col text-xl justify-center items-center p-2 min-h-8 bg-gray-600 rounded-md text-md'}>
              <div className={'flex gap-2 items-center font-extrabold'}>
                <span>
                  &#33;
                </span>
                <span>
                  {point.name}
                </span>
              </div>
              <div className={'flex w-full justify-between'}>
                <span className={'rounded-full bg-orange-500 h-5 w-5 flex items-center justify-center'} onClick={()=> onPrevious(index)}>&#706;</span>
                <span className={'rounded-full bg-orange-500 h-5 w-5 flex items-center justify-center'} onClick={()=> onNext(index)}>&#707;</span>
              </div>
            </div>
          </AdvancedMarker>
        )
      })}
    </>
  )
}

export default MarkerCluster;