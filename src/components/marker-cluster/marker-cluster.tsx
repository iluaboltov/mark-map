'use client'

import type {Marker} from '@googlemaps/markerclusterer';

import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import { useContext, useEffect, useRef, useState } from "react";

import { MarkerContextType, Markers } from "../../types/type";
import { MarkersContext } from "../mark-map/mark-map";

const MarkerCluster = ({setPoints, zoom}: {setPoints: (lat: number, lng: number, id: number, index: number)=> void, zoom: number}) => {
  const { marks } = useContext(MarkersContext) as MarkerContextType;
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
    })
  }
  const onMarkerDragEnd = (e:google.maps.MapMouseEvent, id: number, index: number) => {
    const { latLng } = e;
    if (latLng) {
      const lat = latLng.lat();
      const lng = latLng.lng();

      setPoints(lat, lng, id, index)
    }
  };
  const onPrevious = (index: number) => {
    const lat = index-1 !== -1 ? marks[index-1].lat : marks[marks.length-1].lat
    const lng = index-1 !== -1 ? marks[index-1].lng : marks[marks.length-1].lng
    const position = {lat, lng}
    map?.panTo(position)
  }

  const onNext = (index: number) => {
    const lat = index+1 > marks.length-1 ? marks[0].lat: marks[index+1].lat;
    const lng = index+1 > marks.length-1 ? marks[0].lng: marks[index+1].lng;
    const position = {lat, lng}
    map?.panTo(position)
  }
  return (
    <>
      { !!marks && marks.map((point: Markers, index) => {
        const position = {lat: point.lat, lng: point.lng}

        return (
          <AdvancedMarker
            draggable={true}
            key={index}
            onDragEnd={(e) => onMarkerDragEnd(e, point.id, index)}
            position={position}
            ref={marker => setMarkerRef(marker, `${index}`)}
          >
            <div className={'relative flex flex-col text-md justify-center items-center p-2 min-h-8 bg-[#4285F4] rounded-[8px] text-md'}>
              <div className={'flex gap-2 items-center font-extrabold'}>
                <span>
                  {point.name}
                </span>
              </div>
              <span className={'absolute top-full left-1/2 -translate-x-1/2 border-t-[8px] border-[#4285F4] border-r-[8px] border-r-transparent border-l-[8px] border-l-transparent'}></span>
              <span className={'absolute top-1/2 -translate-y-1/2 -left-6 rounded-full bg-orange-500 h-5 w-5 flex items-center justify-center'} onClick={()=> onPrevious(index)}>&#706;</span>
              <span className={'absolute top-1/2 -translate-y-1/2 -right-6 rounded-full bg-orange-500 h-5 w-5 flex items-center justify-center'} onClick={()=> onNext(index)}>&#707;</span>
            </div>
          </AdvancedMarker>
        )
      })}
    </>
  )
}

export default MarkerCluster;